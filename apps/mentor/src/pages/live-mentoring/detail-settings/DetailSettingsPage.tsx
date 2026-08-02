import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  isNotFound,
  useLiveMentoringSettingsQuery,
  useLiveMentoringTemplateQuery,
  useStartEditLiveMentoringMutation,
  useUpdateLiveMentoringTemplateMutation,
} from '@/api/live-mentoring/liveMentoring';
import type {
  LiveMentoringStatus,
  LiveMentoringTemplate,
} from '@/api/live-mentoring/liveMentoringSchema';
import MentorAlertModal from '@/common/modal/MentorAlertModal';
import { useMentorAlert } from '@/hooks/useMentorAlert';
import {
  findBlankRequiredFields,
  isValidVideoUrl,
  toTemplatePayload,
  VIDEO_URL_FORMAT_HINT,
} from './templatePayload';
import TemplateEditForm from './ui/TemplateEditForm';
import TemplatePreview from './ui/TemplatePreview';

/**
 * 상태별 안내 — PRD 4장 표 그대로. 잠긴 상태는 이유를, 편집 가능한 상태는 다음 할 일을 알린다.
 *
 * 편집 가능 여부는 서버 `LiveMentoringStatus.isEditable()` 을 따른다
 * (`DRAFT`·`REJECTED` 만 편집 가능).
 *
 * 검토 요청은 이 화면이 아니라 오픈 설정의 `오픈하기` 버튼이 보낸다. 멘토는 상세 설정을 자주 열지
 * 않으므로, 다음 할 일은 여기서 누를 버튼이 아니라 오픈 설정으로 가는 길로 안내한다
 * (배너 우측에 오픈 설정 링크가 붙어 있다).
 */
const STATUS_NOTICE: Record<
  LiveMentoringStatus,
  { label: string; description: string }
> = {
  DRAFT: {
    label: '작성 중',
    description:
      '상세 작성을 마쳤다면 오픈 설정에서 오픈하기를 누르면 검토가 요청됩니다. 관리자 승인 후 개설할 수 있습니다.',
  },
  PENDING_REVIEW: {
    label: '검토 중',
    description:
      '관리자 검토 중이라 상세 페이지를 수정할 수 없습니다. 검토 결과를 기다려주세요.',
  },
  APPROVED: {
    label: '승인 완료',
    description:
      '승인된 상세 페이지는 수정할 수 없습니다. 내용을 고치려면 수정 시작을 눌러주세요.',
  },
  REJECTED: {
    label: '반려',
    description:
      '반려됐습니다. 내용을 수정한 뒤 오픈 설정에서 오픈하기를 누르면 다시 검토가 요청됩니다.',
  },
  INACTIVE: {
    label: '비활성',
    description: '비활성 상품이라 상세 페이지를 수정할 수 없습니다.',
  },
};

/** 활성 개설이 있으면 상태와 무관하게 잠긴다 — 서버 `isEditable()` 의 두 번째 조건. */
const ACTIVE_OPENING_NOTICE = {
  label: '오픈 중',
  description:
    '진행 중인 개설이 있어 상세 페이지를 수정할 수 없습니다. 개설이 종료된 뒤에 수정할 수 있습니다.',
};

/** 활성 개설이 있으면 승인본 수정을 시작할 수 없다 — 서버 `LiveMentoring.startEditing()`. */
const START_EDIT_BLOCKED_REASON =
  '진행 중인 개설이 있어 수정을 시작할 수 없습니다. 개설이 종료된 뒤에 가능합니다.';

/**
 * 상태 전이 실패 사유를 그대로 보여준다 — 오픈 설정 화면의 `saveErrorDescription` 과 같은 방식이다.
 *
 * 공용 axios 인터셉터(`@letscareer/api`)가 서버 에러를 `ApiError` 로 재포장하면서
 * `code`/`message` 를 최상위 속성으로 올린다. 이걸 감추면 상태가 이미 바뀐 것인지
 * (`LIVE_MENTORING_INVALID_STATE`), 상품이 없는 것인지(`LIVE_MENTORING_NOT_FOUND`)를 알 수 없다.
 */
const transitionErrorDescription = (error: unknown): string | undefined => {
  const apiError = error as { code?: string; message?: string } | null;
  if (!apiError?.message) return undefined;
  return apiError.code
    ? `${apiError.message} (${apiError.code})`
    : apiError.message;
};

