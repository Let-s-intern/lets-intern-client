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
} from '@/api/live-mentoring/liveMentoringSchema';
import MentorAlertModal from '@/common/modal/MentorAlertModal';
import { useMentorAlert } from '@/hooks/useMentorAlert';
import {
  CATEGORY_LABELS,
  formatCareerPeriod,
  formatPrice,
  representativeCareerLabel,
} from '../constants';
import SettingsActionBar from '../ui/SettingsActionBar';
import {
  errorDescription,
  stateConflictAlert,
  useLiveMentoringOpenAction,
} from './useLiveMentoringOpenAction';
import LiveMentoringSlotModal from './ui/LiveMentoringSlotModal';
import OpenSettingsPreview from './ui/OpenSettingsPreview';

const cardClass = 'rounded-xl border border-gray-200 bg-white p-5 md:p-6';
const sectionTitleClass = 'mb-4 text-base font-semibold text-gray-900';

/**
 * 오픈 설정 — 설정 화면의 첫 스텝 본문이다(LC-3264). 제목과 스텝 줄은
 * `LiveMentoringSettingsPage` 가 그리므로 여기서는 본문만 그린다.
 */
const OpenSettingsSection = () => {
  const { data, refetch } = useLiveMentoringSettingsQuery();
  const { mutate: save, isPending: isSaving } =
    useUpdateLiveMentoringSettingsMutation();
  const {
    mutate: setRepresentativeCareer,
    isPending: isSettingRepresentativeCareer,
  } = useSetRepresentativeCareerMutation();
  const { alertProps, showAlert, showConfirm } = useMentorAlert();

  const [form, setForm] = useState<LiveMentoringSettings | null>(null);
  // 제목·타입의 변경사항(dirty) 판정을 위한 로드 원본.
  const [original, setOriginal] = useState<LiveMentoringSettings | null>(null);
  const [slotModalOpen, setSlotModalOpen] = useState(false);

  /*
   * 오픈 액션은 훅이 갖는다(LC-3273). 하단 바가 어느 스텝에 있든 같은 버튼을 그려야 해서,
   * 이 본문 안에 두면 다른 스텝에서 쓸 수 없다.
   *
   * 훅은 조기 반환보다 **앞에서** 불러야 한다. 설정을 아직 못 받았으면 input 이 null 이고,
   * 그때는 오픈 버튼이 비활성으로 그려진다.
   */
  const openAction = useLiveMentoringOpenAction({
    input: form
      ? {
          title: form.title ?? '',
          categories: form.categories,
          durations: form.durations,
          hasProduct: form.liveMentoringId !== null,
        }
      : null,
    alert: { showAlert, showConfirm },
    /*
     * 제목·타입·진행시간은 오픈 요청과 함께 저장되므로, 지금 열리는 페이지에는 아직
     * 반영돼 있지 않다. 무엇을 보고 확인하라는 건지 짚어주지 않으면 "바꾼 게 안 보인다"로 읽힌다.
     */
    pendingNotice:
      form && original && JSON.stringify(form) !== JSON.stringify(original)
        ? '방금 바꾼 제목·타입·진행시간은 오픈할 때 함께 저장돼요. 지금 열리는 페이지에서는 상세 페이지 내용을 확인해주세요.'
        : undefined,
  });

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
  const { currentOpening, hasPreviousOpening } = openAction;

  const noTitleEntered = !form.title || form.title.trim().length === 0;
  const noCategorySelected = form.categories.length === 0;
  const noDurationSelected = form.durations.length === 0;
  /**
   * 상품이 아직 없으면 개설이 404 로 막힌다 — `POST /openings` 는 기존 상품을 찾아
   * 갱신·개설하는 API 다. 저장을 한 번 거쳐 상품을 만들어야 한다.
   */
  const hasNoProduct = form.liveMentoringId === null;

  // 저장(PUT)은 제목·타입·진행시간을 서버에 반영한다.
  const isTitleOrCategoryDirty =
    (form.title ?? '') !== (original.title ?? '') ||
    JSON.stringify(form.categories) !== JSON.stringify(original.categories);
  /*
   * "저장" 버튼 활성화는 화면에서 뭔가 하나라도 바뀌었으면 켠다 — 진행시간만 고쳤을 때
   * 버튼이 안 켜지면 "저장이 안 되나?"로 읽힌다. 성공 시 handleSave 가 현재 폼 값
   * 전체를 새 기준선으로 삼으므로(merged) 진행시간의 미저장 상태도 함께 정리된다.
   */
  const isDirty =
    isTitleOrCategoryDirty ||
    JSON.stringify(form.durations) !== JSON.stringify(original.durations);
  const canSave =
    !noTitleEntered && !noCategorySelected && !noDurationSelected && isDirty;

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
    const conflict = stateConflictAlert(error);
    if (conflict) {
      refetch();
      showAlert({ ...conflict, variant: 'error' });
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
      {
        title: form.title ?? '',
        categories: form.categories,
        durations: form.durations,
      },
      {
        onSuccess: (saved) => {
          // 진행시간도 저장 요청에 포함되지만, 저장 시점의 폼 값을 기준선에 명시적으로
          // 반영해 현재 화면과 저장 직후 응답을 일치시킨다.
          const merged: LiveMentoringSettings = {
            ...saved,
            durations: form.durations,
          };
          setForm(merged);
          setOriginal(merged);
          showAlert({ title: '저장되었습니다.', variant: 'success' });
        },
        onError: handleMutationError('저장에 실패했습니다.'),
      },
    );
  };

  return (
    <div className="flex flex-col gap-6 pb-24">
      {/*
        상태 배너 — 오픈 종료됨(승인 + 활성 개설 없음)일 때만 상단에 둔다.
        잠긴 상태에서도 멘토는 "내가 어떤 조건으로 냈는지" 확인해야 하므로 설정을 가리지 않고,
        상태와 다음 행동만 상단에 알린다.

        오픈 중일 때는 이 배너를 하단 플로팅 영역으로 옮긴다(아래) — 오픈 닫기가
        "저장"·"오픈하기"와 같은 종류의 주요 행동이라, 다른 화면 액션들과 같은
        자리(하단 플로팅)에 있는 편이 더 직관적이다.
      */}
      {hasPreviousOpening && !currentOpening && (
        <div
          role="status"
          className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-gray-700">
              오픈 종료됨
            </span>
            <p className="text-xs text-gray-600">
              지금은 공개 리스트에 노출되지 않아요. 등록해 둔 일정은 그대로 남아
              있으니, "다시 오픈하기"를 누르면 그 일정으로 바로 열려요.
            </p>
          </div>
        </div>
      )}

      <div className="relative">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_412px]">
          {/* 좌: 설정 패널 */}
          <div className="flex flex-col gap-6">
            {/* 잠긴 상태에서는 입력만 잠근다 — fieldset 이 자손 폼 컨트롤을 한 번에
                비활성화하고 키보드 포커스에서도 빼준다(pointer-events-none 은 마우스만
                막는다). 설정 패널 전체가 아니라 설정 필드만 감싸도록 두 덩이로 나눠 둔
                이유는 사이의 "멘토링 일정" 섹션에 적어 두었다. */}
            <fieldset className="m-0 flex min-w-0 flex-col gap-6 border-0 p-0">
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
            </fieldset>

            {/* 멘토링 일정 — 잠금 fieldset 밖에 둔다. 슬롯 편집은 타이틀·타입 같은 설정
                필드가 아니라 별도 편집 화면을 여는 내비게이션이라, 오픈 중에도 열려야
                한다. 안에 두면 조상 fieldset 이 이 버튼까지 비활성화해서, 슬롯을 하나
                더 열려면 등록한 일정을 전부 버리는 "오픈 닫기" 밖에 길이 없어진다. */}
            <section className={cardClass}>
              <h2 className={sectionTitleClass}>멘토링 일정</h2>
              <p className="mb-3 text-xs text-gray-500">
                멘티가 예약할 수 있는 30분 단위 시간을 직접 골라 등록해요.
                라이브 피드백과 같은 일정 그리드를 쓰며, 이미 라이브 피드백으로
                열어 둔 시간은 선택할 수 없습니다.
              </p>
              <button
                type="button"
                onClick={() => setSlotModalOpen(true)}
                className="border-primary text-primary rounded-lg border px-4 py-2.5 text-sm font-medium"
              >
                일정 등록하기
              </button>
            </section>

            <fieldset className="m-0 flex min-w-0 flex-col gap-6 border-0 p-0">
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
                          /*
                            잠겼을 때 잠긴 것처럼 보이게 한다. 이 버튼들은 오픈 중이면
                            fieldset[disabled] 으로 눌리지 않는데, 모양이 활성일 때와
                            똑같아서 하단 바의 "설정을 수정할 수 없어요" 와 화면이
                            모순돼 보였다.
                          */
                          className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${active ? 'border-primary bg-primary-5 text-primary' : 'border-gray-200 text-gray-600'}`}
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
                        className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${active ? 'border-primary bg-primary-5 text-primary' : 'border-gray-200 text-gray-600'}`}
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
            </fieldset>
          </div>

          {/* 우: 미리보기 */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <OpenSettingsPreview settings={form} />
          </div>
        </div>
      </div>

      {/*
        하단 플로팅 바. 모든 스텝이 같은 바를 쓴다(LC-3273) — 오픈 설정과 상세 페이지
        설정이 한 화면이 된 뒤로 아래 버튼만 스텝마다 달라질 이유가 없다.

        모달이 떠 있는 동안에는 감춘다. 같은 자리에 겹쳐 보인다.
      */}
      {!slotModalOpen && !openAction.isModalOpen && (
        <SettingsActionBar
          status={
            hasNoProduct
              ? '먼저 저장해 상품을 만들어야 오픈할 수 있어요.'
              : currentOpening
                ? '공개 리스트에 노출 중이에요. 설정을 바꾸면 바로 반영돼요.'
                : '설정을 저장한 뒤 오픈하면 공개 리스트에 노출돼요.'
          }
          isDirty={isDirty}
          canSave={canSave}
          isSaving={isSaving}
          onSave={handleSave}
          openAction={openAction}
        />
      )}

      <LiveMentoringSlotModal
        isOpen={slotModalOpen}
        onClose={() => setSlotModalOpen(false)}
      />
      {openAction.modals}

      <MentorAlertModal {...alertProps} />
    </div>
  );
};

export default OpenSettingsSection;
