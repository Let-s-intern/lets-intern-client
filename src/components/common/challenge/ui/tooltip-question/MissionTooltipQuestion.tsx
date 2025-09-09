import { useEffect, useRef, useState } from 'react';

const MissionTooltipQuestion = () => {
  const tooltipRef = useRef<HTMLDivElement>(null);

  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target as Node)
      ) {
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
        onClick={() => setIsTooltipOpen(!isTooltipOpen)}
      >
        <img src="/icons/info-circle.svg" alt="tooltip question" />
      </i>
      {isTooltipOpen && (
        <div className="absolute left-1/2 top-full z-30 mt-2 -translate-x-1/2 shadow-[2px_0px_10px_rgba(0,0,0,0.07)] drop-shadow-xl md:-right-4 md:left-auto md:top-0 md:-translate-y-3 md:translate-x-full">
          <div
            className="absolute left-[1.5px] top-1.5 hidden h-6 w-3 -translate-x-full bg-static-100 md:block"
            style={{ clipPath: 'polygon(0 50%, 100% 100%, 100% 0)' }}
          />
          <div
            className="absolute left-[1.5px] top-1.5 hidden h-6 w-3 -translate-x-full bg-white md:block"
            style={{ clipPath: 'polygon(0% 50%, 100% 100%, 100% 0%)' }}
          />
          <div
            className="rotate-270 absolute left-1/2 top-[-10px] h-3 w-6 -translate-x-1/2 bg-white md:hidden"
            style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
          />
          <div className="flex w-max items-center rounded-xs bg-static-100">
            <img
              src="/images/mission-date-question-image-new.svg"
              alt="미션 제출 현황 아이콘 설명 이미지"
              className="hidden h-full object-contain md:block"
            />
            <img
              src="/images/mission-date-question-image-mo.svg"
              alt="미션 제출 현황 아이콘 설명 이미지"
              className="h-full object-contain md:hidden"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MissionTooltipQuestion;
