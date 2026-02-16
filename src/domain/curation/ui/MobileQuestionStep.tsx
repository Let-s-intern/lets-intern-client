import { motion } from 'motion/react';
import { CurationQuestion } from '../types/types';

interface MobileQuestionStepProps {
  question: CurationQuestion;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const MobileQuestionStep = ({
  question,
  value,
  onChange,
  error,
}: MobileQuestionStepProps) => {
  return (
    <div className="flex w-full flex-col gap-y-6">
      <div className="flex flex-col gap-y-2 text-center">
        <h3 className="text-medium18 font-bold text-neutral-0">
          {question.title}
        </h3>
        {question.helper && (
          <p className="text-xsmall14 font-medium text-neutral-40">
            {question.helper}
          </p>
        )}
      </div>
      <div className="flex w-full flex-col gap-3">
        {question.options.map((option) => {
          const isActive = value === option.value;
          return (
            <motion.button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`relative flex w-full cursor-pointer flex-col items-center justify-center gap-y-2 overflow-hidden rounded-md border-2 bg-gradient-to-br px-5 py-4 text-center transition-all duration-300 ${
                isActive
                  ? 'border-primary from-primary-5 to-white shadow-lg shadow-primary/10'
                  : 'border-neutral-85 from-white to-gray-50 shadow-sm active:scale-[0.98]'
              }`}
              whileTap={{ scale: 0.98 }}
            >
              {isActive && (
                <motion.div
                  className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white shadow-md"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  <span className="text-xsmall12">✓</span>
                </motion.div>
              )}
              <span
                className={`text-medium16 font-bold ${
                  isActive ? 'text-primary' : 'text-neutral-0'
                }`}
              >
                {option.title}
              </span>
              {option.accent && (
                <span className="text-xsmall12 rounded-full bg-gradient-to-r from-primary-10 to-primary-5 px-2.5 py-1 font-bold text-primary shadow-sm">
                  {option.accent}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
      {error && (
        <p className="text-xsmall13 font-semibold text-[#FC5555]">{error}</p>
      )}
    </div>
  );
};

export default MobileQuestionStep;
