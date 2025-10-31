import Polygon from '@/assets/icons/polygon.svg?react';
import { useState } from 'react';

export const TooltipButton = ({ example }: { example: string }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        className="rounded-xxs border border-neutral-80 px-[6px] py-1 text-xsmall14 font-medium text-primary-80"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        💡 참고 예시
      </button>
      {isHovered && (
        <div className="z-[100]">
          <Polygon
            style={{
              height: '11px',
              width: '12px',
              filter: 'drop-shadow(0 -1px 1px rgb(0,0,0,0.08))',
            }}
            className="absolute right-[50%] top-[calc(100%+2px)] z-[102] translate-x-1/2 text-white"
            preserveAspectRatio="none"
          />
          <div
            className="absolute right-0 top-[calc(100%+12px)] z-[101] w-[384px] rounded-xxs bg-white p-3 text-neutral-0 drop-shadow"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <p className="whitespace-pre-line text-xsmall14 font-normal">
              {example}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
