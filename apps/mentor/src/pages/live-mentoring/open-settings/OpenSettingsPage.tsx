import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useSetRepresentativeCareerMutation } from '@/api/career/career';
import {
  useCreateLiveMentoringOpeningMutation,
  useLiveMentoringOpenStatusQuery,
  useLiveMentoringSettingsQuery,
  useUpdateLiveMentoringSettingsMutation,
} from '@/api/live-mentoring/liveMentoring';
import type {
  LiveMentoringCategory,
  LiveMentoringDuration,
  LiveMentoringSettings,
  LiveMentoringSettingsUpdate,
  LiveMentoringStatus,
} from '@/api/live-mentoring/liveMentoringSchema';
import MentorAlertModal from '@/common/modal/MentorAlertModal';
import { useMentorAlert } from '@/hooks/useMentorAlert';
import FeedbackAvailabilityModal from '@/pages/feedback-live-availability/FeedbackAvailabilityModal';
import {
  CATEGORY_LABELS,
  formatCareerPeriod,
  formatPrice,
  getLowestPrice,
  LIVE_MENTORING_CATEGORIES,
  LIVE_MENTORING_DURATIONS,
  representativeCareerLabel,
} from '../constants';
import OpenSettingsPreview from './ui/OpenSettingsPreview';

const cardClass = 'rounded-xl border border-gray-200 bg-white p-5 md:p-6';
const sectionTitleClass = 'mb-4 text-base font-semibold text-gray-900';

/**
 * 저장 실패 사유를 사용자에게 그대로 보여준다.
 *
 * 공용 axios 인터셉터(`@letscareer/api`)가 서버 에러를 `ApiError` 로 재포장하면서
 * `code`/`message`/`status` 를 **최상위 속성**으로 올린다(`error.response` 는 남지 않는다).
 * 이걸 감추고 "저장에 실패했습니다"만 띄우면 멘토도 개발자도 원인을 알 수 없다 —
 * 오픈 중 수정(`LIVE_MENTORING_LOCKED`)인지, 미지원 진행시간
 * (`INVALID_LIVE_MENTORING_DURATION`)인지, 서버 장애(`INTERNAL_SERVER_ERROR`)인지가 갈린다.
 */
const saveErrorDescription = (error: unknown): string | undefined => {
  const apiError = error as { code?: string; message?: string } | null;
  if (!apiError?.message) return undefined;
  return apiError.code
    ? `${apiError.message} (${apiError.code})`
    : apiError.message;
};

/**
 * 개설 입력값 — 진행시간과 피드백 기간.
 *
 * `상품 1 : 개설 N` 분리 이후 이 셋은 상품(설정)이 아니라 **개설**에 딸린 값이라
 * `GET /settings` 가 주지도, `PUT /settings` 가 받지도 않는다.
 * 화면에는 있던 자리에 그대로 두되 값은 `POST /openings` 로만 나가므로,
 * 서버 값을 복사해 오는 `form` 과 섞지 않고 별도 state 로 둔다.
 */
interface OpeningForm {
  durations: LiveMentoringDuration[];
  feedbackStartDate: string;
  feedbackEndDate: string;
}

const EMPTY_OPENING_FORM: OpeningForm = {
  durations: [],
  feedbackStartDate: '',
  feedbackEndDate: '',
};

/**
 * 상품 상태별 개설 불가 사유 — PRD 4장 표 그대로.
 *
 * 제출·재제출 버튼은 이번 범위 밖이라, 멘토가 막히는 지점에서 **무엇이 필요한지만** 알린다.
 * `APPROVED` 는 개설 가능 상태라 사유가 없다(활성 개설 여부는 따로 본다).
 */
const OPENING_BLOCKED_REASON: Record<LiveMentoringStatus, string | null> = {
  DRAFT: '관리자 승인 후 개설할 수 있어요',
  PENDING_REVIEW: '관리자 검토 중이라 수정할 수 없어요',
  APPROVED: null,
  REJECTED: '반려됐어요. 수정 후 다시 제출이 필요해요',
  INACTIVE: '비활성 상품이에요',
};

/** PUT 요청은 이 2개 필드만 받는다 — nickname/profileImage/introduction/careers는 프로필 참조용. */
const toUpdatePayload = (
  form: LiveMentoringSettings,
): LiveMentoringSettingsUpdate => ({
  title: form.title ?? '',
  categories: form.categories,
});

