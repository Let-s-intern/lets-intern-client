import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getLowestPrice,
  LIVE_MENTORING_CATEGORIES,
  LIVE_MENTORING_DURATIONS,
} from '@letscareer/mocks';

import { useSetRepresentativeCareerMutation } from '@/api/career/career';
import { useUserQuery } from '@/api/user/user';
import {
  useCloseLiveMentoringOpeningMutation,
  useCreateLiveMentoringOpeningMutation,
  useLiveMentoringOpenStatusQuery,
  useLiveMentoringSettingsQuery,
  useStartEditLiveMentoringMutation,
  useSubmitLiveMentoringMutation,
  useUpdateLiveMentoringSettingsMutation,
} from '@/api/live-mentoring/liveMentoring';
import type {
  LiveMentoringCategory,
  LiveMentoringDuration,
  LiveMentoringSettings,
} from '@/api/live-mentoring/liveMentoringSchema';
import MentorAlertModal from '@/common/modal/MentorAlertModal';
import { useMentorAlert } from '@/hooks/useMentorAlert';
import FeedbackAvailabilityModal from '@/pages/feedback-live-availability/FeedbackAvailabilityModal';
import {
  CATEGORY_LABELS,
  START_EDIT_CONFIRM,
  START_EDIT_SUCCESS,
  formatCareerPeriod,
  publicDetailUrl,
  formatPrice,
  representativeCareerLabel,
} from '../constants';
import OpenedNoticeModal from './ui/OpenedNoticeModal';
import PreOpenCheckModal from './ui/PreOpenCheckModal';
import OpenSettingsPreview from './ui/OpenSettingsPreview';

const cardClass = 'rounded-xl border border-gray-200 bg-white p-5 md:p-6';
const sectionTitleClass = 'mb-4 text-base font-semibold text-gray-900';

/**
 * 저장·제출 실패 사유를 사용자에게 그대로 보여준다.
 *
 * 공용 axios 인터셉터(`@letscareer/api`)가 서버 에러를 `ApiError` 로 재포장하면서
 * `code`/`message`/`status` 를 **최상위 속성**으로 올린다(`error.response` 는 남지 않는다).
 * 이걸 감추고 "실패했습니다"만 띄우면 멘토도 개발자도 원인을 알 수 없다 —
 * 수정 잠금(`LIVE_MENTORING_LOCKED`)인지, 상태 전이 불가(`LIVE_MENTORING_INVALID_STATE`)인지,
 * 미지원 진행시간(`INVALID_LIVE_MENTORING_DURATION`)인지가 갈린다.
 */
const errorDescription = (error: unknown): string | undefined => {
  const apiError = error as { code?: string; message?: string } | null;
  if (!apiError?.message) return undefined;
  return apiError.code
    ? `${apiError.message} (${apiError.code})`
    : apiError.message;
};

/** 다른 창에서 상태가 바뀐 경우 — 화면 값이 이미 낡았으므로 다시 읽어오게 안내한다. */
const isStateConflict = (error: unknown) => {
  const code = (error as { code?: string } | null)?.code;
  return (
    code === 'LIVE_MENTORING_INVALID_STATE' || code === 'LIVE_MENTORING_LOCKED'
  );
};

const todayISO = () => new Date().toISOString().slice(0, 10);

