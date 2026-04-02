import clsx from 'clsx';
import { useEffect, useRef } from 'react';

interface CurationStepperProps {
  currentStep: number;
  steps: string[];
  onStepClick?: (index: number) => void;
}

const CurationStepper = ({
  currentStep,
  steps,
  onStepClick,
}: CurationStepperProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    const activeStep = stepRefs.current[currentStep];
    if (container && activeStep) {
      const containerWidth = container.offsetWidth;
      const stepLeft = activeStep.offsetLeft;
      const stepWidth = activeStep.offsetWidth;
      container.scrollTo({
        left: stepLeft - containerWidth / 2 + stepWidth / 2,
        behavior: 'smooth',
      });
    }
  }, [currentStep]);

  return (
    <div ref={scrollContainerRef} className="w-full overflow-x-auto">
      {/* 데스크탑: 1100px 고정폭 / 모바일: w-full로 4개 스텝 한 화면에 표시 */}
      <div className="mx-auto flex w-full items-center justify-between md:w-[1100px]">
        {steps.map((label, index) => {
          const isActive = index === currentStep;
          const isDone = index < currentStep;
          const isLast = index === steps.length - 1;

          return (
            <div
              key={label}
              ref={(el) => {
                stepRefs.current[index] = el;
              }}
              className="flex items-center gap-1 md:gap-16"
            >
              <button
                type="button"
                onClick={() => onStepClick?.(index)}
                className="flex flex-col items-center gap-1 md:flex-row md:gap-5"
              >
                {/* 번호 박스 */}
                <div
                  className={clsx(
                    'inline-flex h-8 w-8 flex-col items-center justify-center rounded-lg md:h-12 md:w-12',
                    isActive || isDone ? 'bg-violet-200' : 'bg-neutral-200',
                  )}
                >
                  <span
                    className={clsx(
                      'text-sm font-bold leading-none md:text-lg md:leading-6',
                      isActive || isDone ? 'text-indigo-600' : 'text-zinc-500',
                    )}
                  >
                    {isDone ? '✓' : index + 1}
                  </span>
                </div>
                {/* 레이블 */}
                <span
                  className={clsx(
                    'text-center text-[9px] leading-tight md:text-base md:leading-6',
                    isActive
                      ? 'font-bold text-indigo-600'
                      : isDone
                        ? 'font-bold text-indigo-600'
                        : 'font-medium text-zinc-500',
                  )}
                >
                  {label}
                </span>
              </button>

              {/* 화살표 — 오른쪽 방향 */}
              {!isLast && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  className="shrink-0 text-neutral-300 md:h-6 md:w-6"
                >
                  <path
                    d="M9 18l6-6-6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CurationStepper;
