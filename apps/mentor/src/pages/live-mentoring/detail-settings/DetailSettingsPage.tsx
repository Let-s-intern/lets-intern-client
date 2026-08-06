import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  useLiveMentoringOpenStatusQuery,
  useLiveMentoringSettingsQuery,
  useLiveMentoringTemplateQuery,
  useStartEditLiveMentoringMutation,
  useUpdateLiveMentoringTemplateMutation,
} from '@/api/live-mentoring/liveMentoring';
import type { LiveMentoringTemplate } from '@/api/live-mentoring/liveMentoringSchema';
import MentorAlertModal from '@/common/modal/MentorAlertModal';
import { useMentorAlert } from '@/hooks/useMentorAlert';
import { useUserQuery } from '@/api/user/user';
import {
  START_EDIT_CONFIRM,
  START_EDIT_SUCCESS,
  publicDetailUrl,
  toYoutubeEmbedUrl,
} from '../constants';
// ⚠️ 임시 — 백엔드 연동 후 이 import 와 아래 isError 분기를 함께 제거할 것.
//    상세 조건은 UnderDevelopmentNotice.tsx 상단 주석 참고.
import UnderDevelopmentNotice from '../ui/UnderDevelopmentNotice';
import TemplateEditForm from './ui/TemplateEditForm';
import TemplatePreview from './ui/TemplatePreview';

