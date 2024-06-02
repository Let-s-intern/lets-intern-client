import clsx from 'clsx';
import { useState } from 'react';

interface PayPlanContentProps {
  contentIndex: number;
  setContentIndex: (contentIndex: number) => void;
}

const ChoicePayPlanContent = ({
  contentIndex,
  setContentIndex,
}: PayPlanContentProps) => {
  const [plan, setPlan] = useState<'BASIC' | 'PREMIUM' | null>(null);

  const handlePlanClick = (selectedPlan: 'BASIC' | 'PREMIUM' | null) => {
    setPlan(selectedPlan);
  };

  const handleNextButtonClick = () => {
    if (plan === null) return;
    setContentIndex(contentIndex + 1);
  };

  return (
    <div className="flex flex-col gap-5">
      <p className="font-medium text-neutral-0">
        프로그램 유형을 선택해주세요!
      </p>
      <ul>
        <li
          className={clsx(
            'flex cursor-pointer items-center gap-2 rounded-sm px-1.5 py-4',
            {
              'bg-primary-20': plan === 'BASIC',
              'bg-transparent': plan !== 'BASIC',
            },
          )}
          onClick={() => handlePlanClick('BASIC')}
        >
          <div className="flex items-center justify-center px-1.5">
            <div
              className={clsx(
                'flex h-[1.5rem] w-[1.5rem] items-center justify-center rounded-full border-[2.5px]',
                {
                  'b border-primary bg-transparent': plan === 'BASIC',
                  'border-neutral-60 bg-neutral-80 bg-transparent':
                    plan !== 'BASIC',
                },
              )}
            >
              {plan === 'BASIC' && (
                <div className="h-[0.75rem] w-[0.75rem] rounded-full bg-primary" />
              )}
            </div>
          </div>
          <span className="text-neutral-0">베이직</span>
        </li>
        <li
          className={clsx(
            'flex cursor-pointer items-center gap-2 rounded-sm px-1.5 py-4',
            {
              'bg-primary-20': plan === 'PREMIUM',
              'bg-transparent': plan !== 'PREMIUM',
            },
          )}
          onClick={() => handlePlanClick('PREMIUM')}
        >
          <div className="flex items-center justify-center px-1.5">
            <div
              className={clsx(
                'flex h-[1.5rem] w-[1.5rem] items-center justify-center rounded-full border-[2.5px]',
                {
                  'b border-primary bg-transparent': plan === 'PREMIUM',
                  'border-neutral-60 bg-neutral-80 bg-transparent':
                    plan !== 'PREMIUM',
                },
              )}
            >
              {plan === 'PREMIUM' && (
                <div className="h-[0.75rem] w-[0.75rem] rounded-full bg-primary" />
              )}
            </div>
          </div>
          <span className="text-neutral-0">프리미엄</span>
        </li>
      </ul>
      <button
        className="flex w-full justify-center rounded-md border-2 border-primary bg-neutral-100 px-6 py-3 text-lg font-medium text-primary-dark disabled:border-neutral-60 disabled:text-neutral-40"
        onClick={handleNextButtonClick}
        disabled={plan === null}
      >
        신청 폼 입력하기
      </button>
    </div>
  );
};

export default ChoicePayPlanContent;
