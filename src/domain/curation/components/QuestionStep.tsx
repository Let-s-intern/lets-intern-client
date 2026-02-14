import { motion } from 'motion/react';
import { CurationQuestion } from '../types';

interface QuestionStepProps {
  question: CurationQuestion;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const QuestionStep = ({ question, value, onChange, error }: QuestionStepProps) => {
  return (
    <div className="flex w-full flex-col gap-y-6">
      <div className="flex flex-col gap-y-2 text-center">
        <h3 className="text-medium22 font-bold text-neutral-0">{question.title}</h3>
        {question.helper && (
          <p className="text-small16 font-medium text-neutral-40">{question.helper}</p>
        )}
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {question.options.map((option) => {
          const isActive = value === option.value;
          return (
            <motion.div
              key={option.value}
              onClick={() => onChange(option.value)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onChange(option.value);
                }
              }}
              className={`group relative flex h-full min-h-[130px] cursor-pointer flex-col items-center justify-center gap-y-2.5 overflow-hidden rounded-md border-2 bg-gradient-to-br p-5 text-center transition-all duration-300 ${
                isActive
                  ? 'border-primary from-primary-5 to-white shadow-xl shadow-primary/10 scale-[1.02]'
                  : 'border-neutral-85 from-white to-gray-50 shadow-sm hover:border-primary/40 hover:shadow-lg hover:scale-[1.01]'
              }`}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
            >
              {isActive && (
                <motion.div
                  className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  <span className="text-small14">✓</span>
                </motion.div>
              )}
              <span className={`text-medium18 font-bold transition-colors ${
                isActive ? 'text-primary' : 'text-neutral-0 group-hover:text-primary'
              }`}>
                {option.title}
              </span>
              {option.description && (
                <span className="text-small14 font-medium leading-relaxed text-neutral-45">{option.description}</span>
              )}
              {option.accent && (
                <span className="mt-auto rounded-full bg-gradient-to-r from-primary-10 to-primary-5 px-2.5 py-1 text-xsmall12 font-bold text-primary shadow-sm">
                  {option.accent}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
      {error && <p className="text-xsmall13 font-semibold text-[#FC5555]">{error}</p>}
    </div>
  );
};

export default QuestionStep;
