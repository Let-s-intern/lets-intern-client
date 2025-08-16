import { useEffect, useRef, useState } from 'react';

const ScrollTooltipQuestion = () => {
  const tooltipRef = useRef<HTMLDivElement>(null);

  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(e: any) {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target)) {
        setIsTooltipOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [tooltipRef]);

  return (
    <div
      className="relative"
      ref={tooltipRef}
      onClick={(e) => e.stopPropagation()}
    >
      <i
        className="cursor-pointer"
        onClick={(e) => setIsTooltipOpen(!isTooltipOpen)}
      >
        <img src="/icons/tooltip-question.svg" alt="tooltip question" />
      </i>
      {isTooltipOpen && (
        <div className="absolute -bottom-4 left-1/2 z-30 -translate-x-1/2 translate-y-full rounded-xs bg-white shadow-[2px_0px_10px_rgba(0,0,0,0.07)]">
          <div
            className="absolute left-1/2 top-0 h-3 w-6 -translate-x-1/2 -translate-y-full bg-gray-300 blur-md"
            style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
          />
          <div
            className="absolute left-1/2 top-[1.5px] h-3 w-6 -translate-x-1/2 -translate-y-full bg-white"
            style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
          />
          <div className="flex w-max items-center justify-center p-3 text-sm font-light">
            미션 점수의 총합이 80점 이상인 경우에, 페이백 환급이 진행됩니다.
            <br />
            자세한 내용은 환급정책을 확인해주세요.
          </div>
        </div>
      )}
    </div>
  );
};

export default ScrollTooltipQuestion;