const DetailSettingsPage = () => {
  const { data, isError, error } = useLiveMentoringTemplateQuery();
  // 헤드라인·미리보기에 쓸 닉네임은 오픈 설정(프로필 참조 값)에서 가져온다.
  const { data: settings } = useLiveMentoringSettingsQuery();
  const { mutate: save, isPending } = useUpdateLiveMentoringTemplateMutation();
  const { mutate: startEdit, isPending: isStartingEdit } =
    useStartEditLiveMentoringMutation();
  const { alertProps, showAlert, showConfirm } = useMentorAlert();

  const [template, setTemplate] = useState<LiveMentoringTemplate | null>(null);
  /**
   * 기본은 읽기 모드다.
   * 멘토가 이 화면에 오는 이유는 대부분 "지금 뭐라고 나가고 있나" 확인이라,
   * 곧바로 편집 상태로 두면 실수로 값을 바꾸기 쉽다.
   */
  const [isEditing, setIsEditing] = useState(false);

  /**
   * 편집 가능 여부는 서버가 계산해 준 `mentoring.editable` 하나로 판정한다 —
   * 상태(`DRAFT`·`REJECTED`)와 활성 개설 유무를 FE 가 다시 조합하지 않는다.
   */
  const isEditable = template?.mentoring.editable ?? false;
  const canEdit = isEditing && isEditable;

  // 오픈 설정 타입에 따라 서버가 내려준 기본 템플릿을 로드한다.
  useEffect(() => {
    if (data) setTemplate(data);
  }, [data]);

  const header = (
    <header className="flex flex-col gap-2">
      <h1 className="text-medium22 text-neutral-10 font-semibold leading-8">
        상세 페이지 설정
      </h1>
      <p className="text-xsmall14 text-neutral-40">
        {canEdit
          ? '좌측에서 고친 내용이 우측 미리보기에 즉시 반영됩니다.'
          : '공개 상세 페이지에 지금 나가고 있는 내용입니다. 고치려면 수정하기를 눌러주세요.'}
      </p>
    </header>
  );

  /*
   * 404(`LIVE_MENTORING_NOT_FOUND`)는 오류가 아니라 정상 흐름이다 —
   * 오픈 설정을 한 번도 저장하지 않은 멘토에게는 상품 자체가 없다.
   * 오류 화면 대신 무엇을 먼저 해야 하는지 알린다.
   */
  if (isError) {
    return (
      <div className="flex flex-col gap-6 pb-24">
        {header}
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 px-6 py-16 text-center">
          {isNotFound(error) ? (
            <>
              <p className="text-xsmall16 text-neutral-10 font-semibold">
                아직 만들어진 상품이 없습니다.
              </p>
              <p className="text-xsmall14 text-neutral-40">
                오픈 설정에서 제목·카테고리를 먼저 저장하면 상세 페이지를 편집할
                수 있습니다.
              </p>
              <Link
                to="/live-mentoring/open-settings"
                className="border-primary text-primary hover:bg-primary mt-4 rounded-lg border bg-white px-6 py-2.5 text-sm font-medium transition-colors hover:text-white"
              >
                오픈 설정으로 이동
              </Link>
            </>
          ) : (
            <>
              <p className="text-xsmall16 text-neutral-10 font-semibold">
                상세 페이지를 불러오지 못했습니다.
              </p>
              <p className="text-xsmall14 text-neutral-40">
                잠시 후 다시 시도해주세요.
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="text-xsmall14 text-neutral-40 px-1 py-10">
        템플릿을 불러오는 중...
      </div>
    );
  }

  const status = template.mentoring.status;
  const hasActiveOpening = template.currentOpening !== null;

  /** 잠긴 이유는 활성 개설이 상태보다 구체적이라 먼저 본다. */
  const notice =
    !isEditable && hasActiveOpening
      ? ACTIVE_OPENING_NOTICE
      : STATUS_NOTICE[status];

  /** 수정 시작은 `APPROVED` 에서만, 활성 개설이 없을 때만 가능하다 — 서버 `startEditing()`. */
  const canStartEdit = status === 'APPROVED';

  const patch = (partial: Partial<LiveMentoringTemplate>) =>
    setTemplate((prev) => (prev ? { ...prev, ...partial } : prev));

  /*
   * 검증은 실제로 보낼 payload 를 대상으로 렌더마다 다시 계산한다 —
   * state 로 들고 있으면 입력과 어긋나고, 정규화 전 값을 검사하면 판정이 달라진다.
   */
  const payload = toTemplatePayload(template);
  const blankRequiredFields = findBlankRequiredFields(payload);
  const hasInvalidVideoUrl = !isValidVideoUrl(payload.video.videoUrl);

  const handleSave = () => {
    if (blankRequiredFields.length > 0) {
      showAlert({
        title: '아직 채우지 않은 항목이 있습니다.',
        description: blankRequiredFields.join(', '),
        variant: 'error',
      });
      return;
    }

    if (hasInvalidVideoUrl) {
      showAlert({
        title: '영상 임베드 URL 형식이 올바르지 않습니다.',
        description: VIDEO_URL_FORMAT_HINT,
        variant: 'error',
      });
      return;
    }

    save(payload, {
      onSuccess: () => {
        setIsEditing(false);
        showAlert({ title: '저장되었습니다.', variant: 'success' });
      },
      onError: () =>
        showAlert({ title: '저장에 실패했습니다.', variant: 'error' }),
    });
  };

  /**
   * 수정 시작 — 승인본이 `DRAFT` 로 돌아가 공개 노출에서 빠지므로 한 번 되묻는다.
   * 되돌리면 재승인이 필요하다는 것과, 그 재승인이 어디서 시작되는지를 함께 알린다.
   */
  const handleStartEdit = () => {
    showConfirm({
      title: '수정을 시작할까요?',
      description:
        '승인이 취소되고 초안으로 돌아갑니다. 다시 승인받아야 개설할 수 있고, 재승인은 오픈 설정에서 오픈하기를 눌러 요청합니다.',
      confirmText: '수정 시작하기',
      onConfirm: () =>
        startEdit(undefined, {
          onSuccess: () =>
            showAlert({
              title: '수정을 시작했습니다.',
              description:
                '내용을 고친 뒤 오픈 설정에서 오픈하기를 누르면 다시 검토가 요청됩니다.',
              variant: 'success',
            }),
          onError: (error) =>
            showAlert({
              title: '수정을 시작하지 못했습니다.',
              description: transitionErrorDescription(error),
              variant: 'error',
            }),
        }),
    });
  };

  /** 편집 취소 — 서버가 준 값으로 되돌린다(로컬 수정분 폐기). */
  const handleCancel = () => {
    if (data) setTemplate(data);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col gap-6 pb-24">
      {header}

      <div
        role="status"
        className="border-primary/20 bg-primary-10 flex flex-col gap-3 rounded-xl border px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex flex-col gap-1">
          <span className="text-primary flex items-center gap-1.5 text-sm font-semibold">
            <span
              className="bg-primary h-1.5 w-1.5 rounded-full"
              aria-hidden="true"
            />
            {notice.label}
          </span>
          <p className="text-xs text-gray-600">{notice.description}</p>
        </div>
        <Link
          to="/live-mentoring/open-settings"
          className="border-primary text-primary hover:bg-primary shrink-0 rounded-lg border bg-white px-6 py-2.5 text-center text-sm font-medium transition-colors hover:text-white"
        >
          오픈 설정으로 이동
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
        {/* 읽기 모드에서는 입력만 잠근다 — 내용은 그대로 읽을 수 있어야 한다. */}
        <fieldset
          disabled={!canEdit}
          className="m-0 min-w-0 border-0 p-0 disabled:opacity-100"
        >
          <TemplateEditForm template={template} onChange={patch} />
        </fieldset>
        {/*
          미리보기는 편집 폼 바로 옆에 붙어 스크롤을 따라온다.
          상세 페이지 전체를 축소해 담으므로 화면보다 길어질 수 있어,
          자체 스크롤을 줘야 sticky 가 실제로 "따라오는" 것처럼 동작한다.
        */}
        <div className="lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:self-start lg:overflow-y-auto">
          <TemplatePreview
            template={template}
            nickname={settings?.nickname ?? '멘토'}
          />
        </div>
      </div>

      {/*
        하단 고정 액션 —
        편집 모드: 취소 / 저장하기,
        읽기 모드: 수정하기 / 수정 시작 / 오픈하러 가기 중 상태가 허용하는 것만.
        검토 요청 버튼은 여기 두지 않는다 — 오픈 설정의 오픈하기 하나로 모았다.
      */}
      <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2">
        {canStartEdit && hasActiveOpening && (
          <p className="rounded-lg bg-white/95 px-4 py-2 text-xs text-gray-600 shadow-lg">
            {START_EDIT_BLOCKED_REASON}
          </p>
        )}
        <div className="flex gap-2">
          {canEdit ? (
            <>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isPending}
                className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-600 shadow-lg transition-colors disabled:opacity-50"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isPending}
                className="bg-primary hover:bg-primary-hover rounded-lg px-10 py-2.5 text-sm font-medium text-white shadow-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? '저장 중...' : '저장하기'}
              </button>
            </>
          ) : (
            <>
              {isEditable && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="border-primary text-primary hover:bg-primary rounded-lg border bg-white px-6 py-2.5 text-sm font-medium shadow-lg transition-colors hover:text-white"
                >
                  수정하기
                </button>
              )}
              {canStartEdit && (
                <button
                  type="button"
                  onClick={handleStartEdit}
                  disabled={hasActiveOpening || isStartingEdit}
                  title={
                    hasActiveOpening ? START_EDIT_BLOCKED_REASON : undefined
                  }
                  className="border-primary text-primary hover:bg-primary rounded-lg border bg-white px-6 py-2.5 text-sm font-medium shadow-lg transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isStartingEdit ? '처리 중...' : '수정 시작'}
                </button>
              )}
              {isEditable && (
                <Link
                  to="/live-mentoring/open-settings"
                  className="bg-primary hover:bg-primary-hover rounded-lg px-6 py-2.5 text-sm font-medium text-white shadow-lg transition-colors"
                >
                  오픈하러 가기
                </Link>
              )}
            </>
          )}
        </div>
      </div>

      <MentorAlertModal {...alertProps} />
    </div>
  );
};

export default DetailSettingsPage;
