import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getLowestPrice,
  LIVE_MENTORING_CATEGORIES,
  LIVE_MENTORING_DURATIONS,
} from '@letscareer/mocks';

import { useSetRepresentativeCareerMutation } from '@/api/career/career';
import {
  useLiveMentoringSettingsQuery,
  useUpdateLiveMentoringSettingsMutation,
} from '@/api/live-mentoring/liveMentoring';
import type {
  LiveMentoringCategory,
  LiveMentoringDuration,
  LiveMentoringSettings,
  LiveMentoringSettingsUpdate,
} from '@/api/live-mentoring/liveMentoringSchema';
import MentorAlertModal from '@/common/modal/MentorAlertModal';
import { useMentorAlert } from '@/hooks/useMentorAlert';
import FeedbackAvailabilityModal from '@/pages/feedback-live-availability/FeedbackAvailabilityModal';
import {
  CATEGORY_LABELS,
  formatCareerPeriod,
  formatPrice,
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

/** PUT 요청은 이 6개 필드만 받는다 — nickname/profileImage/introduction/careers는 프로필 참조용. */
const toUpdatePayload = (
  form: LiveMentoringSettings,
): LiveMentoringSettingsUpdate => ({
  title: form.title ?? '',
  isOpen: form.isOpen,
  categories: form.categories,
  durations: form.durations,
  feedbackStartDate: form.feedbackStartDate ?? '',
  feedbackEndDate: form.feedbackEndDate ?? '',
});

const OpenSettingsPage = () => {
  const { data } = useLiveMentoringSettingsQuery();
  const { mutate: save, isPending } = useUpdateLiveMentoringSettingsMutation();
  const {
    mutate: setRepresentativeCareer,
    isPending: isSettingRepresentativeCareer,
  } = useSetRepresentativeCareerMutation();
  const { alertProps, showAlert } = useMentorAlert();

  const [form, setForm] = useState<LiveMentoringSettings | null>(null);
  // 변경사항(dirty) 판정을 위한 로드 원본.
  const [original, setOriginal] = useState<LiveMentoringSettings | null>(null);
  const [slotModalOpen, setSlotModalOpen] = useState(false);

  useEffect(() => {
    if (!data) return;
    setForm(data);
    setOriginal(data);
  }, [data]);

  // 오픈 중(잠금 상태)에는 배경 스크롤을 막는다.
  useEffect(() => {
    if (!form?.isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [form?.isOpen]);

  if (!form || !original) {
    return (
      <div className="text-xsmall14 text-neutral-40 px-1 py-10">
        설정을 불러오는 중...
      </div>
    );
  }

  const patch = (partial: Partial<LiveMentoringSettings>) =>
    setForm((prev) => (prev ? { ...prev, ...partial } : prev));

  // 진행시간은 다중 선택이며 0개도 허용한다(단, 0개면 저장/오픈 불가).
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

  const noTitleEntered = !form.title || form.title.trim().length === 0;
  const noCategorySelected = form.categories.length === 0;
  const noDurationSelected = form.durations.length === 0;
  const noFeedbackDates = !form.feedbackStartDate || !form.feedbackEndDate;
  const hasRequiredFields =
    !noTitleEntered &&
    !noCategorySelected &&
    !noDurationSelected &&
    !noFeedbackDates;
  const isCurrentlyOpen = form.isOpen;
  const isDirty = JSON.stringify(form) !== JSON.stringify(original);
  const canSave = hasRequiredFields && isDirty;

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

  // 오픈하기 — 설정을 저장하면서 오픈 상태로 전환(이후 수정 잠금).
  const handleOpen = () => {
    if (!hasRequiredFields) return;
    persist(
      { ...form, isOpen: true },
      '오픈되었습니다.',
      '오픈 중에는 설정을 수정할 수 없습니다. 수정하려면 오픈을 닫아주세요.',
    );
  };

  // 오픈 닫기 — 오픈을 마감하고 다시 수정 가능 상태로 전환.
  const handleCloseOpen = () =>
    persist(
      { ...form, isOpen: false },
      '오픈을 닫았습니다.',
      '진행 중인 예약은 유지되며, 이제 설정을 수정할 수 있습니다.',
    );

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

      {/* 오픈 중에는 설정 전체를 블러 처리하고 상호작용을 막는다. */}
      <div className="relative">
        <div
          className={
            isCurrentlyOpen
              ? 'pointer-events-none select-none blur-[8px]'
              : undefined
          }
          aria-hidden={isCurrentlyOpen}
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
                    시작일과 종료일을 모두 입력해야 저장할 수 있어요.
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
                      (여러 개 선택 시 최저가로 노출)
                    </span>
                  </p>
                  {noDurationSelected && (
                    <p role="alert" className="text-system-error text-xs">
                      진행시간을 최소 1개 이상 선택해야 저장할 수 있어요.
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
        </div>
      </div>

      {/* 오픈 중 잠금 오버레이 — 좌측 네비를 제외한 콘텐츠 영역 정중앙에 오픈 닫기 버튼 */}
      {isCurrentlyOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-white/40 backdrop-blur-sm lg:left-[296px]">
          <div className="flex flex-col items-center gap-6">
            <p className="rounded-md bg-white/95 px-6 py-3 text-base font-medium text-gray-700 shadow-lg">
              오픈 중에는 설정을 수정할 수 없어요.
            </p>
            <button
              type="button"
              onClick={handleCloseOpen}
              disabled={isPending}
              className="bg-primary hover:bg-primary-hover rounded-2xl px-20 py-6 text-2xl font-bold text-white shadow-2xl transition-colors disabled:opacity-50"
            >
              {isPending ? '처리 중...' : '오픈 닫기'}
            </button>
          </div>
        </div>
      )}

      {/* 하단 버튼: 오픈 중이면 숨김. 변경사항 있으면 저장, 없으면 오픈하기. */}
      {!isCurrentlyOpen && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
          {isDirty ? (
            <button
              type="button"
              onClick={handleSave}
              disabled={isPending || !canSave}
              className="bg-primary hover:bg-primary-hover rounded-lg px-10 py-2.5 text-sm font-medium text-white shadow-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? '저장 중...' : '저장'}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleOpen}
              disabled={isPending || !hasRequiredFields}
              className="bg-primary hover:bg-primary-hover rounded-lg px-10 py-2.5 text-sm font-medium text-white shadow-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? '처리 중...' : '오픈하기'}
            </button>
          )}
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
      <MentorAlertModal {...alertProps} />
    </div>
  );
};

export default OpenSettingsPage;