const OpenSettingsPage = () => {
  const { data, refetch } = useLiveMentoringSettingsQuery();
  // 승인 상태에서 "지금 열려 있는지"는 설정 응답이 알려주지 않는다 — 개설 이력으로 판단한다.
  const { data: openings } = useLiveMentoringOpenStatusQuery();
  // 공개 상세는 mentorId 로 열린다(웹 라우트 `/live-mentoring/[mentorId]`).
  const { data: user } = useUserQuery();
  const { mutate: save, isPending: isSaving } =
    useUpdateLiveMentoringSettingsMutation();
  const { mutate: submit, isPending: isSubmitting } =
    useSubmitLiveMentoringMutation();
  const { mutate: reopen, isPending: isReopening } =
    useCreateLiveMentoringOpeningMutation();
  const { mutate: startEdit, isPending: isStartingEdit } =
    useStartEditLiveMentoringMutation();
  const { mutate: closeOpening, isPending: isClosingOpening } =
    useCloseLiveMentoringOpeningMutation();
  const {
    mutate: setRepresentativeCareer,
    isPending: isSettingRepresentativeCareer,
  } = useSetRepresentativeCareerMutation();
  const { alertProps, showAlert, showConfirm } = useMentorAlert();

  const [form, setForm] = useState<LiveMentoringSettings | null>(null);
  // 제목·타입의 변경사항(dirty) 판정을 위한 로드 원본.
  const [original, setOriginal] = useState<LiveMentoringSettings | null>(null);
  const [slotModalOpen, setSlotModalOpen] = useState(false);
  /** 오픈 직후 안내 모달이 종료 대상으로 삼을 개설. null 이면 모달을 닫는다. */
  const [openedOpeningId, setOpenedOpeningId] = useState<number | null>(null);
  /**
   * 오픈 전 확인 모달. 검토 제출과 재개설이 같은 절차를 쓰되 결과가 달라
   * 어느 쪽을 실행할지 함께 들고 있는다.
   */
  const [pendingOpen, setPendingOpen] = useState<'submit' | 'reopen' | null>(
    null,
  );

  useEffect(() => {
    if (!data) return;
    setForm(data);
    setOriginal(data);
  }, [data]);

  if (!form || !original) {
    return (
      <div className="text-xsmall14 text-neutral-40 px-1 py-10">
        설정을 불러오는 중...
      </div>
    );
  }

  const patch = (partial: Partial<LiveMentoringSettings>) =>
    setForm((prev) => (prev ? { ...prev, ...partial } : prev));

  // 진행시간은 다중 선택이며 0개도 허용한다(단, 0개면 제출 불가).
  const toggleDuration = (duration: LiveMentoringDuration) =>
    setForm((prev) => {
      if (!prev) return prev;
      const durations = prev.durations.includes(duration)
        ? prev.durations.filter((d) => d !== duration)
        : [...prev.durations, duration].sort((a, b) => a - b);
      return { ...prev, durations };
    });

  // 타입은 다중 선택이며 0개도 허용한다(단, 0개면 저장 불가).
  const toggleCategory = (category: LiveMentoringCategory) =>
    setForm((prev) => {
      if (!prev) return prev;
      const categories = prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category];
      return { ...prev, categories };
    });

  const status = form.status;
  const currentOpening = openings?.find((opening) => opening.status === 'OPEN');

  /*
   * 편집 가능 조건은 두 갈래다.
   *
   * 1. 초안·반려 — 아직 승인 전이라 `PUT /settings` 로 저장하고 검토를 제출한다.
   * 2. 승인됐고 활성 개설이 없음 — 종료 후 다시 여는 경우다. 이때 서버는
   *    `PUT /settings` 를 잠그므로(409 LOCKED) 저장이 아니라 `POST /openings` 로
   *    제목·타입·진행시간·기간을 한 번에 보내 즉시 재개설한다(관리자 재승인 불필요).
   *
   * 검토 대기와 "승인 + 오픈 중"은 잠근다.
   */
  const isDraftLike =
    status === null || status === 'DRAFT' || status === 'REJECTED';
  const canReopen = status === 'APPROVED' && !currentOpening;
  const isEditable = isDraftLike || canReopen;

  const noTitleEntered = !form.title || form.title.trim().length === 0;
  const noCategorySelected = form.categories.length === 0;
  const noDurationSelected = form.durations.length === 0;
  const noFeedbackDates = !form.feedbackStartDate || !form.feedbackEndDate;
  const endDatePassed =
    !!form.feedbackEndDate && form.feedbackEndDate < todayISO();
  /** 시작일이 미래면 오픈해도 그날까지 목록에 뜨지 않는다(서버 노출 조건). */
  const startDateInFuture =
    !!form.feedbackStartDate && form.feedbackStartDate > todayISO();
  const invertedPeriod =
    !!form.feedbackStartDate &&
    !!form.feedbackEndDate &&
    form.feedbackStartDate > form.feedbackEndDate;

  /** 오픈에 필요한 값이 모두 유효한지. 검토 제출과 재개설이 같은 조건을 쓴다. */
  const hasValidOpeningInput =
    !noTitleEntered &&
    !noCategorySelected &&
    !noDurationSelected &&
    !noFeedbackDates &&
    !endDatePassed &&
    !invertedPeriod;

  // 저장(PUT)이 받는 건 제목·타입뿐이라 dirty 판정도 그 둘만 본다.
  const isDirty =
    (form.title ?? '') !== (original.title ?? '') ||
    JSON.stringify(form.categories) !== JSON.stringify(original.categories);
  const canSave = !noTitleEntered && !noCategorySelected && isDirty;
  // 검토 제출은 제목·타입이 저장된 뒤에만 의미가 있다(제출은 그 둘을 보내지 않는다).
  const canSubmit = hasValidOpeningInput && !isDirty;
  // 재개설은 제목·타입까지 한 요청에 담으므로 미리 저장할 필요가 없다.
  const canReopenNow = hasValidOpeningInput;
  /** 아직 서버에 없는 변경이 있는지 — 확인 모달에서 "지금 안 보이는 값"을 안내한다. */
  const isDirtyForOpen =
    isDirty ||
    JSON.stringify(form.durations) !== JSON.stringify(original.durations) ||
    form.feedbackStartDate !== original.feedbackStartDate ||
    form.feedbackEndDate !== original.feedbackEndDate;

  // 대표 경력은 프로필(UserCareer) 도메인 소유라 오픈 설정의 저장 버튼과 무관하게
  // 선택 즉시 전용 API로 저장된다. 따라서 서버 값(`isRepresentative`)이 곧 선택 상태다.
  const representativeCareerId =
    form.careers.find((career) => career.isRepresentative)?.id ?? null;

  /** 대표 경력 지정을 즉시 서버에 반영한다. form/original 을 함께 갱신해 dirty 오인을 막는다. */
  const handleRepresentativeCareerChange = (careerId: number) => {
    const markRepresentative = (settings: LiveMentoringSettings) => ({
      ...settings,
      careers: settings.careers.map((career) => ({
        ...career,
        isRepresentative: career.id === careerId,
      })),
    });

    setRepresentativeCareer(careerId, {
      onSuccess: () => {
        setForm((prev) => (prev ? markRepresentative(prev) : prev));
        setOriginal((prev) => (prev ? markRepresentative(prev) : prev));
      },
      onError: (error) =>
        showAlert({
          title: '대표 경력 지정에 실패했습니다.',
          description: errorDescription(error),
          variant: 'error',
        }),
    });
  };

  const handleMutationError = (title: string) => (error: unknown) => {
    if (isStateConflict(error)) {
      refetch();
      showAlert({
        title: '다른 곳에서 상태가 바뀌었습니다.',
        description: '최신 상태를 다시 불러왔어요. 확인 후 다시 시도해주세요.',
        variant: 'error',
      });
      return;
    }
    showAlert({
      title,
      description: errorDescription(error),
      variant: 'error',
    });
  };

  /** 제목·타입 저장. 상품이 없으면 이 요청이 상품을 초안으로 만든다. */
  const handleSave = () => {
    if (!canSave) return;
    save(
      { title: form.title ?? '', categories: form.categories },
      {
        onSuccess: (saved) => {
          // 응답이 서버의 최신 전체 상태다. 다만 아직 제출하지 않은 진행시간·기간은
          // 서버에 없으므로(빈 배열·null) 사용자가 입력해 둔 값을 덮어쓰지 않는다.
          const merged: LiveMentoringSettings = {
            ...saved,
            durations: form.durations,
            feedbackStartDate: form.feedbackStartDate,
            feedbackEndDate: form.feedbackEndDate,
          };
          setForm(merged);
          setOriginal(merged);
          showAlert({ title: '저장되었습니다.', variant: 'success' });
        },
        onError: handleMutationError('저장에 실패했습니다.'),
      },
    );
  };

  /** 검토 제출. 진행시간·기간은 이 요청에서만 서버에 저장된다. */
  const handleSubmitForReview = () => {
    setPendingOpen(null);
    submit(
      {
        durations: form.durations,
        feedbackStartDate: form.feedbackStartDate ?? '',
        feedbackEndDate: form.feedbackEndDate ?? '',
      },
      {
        onSuccess: () =>
          showAlert({
            title: '오픈 요청을 보냈어요.',
            description:
              '승인되면 설정한 조건으로 바로 모집이 시작됩니다. 그 전까지는 설정을 수정할 수 없어요.',
            variant: 'success',
          }),
        onError: handleMutationError('오픈 요청에 실패했습니다.'),
      },
    );
  };

  /** 재개설. 승인된 상품을 관리자 재승인 없이 곧바로 다시 연다. */
  const handleReopen = () => {
    setPendingOpen(null);
    reopen(
      {
        title: form.title ?? '',
        categories: form.categories,
        durations: form.durations,
        feedbackStartDate: form.feedbackStartDate ?? '',
        feedbackEndDate: form.feedbackEndDate ?? '',
      },
      {
        /*
         * 성공 알림 대신 안내 모달을 띄운다. 오픈은 되돌리기 번거로운 행동이라
         * "됐습니다" 한 줄로 끝내지 않고, 확인할 주소와 즉시 내리는 길을 함께 준다.
         */
        onSuccess: (history) => {
          const opened = history.openings.find(
            (opening) => opening.status === 'OPEN',
          );
          if (opened) setOpenedOpeningId(opened.openingId);
          else
            showAlert({
              title: '다시 오픈했습니다.',
              description:
                '오늘이 설정한 기간 안이면 공개 리스트에 바로 노출됩니다.',
              variant: 'success',
            });
        },
        onError: handleMutationError('재오픈에 실패했습니다.'),
      },
    );
  };

  /**
   * 상세 페이지까지 고치려면 서버가 상품을 `DRAFT` 로 되돌린다(`start-edit`).
   *
   * 문구에 "초안"을 쓰지 않는다 — 서버 상태 이름일 뿐 멘토에게는 아무 의미가 없다.
   * 멘토가 실제로 겪는 일, 즉 "검토를 다시 받아야 하고 그동안 오픈이 멈춘다"를 말한다.
   */
  const handleStartEdit = () => {
    showConfirm({
      ...START_EDIT_CONFIRM,
      onConfirm: () => {
        if (isStartingEdit) return;
        startEdit(undefined, {
          onSuccess: () =>
            showAlert({ ...START_EDIT_SUCCESS, variant: 'success' }),
          onError: handleMutationError('상세 수정 준비에 실패했습니다.'),
        });
      },
    });
  };

  const isPending = isSaving || isSubmitting || isReopening || isStartingEdit;

  return (
    <div className="flex flex-col gap-6 pb-24">
      <header className="flex flex-col gap-2">
        <h1 className="text-medium22 text-neutral-10 font-semibold leading-8">
          오픈 설정
        </h1>
        <p className="text-xsmall14 text-neutral-40">
          타이틀·타입·진행시간과 피드백 진행 일정을 설정하고 오픈하세요.
          오픈되면 바로 모집이 시작됩니다.
        </p>
      </header>

      {/*
        상태 배너.
        잠긴 상태에서도 멘토는 "내가 어떤 조건으로 냈는지" 확인해야 하므로 설정을 가리지 않고,
        상태와 다음 행동만 상단에 알린다. 잠그는 대상은 화면이 아니라 입력이다.
      */}
      {status === 'PENDING_REVIEW' && (
        <div
          role="status"
          className="flex flex-col gap-1 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4"
        >
          <span className="text-sm font-semibold text-amber-700">
            검토 대기
          </span>
          <p className="text-xs text-gray-600">
            관리자 검토 중이에요. 승인되면 제출한 진행시간·기간으로 바로
            오픈됩니다. 검토 중에는 설정을 수정할 수 없어요.
          </p>
        </div>
      )}

      {status === 'REJECTED' && (
        <div
          role="status"
          className="border-system-error/30 flex flex-col gap-1 rounded-xl border bg-red-50 px-5 py-4"
        >
          <span className="text-system-error text-sm font-semibold">
            반려됨
          </span>
          <p className="text-xs text-gray-600">
            관리자가 반려했어요. 설정을 수정한 뒤 다시 검토를 제출해주세요.
          </p>
        </div>
      )}

      {/*
        승인 상태 배너.

        멘토가 알고 싶은 건 "승인됐는지"가 아니라 **지금 열려 있는지**다.
        `APPROVED` 는 내부 상태 용어라 그대로 쓰면 "승인=계속 열려 있음"으로 읽힌다.
        그래서 문구도 색도 오픈 여부를 기준으로 가른다 —
        열려 있을 때만 강조색을 쓰고, 닫혀 있으면 중립 회색으로 둔다.
        같은 파란 배너를 양쪽에 쓰면 닫힌 상태가 열린 것처럼 보인다.
      */}
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
                ? '공개 리스트에 노출 중이에요. 오픈 중에는 설정을 수정할 수 없어요 — 종료하려면 오픈 현황에서 개설을 종료해주세요.'
                : '지금은 공개 리스트에 노출되지 않아요. 아래에서 조건을 고친 뒤 "다시 오픈하기"를 누르면 바로 열립니다(관리자 승인 불필요).'}
            </p>
          </div>
          <Link
            to="/live-mentoring/open-status"
            className={`shrink-0 rounded-lg border bg-white px-6 py-2.5 text-center text-sm font-medium transition-colors ${
              currentOpening
                ? 'border-primary text-primary hover:bg-primary hover:text-white'
                : 'border-gray-300 text-gray-600 hover:bg-gray-100'
            }`}
          >
            오픈 현황 보기
          </Link>
        </div>
      )}

      <div className="relative">
        {/* 잠긴 상태에서는 입력만 잠근다 — fieldset 이 자손 폼 컨트롤을 한 번에 비활성화하고
            키보드 포커스에서도 빼준다(pointer-events-none 은 마우스만 막는다). */}
        <fieldset disabled={!isEditable} className="m-0 min-w-0 border-0 p-0">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
            {/* 좌: 설정 패널 */}
            <div className="flex flex-col gap-6">
              <section className={cardClass}>
                <h2 className={sectionTitleClass}>프로필</h2>
                <p className="mb-4 text-xs text-gray-500">
                  닉네임·프로필 이미지·한줄 소개·경력은 프로필 페이지에서
                  관리해요. 이 화면에서는 조회만 됩니다.
                </p>
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-100">
                    {form.profileImage ? (
                      <img
                        src={form.profileImage}
                        alt="프로필 이미지"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] text-gray-400">이미지</span>
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {form.nickname || '닉네임 없음'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {form.introduction || '한줄 소개가 없습니다.'}
                    </p>
                  </div>
                </div>
                <Link
                  to="/profile"
                  className="text-primary mt-3 inline-block text-xs font-medium underline"
                >
                  프로필 페이지에서 수정하기
                </Link>
              </section>

              <section className={cardClass}>
                <h2 className={sectionTitleClass}>1대1 멘토링 타이틀</h2>
                <p className="mb-3 text-xs text-gray-500">
                  공개 리스트·상세 페이지에 노출될 상품명이에요.
                </p>
                <input
                  type="text"
                  aria-label="1대1 멘토링 타이틀"
                  value={form.title ?? ''}
                  onChange={(e) => patch({ title: e.target.value })}
                  placeholder="예) 자소서 실전 첨삭 멘토링"
                  className="focus:border-primary w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors"
                />
                {noTitleEntered && (
                  <p role="alert" className="text-system-error mt-2 text-xs">
                    타이틀을 입력해야 저장할 수 있어요.
                  </p>
                )}
              </section>

              <section className={cardClass}>
                <h2 className={sectionTitleClass}>대표 경력 지정</h2>
                <p className="mb-3 text-xs text-gray-500">
                  공개 리스트 멘토 카드에 노출할 대표 경력을 하나만 선택하세요.
                  선택하면 바로 저장돼요.
                </p>
                {form.careers.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    등록된 경력이 없습니다.
                  </p>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {representativeCareerId === null && (
                      <li>
                        <p
                          role="alert"
                          className="text-system-error mb-1 text-xs"
                        >
                          대표 경력을 지정하지 않으면 공개 카드에 경력이
                          노출되지 않아요.
                        </p>
                      </li>
                    )}
                    {form.careers.map((career) => (
                      <li key={career.id}>
                        <label className="flex cursor-pointer items-center gap-2">
                          <input
                            type="radio"
                            name="representative-career"
                            checked={representativeCareerId === career.id}
                            disabled={isSettingRepresentativeCareer}
                            onChange={() =>
                              handleRepresentativeCareerChange(career.id)
                            }
                            className="accent-primary h-4 w-4"
                          />
                          <span className="text-sm text-gray-700">
                            {representativeCareerLabel(career)}
                            {career.startDate && (
                              <span className="text-gray-400">
                                {' '}
                                (
                                {formatCareerPeriod(
                                  career.startDate,
                                  career.endDate,
                                )}
                                )
                              </span>
                            )}
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section className={cardClass}>
                <h2 className={sectionTitleClass}>피드백 진행 일정</h2>
                <p className="mb-3 text-xs text-gray-500">
                  멘티가 이 기간 안에서 피드백 슬롯을 예약합니다. 오픈하면 바로
                  모집이 시작돼요.
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="date"
                    aria-label="피드백 시작일"
                    value={form.feedbackStartDate ?? ''}
                    onChange={(e) =>
                      patch({ feedbackStartDate: e.target.value })
                    }
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700"
                  />
                  <span className="text-gray-400">~</span>
                  <input
                    type="date"
                    aria-label="피드백 종료일"
                    min={form.feedbackStartDate ?? undefined}
                    value={form.feedbackEndDate ?? ''}
                    onChange={(e) => patch({ feedbackEndDate: e.target.value })}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700"
                  />
                </div>
                {noFeedbackDates && (
                  <p role="alert" className="text-system-error mt-2 text-xs">
                    시작일과 종료일을 모두 입력해야 오픈할 수 있어요.
                  </p>
                )}
                {invertedPeriod && (
                  <p role="alert" className="text-system-error mt-2 text-xs">
                    시작일은 종료일보다 늦을 수 없어요.
                  </p>
                )}
                {endDatePassed && (
                  <p role="alert" className="text-system-error mt-2 text-xs">
                    종료일이 이미 지났어요. 오늘 이후 날짜로 다시 잡아주세요.
                  </p>
                )}
                {/*
                  공개 목록은 `시작일 <= 오늘 <= 종료일` 일 때만 상품을 잡아간다.
                  시작일을 미래로 두면 오픈해도 그날까지 모집이 시작되지 않는데,
                  화면에서는 이미 열린 것처럼 보여 놓치기 쉽다. 그때만 경고한다.
                */}
                {startDateInFuture && (
                  <p
                    role="alert"
                    className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800"
                  >
                    시작일이 오늘 이후예요. 지금 오픈해도 시작일 전까지는 공개
                    리스트에 노출되지 않아 모집이 시작되지 않습니다. 바로
                    모집하려면 시작일을 오늘로 맞춰주세요.
                  </p>
                )}
              </section>

              <section className={cardClass}>
                <h2 className={sectionTitleClass}>라이브 슬롯</h2>
                <p className="mb-3 text-xs text-gray-500">
                  라이브 피드백과 동일한 일정 그리드를 공유합니다. 이미
                  예약·오픈된 시간과 겹치지 않게 슬롯을 열 수 있어요. 위에서
                  설정한 피드백 진행 일정이 모달 상단에 표시됩니다.
                </p>
                <button
                  type="button"
                  onClick={() => setSlotModalOpen(true)}
                  className="border-primary text-primary rounded-lg border px-4 py-2.5 text-sm font-medium"
                >
                  라이브 슬롯 오픈
                </button>
              </section>

              <section className={cardClass}>
                <h2 className={sectionTitleClass}>진행시간 (다중 선택)</h2>
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    {LIVE_MENTORING_DURATIONS.map((duration) => {
                      const active = form.durations.includes(duration);
                      return (
                        <button
                          key={duration}
                          type="button"
                          aria-pressed={active}
                          onClick={() => toggleDuration(duration)}
                          className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${active ? 'border-primary bg-primary-5 text-primary' : 'border-gray-200 text-gray-600'}`}
                        >
                          {duration}분
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-sm text-gray-600">
                    가격{' '}
                    <span className="text-primary font-semibold">
                      {formatPrice(getLowestPrice(form.durations))}
                    </span>{' '}
                    <span className="text-xs text-gray-400">
                      (가격은 서버 고정값이며 여러 개 선택 시 최저가로 노출)
                    </span>
                  </p>
                  {noDurationSelected && (
                    <p role="alert" className="text-system-error text-xs">
                      진행시간을 최소 1개 이상 선택해야 오픈할 수 있어요.
                    </p>
                  )}
                </div>
              </section>

              <section className={cardClass}>
                <h2 className={sectionTitleClass}>타입 (다중 선택)</h2>
                <div className="flex flex-wrap gap-2">
                  {LIVE_MENTORING_CATEGORIES.map((category) => {
                    const active = form.categories.includes(category);
                    return (
                      <button
                        key={category}
                        type="button"
                        aria-pressed={active}
                        onClick={() => toggleCategory(category)}
                        className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${active ? 'border-primary bg-primary-5 text-primary' : 'border-gray-200 text-gray-600'}`}
                      >
                        {CATEGORY_LABELS[category]}
                      </button>
                    );
                  })}
                </div>
                {noCategorySelected && (
                  <p role="alert" className="text-system-error mt-3 text-xs">
                    타입을 최소 1개 이상 선택해야 저장할 수 있어요.
                  </p>
                )}
              </section>
            </div>

            {/* 우: 미리보기 */}
            <div className="lg:sticky lg:top-6 lg:self-start">
              <OpenSettingsPreview settings={form} />
            </div>
          </div>
        </fieldset>
      </div>

      {/*
        하단 버튼. 저장(제목·타입)과 검토 제출(진행시간·기간)은 서로 다른 API 라 버튼도 나눈다.
        하나로 합쳐 자동 연쇄 호출하면 둘 중 어느 쪽이 실패했는지 화면에서 알 수 없다.
      */}
      {isEditable && (
        <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2">
          {isDraftLike && isDirty && (
            <p className="rounded-md bg-gray-900/80 px-3 py-1 text-xs text-white">
              제목·타입을 바꿨어요. 먼저 저장해야 오픈할 수 있어요.
            </p>
          )}
          {/*
            재개설 모드에는 "저장"이 없다. 승인 상태에서 서버가 `PUT /settings` 를 잠가
            제목·타입을 따로 저장할 수 없고, 재개설 요청에 함께 실어 보내기 때문이다.
            버튼만 없애 두면 "저장이 안 된다"로 읽히므로 이유를 적어 둔다.
          */}
          {canReopen && (
            <p className="rounded-md bg-gray-900/80 px-3 py-1 text-xs text-white">
              여기서 바꾼 내용은 다시 오픈할 때 함께 저장돼요.
            </p>
          )}
          <div className="flex gap-2">
            {canReopen ? (
              /*
               * 재개설 모드. 승인 상태에서는 서버가 `PUT /settings` 를 잠그므로 "저장"이
               * 없다 — 제목·타입까지 재개설 요청에 함께 실어 보낸다.
               */
              <>
                <button
                  type="button"
                  onClick={handleStartEdit}
                  disabled={isPending}
                  className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 shadow-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isStartingEdit ? '처리 중...' : '상세 수정하기'}
                </button>
                <button
                  type="button"
                  onClick={() => setPendingOpen('reopen')}
                  disabled={isPending || !canReopenNow}
                  className="bg-primary hover:bg-primary-hover rounded-lg px-8 py-2.5 text-sm font-medium text-white shadow-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isReopening ? '오픈 중...' : '다시 오픈하기'}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isPending || !canSave}
                  className="rounded-lg border border-gray-300 bg-white px-8 py-2.5 text-sm font-medium text-gray-700 shadow-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSaving ? '저장 중...' : '저장'}
                </button>
                <button
                  type="button"
                  onClick={() => setPendingOpen('submit')}
                  disabled={isPending || !canSubmit}
                  className="bg-primary hover:bg-primary-hover rounded-lg px-8 py-2.5 text-sm font-medium text-white shadow-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? '처리 중...' : '오픈하기'}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <FeedbackAvailabilityModal
        isOpen={slotModalOpen}
        onClose={() => setSlotModalOpen(false)}
        focusDate={form.feedbackStartDate ?? undefined}
        openPeriod={{
          startDate: form.feedbackStartDate ?? '',
          endDate: form.feedbackEndDate ?? '',
        }}
      />
      {user?.userId != null && (
        <PreOpenCheckModal
          isOpen={pendingOpen !== null}
          publicUrl={publicDetailUrl(user.userId)}
          confirmLabel="오픈하기"
          resultDescription={
            pendingOpen === 'reopen'
              ? '확인을 마치면 곧바로 모집이 시작됩니다. 이상하면 바로 내릴 수 있어요.'
              : '확인을 마치면 오픈 요청이 접수됩니다. 승인되면 바로 모집이 시작돼요.'
          }
          /*
           * 제목·타입·기간은 이 요청과 함께 저장되므로, 지금 열리는 페이지에는 아직
           * 반영돼 있지 않다. 무엇을 보고 확인하라는 건지 짚어주지 않으면
           * "바꾼 게 안 보인다"로 읽힌다.
           */
          pendingNotice={
            isDirtyForOpen
              ? '방금 바꾼 제목·타입·기간은 오픈할 때 함께 저장돼요. 지금 열리는 페이지에서는 상세 페이지 내용을 확인해주세요.'
              : undefined
          }
          isPending={isPending}
          onCancel={() => setPendingOpen(null)}
          onConfirm={
            pendingOpen === 'reopen' ? handleReopen : handleSubmitForReview
          }
        />
      )}

      {user?.userId != null && (
        <OpenedNoticeModal
          isOpen={openedOpeningId !== null}
          publicUrl={publicDetailUrl(user.userId)}
          isClosing={isClosingOpening}
          onDismiss={() => setOpenedOpeningId(null)}
          onCloseOpening={() => {
            if (openedOpeningId === null) return;
            closeOpening(openedOpeningId, {
              onSuccess: () => {
                setOpenedOpeningId(null);
                showAlert({
                  title: '오픈을 내렸습니다.',
                  description:
                    '공개 리스트에서 즉시 빠집니다. 고친 뒤 다시 오픈할 수 있어요.',
                  variant: 'success',
                });
              },
              onError: handleMutationError('오픈을 내리지 못했습니다.'),
            });
          }}
        />
      )}

      <MentorAlertModal {...alertProps} />
    </div>
  );
};

export default OpenSettingsPage;