const OpenSettingsPage = () => {
  const { data } = useLiveMentoringSettingsQuery();
  // 활성 개설 여부. 오픈 현황·사이드바 배지와 같은 query key 라 요청이 겹치지 않는다.
  const { data: openings } = useLiveMentoringOpenStatusQuery();
  const { mutate: save, isPending: isSaving } =
    useUpdateLiveMentoringSettingsMutation();
  const { mutate: createOpening, isPending: isCreatingOpening } =
    useCreateLiveMentoringOpeningMutation();
  const {
    mutate: setRepresentativeCareer,
    isPending: isSettingRepresentativeCareer,
  } = useSetRepresentativeCareerMutation();
  const { alertProps, showAlert } = useMentorAlert();

  const [form, setForm] = useState<LiveMentoringSettings | null>(null);
  // 변경사항(dirty) 판정을 위한 로드 원본.
  const [original, setOriginal] = useState<LiveMentoringSettings | null>(null);
  const [openingForm, setOpeningForm] =
    useState<OpeningForm>(EMPTY_OPENING_FORM);
  const [slotModalOpen, setSlotModalOpen] = useState(false);

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

  // 진행시간은 다중 선택이며 0개도 허용한다(단, 0개면 개설 불가).
  const toggleDuration = (duration: LiveMentoringDuration) =>
    setOpeningForm((prev) => ({
      ...prev,
      durations: prev.durations.includes(duration)
        ? prev.durations.filter((d) => d !== duration)
        : [...prev.durations, duration].sort((a, b) => a - b),
    }));

  /*
   * 타입은 단일 선택이다 — 서버 `@Size(min = 1, max = 1)` 이라 2개를 보내면 400 이다.
   * 이미 선택된 항목을 다시 눌러도 해제하지 않는다. 해제하면 곧바로 저장 불가 상태가 되는데,
   * 되돌릴 방법이 다른 타입을 고르는 것뿐이라 해제를 허용할 이유가 없다.
   */
  const selectCategory = (category: LiveMentoringCategory) =>
    setForm((prev) => (prev ? { ...prev, categories: [category] } : prev));

  const noTitleEntered = !form.title || form.title.trim().length === 0;
  const noCategorySelected = form.categories.length === 0;
  const noDurationSelected = openingForm.durations.length === 0;
  const noFeedbackDates =
    !openingForm.feedbackStartDate || !openingForm.feedbackEndDate;
  const hasRequiredFields =
    !noTitleEntered &&
    !noCategorySelected &&
    !noDurationSelected &&
    !noFeedbackDates;
  /*
   * 잠금·활성화 판정은 전부 서버가 계산해 준 값(`status`·개설 이력)에서 나온다 —
   * FE 가 재구성하지 않는다. 다만 잠금 범위는 둘로 갈린다.
   *  - 상품(타이틀·타입)은 `DRAFT`·`REJECTED` 에서만 고칠 수 있다(서버 `isEditable()`).
   *  - 개설 입력(피드백 기간·라이브 슬롯·진행시간)은 활성 개설이 없으면 언제든 채울 수 있다.
   * 개설은 `APPROVED` 에서만 가능한데 그때 상품이 잠긴다. 둘을 한 덩어리로 잠그면
   * 승인받은 멘토가 진행시간·기간을 입력할 수 없어 개설 자체가 막힌다.
   */
  const hasActiveOpening =
    openings?.some((opening) => opening.status === 'OPEN') ?? false;
  const isProductEditable =
    (form.status === 'DRAFT' || form.status === 'REJECTED') &&
    !hasActiveOpening;
  const canCreateOpening = form.status === 'APPROVED' && !hasActiveOpening;
  const openingBlockedReason = hasActiveOpening
    ? '이미 진행 중인 개설이 있어요. 종료된 뒤에 다시 개설할 수 있어요'
    : OPENING_BLOCKED_REASON[form.status];
  /*
   * 저장(PUT)이 실제로 보내는 필드만 비교한다.
   * 진행시간·기간은 개설 요청으로만 나가므로, 그것만 바꿨을 때 하단 버튼이
   * "오픈하기"에서 "저장"으로 바뀌면 눌러도 아무 값이 저장되지 않는 거짓 버튼이 된다.
   */
  const isDirty =
    (form.title ?? '') !== (original.title ?? '') ||
    form.categories.join() !== original.categories.join();
  const canSave = !noTitleEntered && !noCategorySelected && isDirty;

  // 대표 경력은 프로필(UserCareer) 도메인 소유라 오픈 설정의 저장 버튼과 무관하게
  // 선택 즉시 전용 API로 저장된다. 따라서 서버 값(`isRepresentative`)이 곧 선택 상태다.
  const representativeCareerId =
    form.careers.find((career) => career.isRepresentative)?.id ?? null;

  /**
   * 대표 경력 지정을 즉시 서버에 반영한다.
   *
   * 저장에 성공하면 `form`/`original` 의 careers 플래그를 **함께** 갱신한다.
   * 한쪽만 바꾸면 오픈 설정에 변경사항이 생긴 것으로 오인해(`isDirty`)
   * 버튼이 "오픈하기"에서 "저장"으로 바뀌어 버린다.
   */
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
          description: saveErrorDescription(error),
          variant: 'error',
        }),
    });
  };

  const persist = (
    next: LiveMentoringSettings,
    successTitle: string,
    successDescription?: string,
  ) =>
    save(toUpdatePayload(next), {
      // 저장 응답이 곧 서버의 최신 전체 상태(프로필 참조 필드 포함)라 그대로 반영한다.
      onSuccess: (saved) => {
        setForm(saved);
        setOriginal(saved);
        showAlert({
          title: successTitle,
          description: successDescription,
          variant: 'success',
        });
      },
      onError: (error) =>
        showAlert({
          title: '저장에 실패했습니다.',
          description: saveErrorDescription(error),
          variant: 'error',
        }),
    });

  const handleSave = () => {
    if (!canSave) return;
    persist(form, '저장되었습니다.');
  };

  /**
   * 오픈하기 — 개설(`POST /openings`)을 만든다.
   *
   * 제목·카테고리는 같은 트랜잭션에서 상품 설정으로 함께 갱신되므로
   * 개설 직전 별도 `PUT /settings` 를 보내지 않는다.
   */
  const handleOpen = () => {
    if (!hasRequiredFields || !canCreateOpening) return;
    createOpening(
      {
        title: form.title ?? '',
        categories: form.categories,
        durations: openingForm.durations,
        feedbackStartDate: openingForm.feedbackStartDate,
        feedbackEndDate: openingForm.feedbackEndDate,
      },
      {
        onSuccess: () =>
          showAlert({
            title: '개설되었습니다.',
            description:
              '개설 중에는 설정을 수정할 수 없어요. 신청 기간이 지나면 자동으로, 그전에는 관리자 요청으로만 종료됩니다.',
            variant: 'success',
          }),
        onError: (error) =>
          showAlert({
            title: '개설에 실패했습니다.',
            description: saveErrorDescription(error),
            variant: 'error',
          }),
      },
    );
  };

  return (
    <div className="flex flex-col gap-6 pb-24">
      <header className="flex flex-col gap-2">
        <h1 className="text-medium22 text-neutral-10 font-semibold leading-8">
          오픈 설정
        </h1>
        <p className="text-xsmall14 text-neutral-40">
          1대1 라이브 멘토링 오픈에 필요한 타이틀·진행시간·타입을 설정하세요.
        </p>
      </header>

      {/*
        오픈 중 상태 배너.
        오픈 중에도 멘토는 "내가 어떤 조건으로 열었는지" 확인해야 하므로 설정을 가리지 않고,
        상태와 종료 경로만 상단에 알린다. 잠그는 대상은 화면이 아니라 입력이다.
        멘토가 직접 종료하는 API 가 없어 여기에 둘 버튼도 없다.
      */}
      {hasActiveOpening && (
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
              오픈 중
            </span>
            <p className="text-xs text-gray-600">
              관리자 종료 또는 기간 만료 시 종료됩니다.
            </p>
          </div>
        </div>
      )}

      <div className="relative">
        {/* 오픈 중에는 입력만 잠근다 — fieldset 이 자손 폼 컨트롤을 한 번에 비활성화하고
            키보드 포커스에서도 빼준다(pointer-events-none 은 마우스만 막는다).
            상품 필드(타이틀·타입)는 승인 이후에도 잠기므로 컨트롤별로 따로 막는다. */}
        <fieldset
          disabled={hasActiveOpening}
          className="m-0 min-w-0 border-0 p-0"
        >
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
                  disabled={!isProductEditable}
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
                  멘토링(피드백)을 진행할 오픈 기간을 먼저 설정하세요. 오픈은
                  하나만 가능합니다.
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="date"
                    aria-label="피드백 시작일"
                    value={openingForm.feedbackStartDate}
                    onChange={(e) =>
                      setOpeningForm((prev) => ({
                        ...prev,
                        feedbackStartDate: e.target.value,
                      }))
                    }
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700"
                  />
                  <span className="text-gray-400">~</span>
                  <input
                    type="date"
                    aria-label="피드백 종료일"
                    min={openingForm.feedbackStartDate || undefined}
                    value={openingForm.feedbackEndDate}
                    onChange={(e) =>
                      setOpeningForm((prev) => ({
                        ...prev,
                        feedbackEndDate: e.target.value,
                      }))
                    }
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700"
                  />
                </div>
                {noFeedbackDates && (
                  <p role="alert" className="text-system-error mt-2 text-xs">
                    시작일과 종료일을 모두 입력해야 개설할 수 있어요.
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
                      const active = openingForm.durations.includes(duration);
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
                      {formatPrice(getLowestPrice(openingForm.durations))}
                    </span>{' '}
                    <span className="text-xs text-gray-400">
                      (여러 개 선택 시 최저가로 노출)
                    </span>
                  </p>
                  {noDurationSelected && (
                    <p role="alert" className="text-system-error text-xs">
                      진행시간을 최소 1개 이상 선택해야 개설할 수 있어요.
                    </p>
                  )}
                </div>
              </section>

              <section className={cardClass}>
                <h2 className={sectionTitleClass}>타입 (1개 선택)</h2>
                <div className="flex flex-wrap gap-2">
                  {LIVE_MENTORING_CATEGORIES.map((category) => {
                    const active = form.categories.includes(category);
                    return (
                      <button
                        key={category}
                        type="button"
                        aria-pressed={active}
                        disabled={!isProductEditable}
                        onClick={() => selectCategory(category)}
                        className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${active ? 'border-primary bg-primary-5 text-primary' : 'border-gray-200 text-gray-600'}`}
                      >
                        {CATEGORY_LABELS[category]}
                      </button>
                    );
                  })}
                </div>
                {noCategorySelected && (
                  <p role="alert" className="text-system-error mt-3 text-xs">
                    타입을 1개 선택해야 저장할 수 있어요.
                  </p>
                )}
              </section>
            </div>

            {/* 우: 미리보기 */}
            <div className="lg:sticky lg:top-6 lg:self-start">
              <OpenSettingsPreview
                settings={form}
                durations={openingForm.durations}
                feedbackStartDate={openingForm.feedbackStartDate || null}
                feedbackEndDate={openingForm.feedbackEndDate || null}
              />
            </div>
          </div>
        </fieldset>
      </div>

      {/* 하단 버튼: 변경사항 있으면 저장, 없으면 오픈하기. 개설 불가면 사유를 한 줄로 붙인다. */}
      <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-1.5">
        {isDirty ? (
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !canSave}
            className="bg-primary hover:bg-primary-hover rounded-lg px-10 py-2.5 text-sm font-medium text-white shadow-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? '저장 중...' : '저장'}
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={handleOpen}
              disabled={
                isCreatingOpening || !canCreateOpening || !hasRequiredFields
              }
              className="bg-primary hover:bg-primary-hover rounded-lg px-10 py-2.5 text-sm font-medium text-white shadow-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isCreatingOpening ? '처리 중...' : '오픈하기'}
            </button>
            {openingBlockedReason && (
              <p className="rounded bg-white/90 px-2 py-0.5 text-xs text-gray-500 shadow-sm">
                {openingBlockedReason}
              </p>
            )}
          </>
        )}
      </div>

      <FeedbackAvailabilityModal
        isOpen={slotModalOpen}
        onClose={() => setSlotModalOpen(false)}
        focusDate={openingForm.feedbackStartDate || undefined}
        openPeriod={{
          startDate: openingForm.feedbackStartDate,
          endDate: openingForm.feedbackEndDate,
        }}
      />
      <MentorAlertModal {...alertProps} />
    </div>
  );
};

export default OpenSettingsPage;
