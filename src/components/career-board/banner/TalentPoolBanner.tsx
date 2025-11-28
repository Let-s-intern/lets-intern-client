'use client';

import clsx from 'clsx';
import { useState } from 'react';

interface TalentPoolBannerProps {
  hasCareerData?: boolean;
  isRegistered?: boolean;
  onToggle?: (value: boolean) => void;
}

const TalentPoolBanner = ({
  hasCareerData = false,
  isRegistered = false,
  onToggle,
}: TalentPoolBannerProps) => {
  const [isEnabled, setIsEnabled] = useState(isRegistered);
  const isDisabled = !hasCareerData;

  const handleToggle = () => {
    if (isDisabled) return;
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    onToggle?.(newValue);
  };

  const message = isEnabled
    ? '인재풀에 등록되어 있어요. 채용 제안을 받아보세요!'
    : '인재풀 등록하고 채용 제안을 받아보세요!';

  const subMessage = isEnabled
    ? '당신의 커리어에 꼭 맞는 기업을 추천해드려요.'
    : '당신의 커리어에 꼭 맞는 기업을 추천해드려요.';

  return (
    <div className="w-full rounded-xs border border-primary-20 bg-[#FBFCFF] px-4 py-3 md:px-4 md:py-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 flex-col gap-1">
          <p className="text-xsmall14 font-medium text-[#333333]">{message}</p>
          <p className="text-xs text-[#666666] md:text-sm">{subMessage}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden text-xs font-medium text-[#5C5F66] md:block">
            인재풀 등록
          </span>
          <button
            type="button"
            onClick={handleToggle}
            disabled={isDisabled}
            className={clsx(
              'relative h-6 w-10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
              {
                'bg-primary': isEnabled && !isDisabled,
                'bg-[#D1D1D1]': !isEnabled || isDisabled,
                'cursor-not-allowed opacity-50': isDisabled,
                'cursor-pointer': !isDisabled,
              },
            )}
            aria-label="인재풀 등록 토글"
            aria-checked={isEnabled}
            role="switch"
          >
            <span
              className={clsx(
                'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform',
                {
                  'translate-x-4': isEnabled && !isDisabled,
                  'translate-x-0': !isEnabled || isDisabled,
                },
              )}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TalentPoolBanner;