const DetailSettingsPage = () => {
  const { data, isError } = useLiveMentoringTemplateQuery();
  // 헤드라인·미리보기에 쓸 닉네임은 오픈 설정(프로필 참조 값)에서 가져온다.
  const { data: settings } = useLiveMentoringSettingsQuery();
  // "지금 열려 있는지"는 상품 상태가 아니라 활성 개설의 존재로 판단한다.
  const { data: openings } = useLiveMentoringOpenStatusQuery();
  // 공개 상세는 mentorId 로 열린다(웹 라우트 `/live-mentoring/[mentorId]`).
  const { data: user } = useUserQuery();
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
   * 검토 대기·승인 상태에서는 상세 페이지를 바로 수정할 수 없다.
   * 이미 노출 중인 판매 페이지가 멘티가 보는 도중에 바뀌면 안 되기 때문이고,
   * 서버도 상품 상태가 `DRAFT`/`REJECTED` 일 때만 편집을 허용한다.
   *
   * 다만 "수정할 수 없다"로 끝내면 멘토가 막힌다. 오픈이 닫혀 있으면 이 화면에서
   * 바로 검토를 다시 걸어(`start-edit`) 편집으로 넘어갈 수 있게 한다.
   */
  const status = settings?.status ?? null;
  const isLocked = status === 'PENDING_REVIEW' || status === 'APPROVED';
  const canEdit = isEditing && !isLocked;
  const currentOpening = openings?.find((opening) => opening.status === 'OPEN');
  /** 승인 상태에서 오픈이 닫혀 있으면 여기서 바로 상세 수정을 시작할 수 있다. */
  const canStartEdit = status === 'APPROVED' && !currentOpening;

  // 오픈 설정 타입에 따라 서버가 내려준 기본 템플릿을 로드한다.
  useEffect(() => {
    if (data) setTemplate(data);
  }, [data]);

  const header = (
    <header className="flex flex-col gap-2">
      <h1 className="text-medium22 text-neutral-10 font-semibold leading-8">
        상세 페이지 설정
      </h1>
      {/* 잠긴 상태에서 "수정하기를 눌러주세요"라고 하면 없는 버튼을 찾게 만든다. */}
      <p className="text-xsmall14 text-neutral-40">
        {canEdit
          ? '좌측에서 고친 내용이 우측 미리보기에 즉시 반영됩니다.'
          : isLocked
            ? '공개 상세 페이지에 지금 나가고 있는 내용입니다.'
            : '공개 상세 페이지에 지금 나가고 있는 내용입니다. 고치려면 수정하기를 눌러주세요.'}
      </p>
      {/* 미리보기는 축소판이라 실제 화면과 다를 수 있다 — 진짜 페이지로 갈 길을 준다. */}
      {user?.userId != null && (
        <a
          href={publicDetailUrl(user.userId)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary text-xsmall14 w-fit font-medium underline"
        >
          실제 공개 페이지로 확인하기
        </a>
      )}
    </header>
  );

  // ⚠️ 임시 — GET /mentor/live-mentoring/template 이 미완성이라 목 없이는 조회가 실패한다.
  //    백엔드 연동 후 이 분기를 통째로 제거할 것(제거하면 아래 로딩 분기만 남는다).
  if (isError) {
    return (
      <div className="flex flex-col gap-6 pb-24">
        {header}
        <UnderDevelopmentNotice feature="상세 페이지 설정" />
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

  const patch = (partial: Partial<LiveMentoringTemplate>) =>
    setTemplate((prev) => (prev ? { ...prev, ...partial } : prev));

  /**
   * 저장.
   *
   * 영상 URL 은 서버가 `https://www.youtube.com/embed/{id}` 형태만 받는다. 공유 링크를
   * 그대로 두면 저장 **전체**가 400 으로 실패하는데, 화면에는 어느 필드 때문인지
   * 드러나지 않아 원인을 찾을 수 없다. 보내기 전에 정규화하고, 못 고치면 여기서 막는다.
   */
  const handleSave = () => {
    let payload = template;

    if (template.video.videoUrl) {
      const embedUrl = toYoutubeEmbedUrl(template.video.videoUrl);
      if (!embedUrl) {
        showAlert({
          title: '영상 URL 을 확인해주세요.',
          description:
            'YouTube 주소만 넣을 수 있어요. 영상 페이지의 공유 링크를 붙여넣으면 자동으로 변환됩니다.',
          variant: 'error',
        });
        return;
      }
      payload = {
        ...template,
        video: { ...template.video, videoUrl: embedUrl },
      };
      setTemplate(payload);
    }

    save(payload, {
      onSuccess: () => {
        setIsEditing(false);
        showAlert({ title: '저장되었습니다.', variant: 'success' });
      },
      // 서버가 왜 거부했는지 감추면 멘토도 개발자도 원인을 알 수 없다.
      onError: (error) => {
        const apiError = error as { code?: string; message?: string } | null;
        showAlert({
          title: '저장에 실패했습니다.',
          description: apiError?.message
            ? apiError.code
              ? `${apiError.message} (${apiError.code})`
              : apiError.message
            : undefined,
          variant: 'error',
        });
      },
    });
  };

  /**
   * 상세 수정 시작 — 서버가 상품을 편집 가능 상태로 되돌린다.
   * 성공하면 곧바로 편집 모드로 넣는다. 이 버튼을 누른 의도가 "고치겠다"이므로
   * 한 번 더 "수정하기"를 누르게 하지 않는다.
   */
  const handleStartEdit = () =>
    showConfirm({
      ...START_EDIT_CONFIRM,
      onConfirm: () => {
        if (isStartingEdit) return;
        startEdit(undefined, {
          onSuccess: () => {
            setIsEditing(true);
            showAlert({ ...START_EDIT_SUCCESS, variant: 'success' });
          },
          onError: () =>
            showAlert({
              title: '상세 수정 준비에 실패했습니다.',
              variant: 'error',
            }),
        });
      },
    });

  /** 편집 취소 — 서버가 준 값으로 되돌린다(로컬 수정분 폐기). */
  const handleCancel = () => {
    if (data) setTemplate(data);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col gap-6 pb-24">
      {header}

      {/*
        상태 배너.

        상품 상태(`APPROVED`)가 아니라 **지금 열려 있는지**를 말한다. "승인됨"은 서버
        상태 이름이라 멘토에게는 "계속 열려 있음"으로 읽힌다. 색도 같은 이유로 가른다 —
        열려 있을 때만 강조색을 쓴다.
      */}
      {status === 'PENDING_REVIEW' && (
        <div
          role="status"
          className="flex flex-col gap-1 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4"
        >
          <span className="text-sm font-semibold text-amber-700">
            승인 대기
          </span>
          <p className="text-xs text-gray-600">
            오픈 신청을 검토 중이에요. 결과가 나올 때까지는 상세 페이지를 수정할
            수 없습니다.
          </p>
        </div>
      )}

      {status === 'APPROVED' && (
        <div
          role="status"
          className={`flex flex-col gap-3 rounded-xl border px-5 py-4 sm:flex-row sm:items-center sm:justify-between ${
            currentOpening
              ? 'border-primary/20 bg-primary-10'
              : 'border-gray-200 bg-gray-50'
          }`}
        >
          <div className="flex flex-col gap-1">
            <span
              className={`flex items-center gap-1.5 text-sm font-semibold ${
                currentOpening ? 'text-primary' : 'text-gray-700'
              }`}
            >
              {currentOpening && (
                <span
                  className="bg-primary h-1.5 w-1.5 rounded-full"
                  aria-hidden="true"
                />
              )}
              {currentOpening ? '오픈 중' : '오픈 종료됨'}
            </span>
            <p className="text-xs text-gray-600">
              {currentOpening
                ? '멘티에게 노출 중이라 상세 페이지를 수정할 수 없어요. 수정하려면 오픈 현황에서 개설을 먼저 종료해주세요.'
                : '수정하려면 관리자 검토를 다시 받아야 해요. 아래 "상세 수정하기"를 누르면 바로 시작할 수 있습니다.'}
            </p>
          </div>
          {currentOpening && (
            <Link
              to="/live-mentoring/open-status"
              className="border-primary text-primary hover:bg-primary shrink-0 rounded-lg border bg-white px-6 py-2.5 text-center text-sm font-medium transition-colors hover:text-white"
            >
              오픈 현황 보기
            </Link>
          )}
        </div>
      )}

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
        하단 고정 액션.
        잠긴 상태라도 할 수 있는 일이 있으면 버튼을 준다 — 오픈이 닫혀 있으면
        여기서 바로 상세 수정을 시작할 수 있다. 버튼 없이 글로만 "오픈 설정으로 가라"고
        하면 멘토가 화면을 옮겨 다니며 길을 찾아야 한다.
      */}
      <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 gap-2">
        {isLocked ? (
          canStartEdit ? (
            <button
              type="button"
              onClick={handleStartEdit}
              disabled={isStartingEdit}
              className="bg-primary hover:bg-primary-hover rounded-lg px-8 py-2.5 text-sm font-medium text-white shadow-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isStartingEdit ? '처리 중...' : '상세 수정하기'}
            </button>
          ) : null
        ) : canEdit ? (
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
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="border-primary text-primary hover:bg-primary rounded-lg border bg-white px-6 py-2.5 text-sm font-medium shadow-lg transition-colors hover:text-white"
            >
              수정하기
            </button>
            <Link
              to="/live-mentoring/open-settings"
              className="bg-primary hover:bg-primary-hover rounded-lg px-6 py-2.5 text-sm font-medium text-white shadow-lg transition-colors"
            >
              오픈하러 가기
            </Link>
          </>
        )}
      </div>

      <MentorAlertModal {...alertProps} />
    </div>
  );
};

export default DetailSettingsPage;
