import { useEffect, useState } from 'react';
import {
  getLowestPrice,
  LIVE_MENTORING_CATEGORIES,
  LIVE_MENTORING_DURATIONS,
} from '@letscareer/mocks';

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
import FeedbackAvailabilityModal from '@/pages/feedback-live-availability/FeedbackAvailabilityModal';
import { CATEGORY_LABELS, formatPrice } from '../constants';
import OpenSettingsPreview from './ui/OpenSettingsPreview';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

const Toggle = ({ checked, onChange, label }: ToggleProps) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-gray-300'}`}
  >
    <span
      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${checked ? 'translate-x-[22px]' : 'translate-x-0.5'}`}
    />
  </button>
);

const cardClass = 'rounded-xl border border-gray-200 bg-white p-5 md:p-6';
const sectionTitleClass = 'mb-4 text-base font-semibold text-gray-900';

const OpenSettingsPage = () => {
  const { data } = useLiveMentoringSettingsQuery();
  const { mutate: save, isPending } = useUpdateLiveMentoringSettingsMutation();
  const { alertProps, showAlert } = useMentorAlert();

  const [form, setForm] = useState<LiveMentoringSettings | null>(null);
  const [slotModalOpen, setSlotModalOpen] = useState(false);

  useEffect(() => {
    if (!data) return;
    // 대표 경력은 하나만 노출한다 — 로드 시 첫 번째 노출 경력(없으면 첫 경력)으로 정규화.
    const repIndex = Math.max(
      0,
      data.careers.findIndex((c) => c.visible),
    );
    setForm({
      ...data,
      careers: data.careers.map((c, i) => ({ ...c, visible: i === repIndex })),
    });
  }, [data]);

  if (!form) {
    return (
      <div className="text-xsmall14 text-neutral-40 px-1 py-10">
        설정을 불러오는 중...
      </div>
    );
  }

  const patch = (partial: Partial<LiveMentoringSettings>) =>
    setForm((prev) => (prev ? { ...prev, ...partial } : prev));

  // 진행시간은 다중 선택(최소 1개 유지).
  const toggleDuration = (duration: LiveMentoringDuration) =>
    setForm((prev) => {
      if (!prev) return prev;
      const has = prev.durations.includes(duration);
      const durations =
        has && prev.durations.length > 1
          ? prev.durations.filter((d) => d !== duration)
          : has
            ? prev.durations
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

  // 대표 경력은 하나만 지정한다(라디오). 선택한 것만 visible=true.
  const selectCareer = (index: number) =>
    setForm((prev) =>
      prev
        ? {
            ...prev,
            careers: prev.careers.map((c, i) => ({
              ...c,
              visible: i === index,
            })),
          }
        : prev,
    );

  const noCategorySelected = form.categories.length === 0;
  const canSave = !noCategorySelected;

  const handleSave = () => {
    if (!canSave) return;
    save(form, {
      onSuccess: () =>
        showAlert({ title: '저장되었습니다.', variant: 'success' }),
      onError: () =>
        showAlert({ title: '저장에 실패했습니다.', variant: 'error' }),
    });
  };

  // 오픈 닫기 — 현재 오픈을 마감한다(목: 확인 알럿).
  const handleCloseOpen = () =>
    showAlert({
      title: '오픈을 닫았습니다.',
      description: '진행 중인 예약은 유지되며, 신규 예약은 받지 않습니다.',
      variant: 'success',
    });

  return (
    <div className="flex flex-col gap-6 pb-24">
      <header className="flex flex-col gap-2">
        <h1 className="text-medium22 text-neutral-10 font-semibold leading-8">
          오픈 설정
        </h1>
        <p className="text-xsmall14 text-neutral-40">
          1대1 라이브 멘토링 오픈에 필요한 프로필·진행시간·타입을 설정하세요.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        {/* 좌: 설정 패널 */}
        <div className="flex flex-col gap-6">
          <section className={cardClass}>
            <h2 className={sectionTitleClass}>프로필</h2>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    프로필 노출
                  </span>
                  <span className="text-xs text-gray-500">
                    끄면 프로필 이미지 대신 &lsquo;○○ 멘토님의 멘토링&rsquo; 이
                    표시됩니다.
                  </span>
                </div>
                <Toggle
                  label="프로필 노출"
                  checked={form.profileVisible}
                  onChange={(v) => patch({ profileVisible: v })}
                />
              </div>

              {/* 모자이크는 프로필 이미지를 노출할 때만 설정 가능 */}
              {form.profileVisible && (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        프로필 자동 모자이크
                      </span>
                      <span className="text-xs text-gray-500">
                        프로필 이미지 위에 블러 오버레이를 적용합니다.
                      </span>
                    </div>
                    <Toggle
                      label="프로필 자동 모자이크"
                      checked={form.mosaicEnabled}
                      onChange={(v) => patch({ mosaicEnabled: v })}
                    />
                  </div>

                  {form.mosaicEnabled && (
                    <div className="flex items-center gap-3">
                      <label
                        htmlFor="mosaic-blur"
                        className="text-sm font-medium text-gray-700"
                      >
                        블러 강도
                      </label>
                      <input
                        id="mosaic-blur"
                        type="range"
                        min={0}
                        max={20}
                        step={1}
                        value={form.mosaicBlur}
                        onChange={(e) =>
                          patch({ mosaicBlur: Number(e.target.value) })
                        }
                        className="accent-primary min-w-0 flex-1"
                      />
                      <span className="w-12 text-right text-sm text-gray-600">
                        {form.mosaicBlur}px
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>

          <section className={cardClass}>
            <h2 className={sectionTitleClass}>대표 경력 지정</h2>
            <p className="mb-3 text-xs text-gray-500">
              공개 화면에 노출할 대표 경력을 하나만 선택하세요.
            </p>
            {form.careers.length === 0 ? (
              <p className="text-sm text-gray-500">등록된 경력이 없습니다.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {form.careers.map((career, index) => (
                  <li key={`${career.company}-${index}`}>
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        name="representative-career"
                        checked={career.visible}
                        onChange={() => selectCareer(index)}
                        className="accent-primary h-4 w-4"
                      />
                      <span className="text-sm text-gray-700">
                        {career.company} · {career.position} ({career.period})
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
              멘토링(피드백)을 진행할 오픈 기간을 먼저 설정하세요. 오픈은 하나만
              가능합니다.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="date"
                aria-label="피드백 시작일"
                value={form.feedbackStartDate}
                onChange={(e) => patch({ feedbackStartDate: e.target.value })}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700"
              />
              <span className="text-gray-400">~</span>
              <input
                type="date"
                aria-label="피드백 종료일"
                min={form.feedbackStartDate}
                value={form.feedbackEndDate}
                onChange={(e) => patch({ feedbackEndDate: e.target.value })}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700"
              />
            </div>
          </section>

          <section className={cardClass}>
            <h2 className={sectionTitleClass}>라이브 슬롯</h2>
            <p className="mb-3 text-xs text-gray-500">
              라이브 피드백과 동일한 일정 그리드를 공유합니다. 이미 예약·오픈된
              시간과 겹치지 않게 슬롯을 열 수 있어요. 위에서 설정한 피드백 진행
              일정이 모달 상단에 표시됩니다.
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

      <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 gap-2">
        <button
          type="button"
          onClick={handleCloseOpen}
          className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-600 shadow-lg transition-colors hover:bg-gray-50"
        >
          오픈 닫기
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending || !canSave}
          className="bg-primary hover:bg-primary-hover rounded-lg px-10 py-2.5 text-sm font-medium text-white shadow-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? '저장 중...' : '저장'}
        </button>
      </div>

      <FeedbackAvailabilityModal
        isOpen={slotModalOpen}
        onClose={() => setSlotModalOpen(false)}
        focusDate={form.feedbackStartDate}
        openPeriod={{
          startDate: form.feedbackStartDate,
          endDate: form.feedbackEndDate,
        }}
      />
      <MentorAlertModal {...alertProps} />
    </div>
  );
};

export default OpenSettingsPage;
