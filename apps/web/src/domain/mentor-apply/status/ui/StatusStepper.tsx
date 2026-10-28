import type { MentorApplicationStatusCode } from '@/api/mentor-application/mentorApplication';
import { twMerge } from '@/lib/twMerge';

import { STATUS_LABEL, STATUS_STEPS } from '../constants/status';

interface StatusStepperProps {
  status: MentorApplicationStatusCode;
}

/** 확인 중, 검토 중, 회신 완료 3단계. 현재 단계까지 강조한다 */
export default function StatusStepper({ status }: StatusStepperProps) {
  const currentIndex = STATUS_STEPS.indexOf(status);

  return (
    <ol className="mt-6 flex items-center">
      {STATUS_STEPS.map((step, index) => {
        const reached = index <= currentIndex;
        const isLast = index === STATUS_STEPS.length - 1;

        return (
          <li
            key={step}
            aria-current={index === currentIndex ? 'step' : undefined}
            className={twMerge(
              'flex items-center',
              isLast ? 'flex-none' : 'flex-1',
            )}
          >
            <div className="flex flex-col items-center gap-2">
              <span
                className={twMerge(
                  'text-xsmall14 flex size-8 items-center justify-center rounded-full font-bold',
                  reached
                    ? 'bg-primary text-static-100'
                    : 'bg-neutral-95 text-neutral-50',
                )}
              >
                {index + 1}
              </span>
              <span
                className={twMerge(
                  'text-xxsmall12 whitespace-nowrap',
                  reached ? 'text-neutral-0 font-semibold' : 'text-neutral-50',
                )}
              >
                {STATUS_LABEL[step]}
              </span>
            </div>
            {isLast ? null : (
              <div
                aria-hidden
                className={twMerge(
                  'mx-2 mb-6 h-0.5 flex-1',
                  index < currentIndex ? 'bg-primary' : 'bg-neutral-90',
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
