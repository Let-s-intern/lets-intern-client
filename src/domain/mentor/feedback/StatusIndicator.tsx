'use client';

import { twMerge } from '@/lib/twMerge';
import type { FeedbackStatus } from '@/api/challenge/challengeSchema';

interface StatusIndicatorProps {
  feedbackStatus: FeedbackStatus | null;
}

const STEPS = [
  { key: 'WAITING', label: '시작 전' },
  { key: 'IN_PROGRESS', label: '진행 중' },
  { key: 'COMPLETED', label: '완료' },
] as const;

function getActiveStep(status: FeedbackStatus | null): number {
  if (status === 'COMPLETED' || status === 'CONFIRMED') return 2;
  if (status === 'IN_PROGRESS') return 1;
  return 0;
}

const StatusIndicator = ({ feedbackStatus }: StatusIndicatorProps) => {
  const activeStep = getActiveStep(feedbackStatus);

  return (
    <div className="flex items-center gap-2 py-3 text-sm">
      {STEPS.map((step, idx) => {
        const isActive = idx <= activeStep;
        return (
          <div key={step.key} className="flex items-center gap-2">
            {idx > 0 && <span className="text-gray-400">&rarr;</span>}
            <span
              className={twMerge(
                'font-medium',
                idx === activeStep
                  ? idx === 0
                    ? 'text-gray-500'
                    : idx === 1
                      ? 'text-yellow-500'
                      : 'text-green-600'
                  : isActive
                    ? 'text-gray-700'
                    : 'text-gray-400',
              )}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default StatusIndicator;
