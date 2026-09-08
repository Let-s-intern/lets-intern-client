'use client';

import { twMerge } from '@/lib/twMerge';
import { FiCheck } from 'react-icons/fi';

import { MOBILE_STEP_LABELS, STEP_LABELS } from '../passCertificationForm';

/** 데스크톱 스텝퍼 원 좌우 연결선 */
function Line({ filled }: { filled: boolean }) {
  return (
    <div
      className={twMerge(
        'h-0.5 flex-1',
        filled ? 'bg-primary' : 'bg-neutral-85',
      )}
    />
  );
}

/** 데스크톱: 가로 연결선 스텝퍼 (기본 정보 / 합격 정보 / 합격 후기) */
function DesktopStepper({ current }: { current: number }) {
  return (
    <div className="mb-6 hidden items-start px-6 pb-5 md:flex">
      {STEP_LABELS.map((label, i) => {
        const done = i < current;
        const filled = i <= current;

        return (
          <div key={label} className="flex flex-1 flex-col items-center">
            <div className="flex w-full items-center">
              <Line filled={filled} />
              <div
                className={twMerge(
                  'text-xsmall14 text-static-100 flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-semibold',
                  filled ? 'bg-primary' : 'bg-neutral-85',
                )}
              >
                {done ? <FiCheck className="h-4 w-4" /> : i + 1}
              </div>
              {/* 오른쪽 선은 완료된 단계만 강조 */}
              <Line filled={done} />
            </div>
            <span
              className={twMerge(
                'text-xxsmall12 mt-2',
                filled ? 'text-primary font-bold' : 'text-neutral-45',
              )}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/** 모바일: 현재 단계만 표시하는 번호 뱃지 (제출 완료 포함) */
function MobileStepper({ current }: { current: number }) {
  return (
    <div className="mb-4 flex items-center gap-2 md:mb-6 md:hidden">
      <span className="bg-primary text-xxsmall12 text-static-100 flex h-6 w-6 items-center justify-center rounded-full font-semibold">
        {current + 1}
      </span>
      <span className="text-xsmall14 text-primary font-semibold">
        {MOBILE_STEP_LABELS[current]}
      </span>
    </div>
  );
}

/** 반응형 스텝퍼 (모바일 뱃지 / 데스크톱 가로 스텝퍼) */
export default function Stepper({ current }: { current: number }) {
  return (
    <>
      <MobileStepper current={current} />
      <DesktopStepper current={current} />
    </>
  );
}
