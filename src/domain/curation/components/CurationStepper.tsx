import clsx from 'clsx';
import { motion } from 'motion/react';

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
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex min-w-max items-center gap-4 rounded-lg bg-gradient-to-r from-gray-50 to-white p-4 shadow-lg md:min-w-0 md:gap-6 md:p-6">
        {steps.map((label, index) => {
          const isActive = index === currentStep;
          const isDone = index < currentStep;
          return (
            <div
              key={label}
              className="flex flex-1 items-center gap-3 md:gap-6"
            >
              <button
                type="button"
                onClick={() => onStepClick?.(index)}
                className="group flex flex-1 items-center gap-3 text-left transition-all hover:scale-105 md:gap-5"
              >
                <div
                  className={clsx(
                    'text-small16 md:text-medium18 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full font-black shadow-lg transition-all duration-300 md:h-12 md:w-12',
                    isActive &&
                      'bg-gradient-to-br from-primary to-primary-80 text-white shadow-primary/30 ring-4 ring-primary/10',
                    isDone &&
                      'bg-gradient-to-br from-primary to-primary-80 text-white shadow-primary/20',
                    !isActive &&
                      !isDone &&
                      'bg-gradient-to-br from-neutral-90 to-neutral-85 text-neutral-50 group-hover:from-neutral-85 group-hover:to-neutral-80',
                  )}
                >
                  {isDone ? '✓' : index + 1}
                </div>
                <span
                  className={clsx(
                    'md:text-small17 whitespace-nowrap text-xsmall14 font-bold transition-colors',
                    isActive
                      ? 'text-neutral-0'
                      : isDone
                        ? 'text-primary'
                        : 'text-neutral-40 group-hover:text-neutral-20',
                  )}
                >
                  {label}
                </span>
              </button>
              {index !== steps.length - 1 && (
                <motion.div
                  className="relative h-1 w-12 overflow-hidden rounded-full bg-neutral-90 md:w-20"
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 1 }}
                >
                  <motion.div
                    className="absolute inset-0 origin-left rounded-full bg-gradient-to-r from-primary to-primary-80"
                    initial={{ scaleX: isDone ? 1 : 0 }}
                    animate={{ scaleX: isDone ? 1 : isActive ? 0.5 : 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CurationStepper;
