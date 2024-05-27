import clsx from 'clsx';
import { useState } from 'react';

interface YesNoScoreProps {
  isYes: boolean | null;
  setIsYes: React.Dispatch<React.SetStateAction<boolean | null>>;
}

const YesNoScore = ({ isYes, setIsYes }: YesNoScoreProps) => {
  const handleYesOrNoClick = (isYesValue: boolean) => {
    if (isYes === isYesValue) {
      setIsYes(null);
    } else {
      setIsYes(isYesValue);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        className={clsx(
          'w-full rounded-md border-2 px-5 py-2 font-medium text-primary-dark hover:border-primary hover:bg-primary hover:text-neutral-100',
          {
            'border-primary bg-primary text-neutral-100': isYes === true,
            'border-primary-xlight bg-white': isYes === false || isYes === null,
          },
        )}
        onClick={() => handleYesOrNoClick(true)}
      >
        네
      </button>
      <button
        className={clsx(
          'w-full rounded-md border-2 px-5 py-2 font-medium text-primary-dark hover:border-primary hover:bg-primary hover:text-neutral-100',
          {
            'border-primary bg-primary text-neutral-100': isYes === false,
            'border-primary-xlight bg-white': isYes === true || isYes === null,
          },
        )}
        onClick={() => handleYesOrNoClick(false)}
      >
        아니요
      </button>
    </div>
  );
};

export default YesNoScore;
