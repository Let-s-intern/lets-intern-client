import { useEffect, useState } from 'react';
import {
  getPriceByDuration,
  LIVE_MENTORING_CATEGORIES,
  LIVE_MENTORING_DURATIONS,
} from '@letscareer/mocks';

import {
  useLiveMentoringSettingsQuery,
  useUpdateLiveMentoringSettingsMutation,
} from '@/api/live-mentoring/liveMentoring';
import type {
  LiveMentoringDuration,
  LiveMentoringSettings,
} from '@/api/live-mentoring/liveMentoringSchema';
import MentorAlertModal from '@/common/modal/MentorAlertModal';
import { useMentorAlert } from '@/hooks/useMentorAlert';
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

  useEffect(() => {
    if (data) setForm(data);
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

  const handleDurationChange = (durationMin: LiveMentoringDuration) =>
    patch({ durationMin, price: getPriceByDuration(durationMin) });

  const toggleCareer = (index: number) =>
    setForm((prev) =>
      prev
        ? {
            ...prev,
            careers: prev.careers.map((c, i) =>
              i === index ? { ...c, visible: !c.visible } : c,
            ),
          }
        : prev,
    );

  const handleSave = () =>
    save(form, {
      onSuccess: () =>
        showAlert({ title: '저장되었습니다.', variant: 'success' }),
      onError: () =>
        showAlert({ title: '저장에 실패했습니다.', variant: 'error' }),
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
                    끄면 공개 화면에 익명 타이틀로 표시됩니다.
                  </span>
                </div>
                <Toggle
                  label="프로필 노출"
                  checked={form.profileVisible}
                  onChange={(v) => patch({ profileVisible: v })}
                />
              </div>

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
            </div>
          </section>

          <section className={cardClass}>
            <h2 className={sectionTitleClass}>경력 노출</h2>
            {form.careers.length === 0 ? (
              <p className="text-sm text-gray-500">등록된 경력이 없습니다.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {form.careers.map((career, index) => (
                  <li key={`${career.company}-${index}`}>
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={career.visible}
                        onChange={() => toggleCareer(index)}
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
            <h2 className={sectionTitleClass}>진행시간</h2>
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                {LIVE_MENTORING_DURATIONS.map((duration) => {
                  const active = form.durationMin === duration;
                  return (
                    <button
                      key={duration}
                      type="button"
                      aria-pressed={active}
                      onClick={() => handleDurationChange(duration)}
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
                  {formatPrice(form.price)}
                </span>{' '}
                <span className="text-xs text-gray-400">
                  (진행시간에 따라 자동 결정)
                </span>
              </p>
            </div>
          </section>

          <section className={cardClass}>
            <h2 className={sectionTitleClass}>타입</h2>
            <div className="flex flex-wrap gap-2">
              {LIVE_MENTORING_CATEGORIES.map((category) => {
                const active = form.category === category;
                return (
                  <button
                    key={category}
                    type="button"
                    aria-pressed={active}
                    onClick={() => patch({ category })}
                    className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${active ? 'border-primary bg-primary-5 text-primary' : 'border-gray-200 text-gray-600'}`}
                  >
                    {CATEGORY_LABELS[category]}
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* 우: 미리보기 */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <OpenSettingsPreview settings={form} />
        </div>
      </div>

      <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="bg-primary hover:bg-primary-hover rounded-lg px-10 py-2.5 text-sm font-medium text-white shadow-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? '저장 중...' : '저장'}
        </button>
      </div>

      <MentorAlertModal {...alertProps} />
    </div>
  );
};

export default OpenSettingsPage;
