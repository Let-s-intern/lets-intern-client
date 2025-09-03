import { useEffect, useRef, useState } from 'react';

const OldMissionTooltipQuestion = () => {
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
        <img src="/icons/tooltip-question.svg" alt="tooltip question" />
      </i>
      {isTooltipOpen && (
        <div className="absolute -right-4 -top-3 z-30 translate-x-full drop-shadow-xl">
          <div
            className="absolute left-[1.5px] top-1.5 h-6 w-3 -translate-x-full bg-static-100"
            style={{ clipPath: 'polygon(0 50%, 100% 100%, 100% 0)' }}
          />
          <div
            className="absolute left-[1.5px] top-1.5 h-6 w-3 -translate-x-full bg-white"
            style={{ clipPath: 'polygon(0% 50%, 100% 100%, 100% 0%)' }}
          />
          <div className="flex h-[340px] w-[380px] items-center rounded-xs bg-static-100 p-4">
            <img
              src="/images/mission-date-question-image.svg"
              alt="미션 제출 현황 아이콘 설명 이미지"
              className="h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OldMissionTooltipQuestion;
