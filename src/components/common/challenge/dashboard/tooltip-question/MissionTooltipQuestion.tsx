import { useState } from 'react';

const MissionTooltipQuestion = () => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <i
        className="cursor-pointer"
        onClick={(e) => setIsTooltipOpen(!isTooltipOpen)}
      >
        <img src="/icons/tooltip-question.svg" alt="tooltip question" />
      </i>
      {isTooltipOpen && (
        <div className="absolute right-0 top-0 z-30 w-[700px] -translate-y-[28px] translate-x-[calc(100%-12px)]">
          <img
            src="/images/mission-date-question-image.svg"
            alt="미션 아이콘 설명 이미지"
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};

export default MissionTooltipQuestion;
