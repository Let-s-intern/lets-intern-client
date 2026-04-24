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

const STEP_ACTIVE_STYLES = [
  'bg-gray-100 text-gray-500',
  'bg-blue-50 text-blue-600',
  'bg-green-50 text-green-700',
] as const;

function getStepStyle(idx: number, activeStep: number): string {
  const isCurrentStep = idx === activeStep;
  if (isCurrentStep) return STEP_ACTIVE_STYLES[idx];
  const isPastStep = idx < activeStep;
  return isPastStep ? 'bg-gray-50 text-gray-700' : 'bg-gray-50 text-gray-400';
}

const StatusIndicator = ({ feedbackStatus }: StatusIndicatorProps) => {
  const activeStep = getActiveStep(feedbackStatus);

  return (
    <div className="flex items-center gap-2 py-3 text-sm">
      {STEPS.map((step, idx) => (
        <div key={step.key} className="flex items-center gap-2">
          {idx > 0 ? <span className="text-gray-400">&rarr;</span> : null}
          <span
            className={twMerge(
              'rounded-full px-2.5 py-0.5 text-xs font-medium',
              getStepStyle(idx, activeStep),
            )}
          >
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default StatusIndicator;
