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
        <div className="absolute -bottom-4 left-1/2 z-30 -translate-x-1/2 translate-y-full rounded border border-gray-400 bg-white">
          <div
            className="absolute left-1/2 top-0 h-3 w-6 -translate-x-1/2 -translate-y-full bg-gray-400"
            style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
          />
          <div
            className="absolute left-1/2 top-[1.5px] h-3 w-6 -translate-x-1/2 -translate-y-full bg-white"
            style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
          />
          <div className="flex w-[300px] items-center justify-center px-4 py-4 text-sm">
            환급 미션의 ‘정상 제출'이 완료된 미션에 한해 환급이 진행됩니다.
            자세한 내용은 환급정책을 확인해 주세요.
          </div>
        </div>
      )}
    </div>
  );
};

export default ScrollTooltipQuestion;
