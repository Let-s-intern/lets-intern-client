import { useEffect, useState, type MutableRefObject } from 'react';
import { Link } from 'react-router-dom';
import {
  getLowestPrice,
  LIVE_MENTORING_CATEGORIES,
  LIVE_MENTORING_DURATIONS,
} from '@letscareer/mocks';

import { useSetRepresentativeCareerMutation } from '@/api/career/career';
import {
  useLiveMentoringOpenStatusQuery,
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
import { type AutosaveResult } from '../useAutosave';
import {
  errorDescription,
  stateConflictAlert,
} from './useLiveMentoringOpenAction';
import LiveMentoringSlotModal from './ui/LiveMentoringSlotModal';
import OpenSettingsPreview from './ui/OpenSettingsPreview';

const cardClass = 'rounded-xl border border-gray-200 bg-white p-5 md:p-6';
const sectionTitleClass = 'mb-4 text-base font-semibold text-gray-900';

interface OpenSettingsSectionProps {
  /**
   * 저장 상태를 위로 올린다. 저장 버튼은 페이지가 한 자리에 그리므로(스텝 이동 바와
   * 같은 자리를 나눠 쓴다) 여기서는 「보낼 게 있는지」와 「보내면 거절당할 이유」만 알린다.
   */
  onSaveStateChange: (state: {
    isDirty: boolean;
    blockedReason: string | null;
  }) => void;
  /** 페이지가 저장 버튼을 눌렀을 때 부를 함수를 담아 두는 자리. */
  saveRef: MutableRefObject<(() => Promise<AutosaveResult>) | null>;
}

/**
 * 오픈 설정 — 설정 화면의 첫 스텝 본문이다(LC-3264). 제목과 스텝 줄은
 * `LiveMentoringSettingsPage` 가 그리므로 여기서는 본문만 그린다.
 */
const OpenSettingsSection = ({
  onSaveStateChange,
  saveRef,
}: OpenSettingsSectionProps) => {
  const { data, refetch } = useLiveMentoringSettingsQuery();
  /*
   * 오픈 상태는 배너 문구를 고르는 데만 쓴다. 오픈/종료 버튼은 화면 머리의 공개/비공개
   * 토글이 갖고 있고(LC-3283), 그 액션 훅은 이 본문을 감싸는 페이지가 하나만 부른다.
   */
  const { data: openings } = useLiveMentoringOpenStatusQuery();
  const { mutateAsync: saveSettings } =
    useUpdateLiveMentoringSettingsMutation();
  const {
    mutate: setRepresentativeCareer,
    isPending: isSettingRepresentativeCareer,
  } = useSetRepresentativeCareerMutation();
  const { alertProps, showAlert } = useMentorAlert();

  const [form, setForm] = useState<LiveMentoringSettings | null>(null);
  // 제목·타입의 변경사항(dirty) 판정을 위한 로드 원본.
  const [original, setOriginal] = useState<LiveMentoringSettings | null>(null);
  const [slotModalOpen, setSlotModalOpen] = useState(false);

  /*
   * 서버 응답을 얹되 **편집 중인 세 값은 지킨다.** 실시간 저장이 성공하면 설정 쿼리가
   * 무효화돼 곧바로 다시 내려오는데, 통째로 덮으면 저장이 나간 사이에 멘토가 친 글자가
   * 서버 응답으로 지워진다. 나머지(상품 id·상태·경력)는 이 화면이 고치지 않으므로
   * 서버가 맞다 — 저장이 만들어 준 `liveMentoringId` 도 그렇게 들어온다.
   */
  useEffect(() => {
    if (!data) return;
    const keepEdits = (
      prev: LiveMentoringSettings | null,
    ): LiveMentoringSettings =>
      prev
        ? {
            ...data,
            title: prev.title,
            categories: prev.categories,
            durations: prev.durations,
          }
        : data;
    setForm(keepEdits);
    setOriginal(keepEdits);
  }, [data]);

  /*
   * 실시간 저장. 훅은 조기 반환보다 **앞에서** 불러야 하므로 판정도 여기서 한다 —
   * 설정을 아직 못 받았으면 dirty 가 아니라 아무것도 나가지 않는다.
   */
  const formJson = form === null ? '' : JSON.stringify(form);
  const isDirty =
    form !== null && original !== null && formJson !== JSON.stringify(original);

  /* 지금 보내면 서버가 거절할 이유. 오픈 설정은 세 칸이 전부라 여기서 바로 본다. */
  const blockedReason = !form
    ? null
    : !form.title?.trim()
      ? '타이틀을 채우면 저장돼요'
      : form.categories.length === 0
        ? '타입을 하나 이상 고르면 저장돼요'
        : form.durations.length === 0
          ? '진행시간을 하나 이상 고르면 저장돼요'
          : null;

  /** 제목·타입·진행시간 저장. 상품이 없으면 이 요청이 상품을 초안으로 만든다. */
  const handleSave = async (): Promise<AutosaveResult> => {
    if (!form) return { ok: false };
    try {
      await saveSettings({
        title: form.title ?? '',
        categories: form.categories,
        durations: form.durations,
      });
      /*
        응답을 폼에 되쓰지 않는다 — 타이핑 도중에 나가는 저장이라 커서가 튄다.
        기준선만 방금 보낸 값으로 옮기고, 서버가 새로 만든 값(상품 id 등)은 위
        `keepEdits` 가 재조회로 들여온다.
       */
      setOriginal(form);
      return { ok: true };
    } catch (error) {
      const conflict = stateConflictAlert(error);
      if (conflict) refetch();
      return { ok: false, reason: conflict?.title ?? errorDescription(error) };
    }
  };

  /*
    실시간 저장을 걷어내고 멘토가 직접 누르게 바꿨다(LC-3288). 상세 스텝과 같은 이유다 —
    입력이 멎을 때마다 나가면 「타이틀을 채우면 저장돼요」 같은 상태가 계속 흘러가는데,
    누를 버튼이 없어 멘토는 그게 오류인지 안내인지 알 수 없었다. 실제로 이 스텝은
    저장이 500 으로 실패해도 화면이 조용했다.

    대표 경력처럼 고르면 바로 반영되는 항목은 그대로다. 그건 별도 API 이고 즉시
    저장이 맞다.
  */
  saveRef.current = handleSave;
  useEffect(() => {
    onSaveStateChange({ isDirty, blockedReason });
  }, [isDirty, blockedReason, onSaveStateChange]);

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

  const currentOpening = openings?.find((opening) => opening.status === 'OPEN');
  const hasPreviousOpening = (openings?.length ?? 0) > 0;

  const noTitleEntered = !form.title || form.title.trim().length === 0;
  const noCategorySelected = form.categories.length === 0;
  const noDurationSelected = form.durations.length === 0;

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
              있으니, 화면 오른쪽 위의 공개 토글을 켜면 그 일정으로 바로 열려요.
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

      <LiveMentoringSlotModal
        isOpen={slotModalOpen}
        onClose={() => setSlotModalOpen(false)}
      />
      <MentorAlertModal {...alertProps} />
    </div>
  );
};

export default OpenSettingsSection;
