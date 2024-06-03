import clsx from 'clsx';
import { useState } from 'react';

interface TenScoreProps {
  tenScore: number | null;
  setTenScore: (tenScore: number | null) => void;
}

const TenScore = ({ tenScore, setTenScore }: TenScoreProps) => {
  const handleTenScoreClick = (th: number) => {
    if (tenScore === th) {
      setTenScore(null);
    } else {
      setTenScore(th);
    }
  };

  return (
    <div className="flex items-center justify-center">
      {Array.from({ length: 11 }, (_, index) => index).map((th) => (
        <div
          key={th}
          className={clsx(
            'flex h-[2.5rem] w-[2.5rem] cursor-pointer items-center justify-center font-medium',
            {
              'bg-primary text-white': th === tenScore,
              'border border-r-0 border-primary-xlight bg-white last:border-r':
                th !== tenScore,
            },
          )}
          onClick={() => handleTenScoreClick(th)}
        >
          {th}
        </div>
      ))}
    </div>
  );
};

export default TenScore;
