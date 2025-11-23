import Polygon from '@/assets/icons/polygon.svg?react';
import { useEffect, useRef, useState } from 'react';

export const TooltipButton = ({ example }: { example: string }) => {
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseLeave = () => {
    // 0.1초 후에 사라지도록 타이머
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 100);
  };

  const handleMouseEnter = () => {
    // 마우스가 다시 들어오면 타이머 취소
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsHovered(true);
  };

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className="relative"
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      <button
        type="button"
        className="rounded-xxs border border-neutral-80 px-[6px] py-1 text-xsmall14 font-medium text-primary-80"
        onMouseEnter={() => setIsHovered(true)}
        onClick={() => setIsHovered((prev) => !prev)}
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
            className="absolute right-0 top-[calc(100%+12px)] z-[101] w-[320px] rounded-xxs bg-white p-3 text-neutral-0 drop-shadow md:w-[384px]"
            onMouseEnter={() => setIsHovered(true)}
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
