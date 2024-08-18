import { useState } from 'react';
import ScoreTooltipQuestion from '../../ui/tooltip-question/ScoreTooltipQuestion';

interface Props {
  totalScore: number;
  currentScore: number;
}

const ScoreSection = ({ totalScore, currentScore }: Props) => {
  const [isHoverButton, setIsHoverButton] = useState(false);
  return (
    <section className="relative flex w-full flex-col gap-y-4 rounded-xl border border-[#E4E4E7] p-6">
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-[#4A495C]">미션 점수 현황</h2>
          <ScoreTooltipQuestion />
        </div>
        <div className="flex items-center justify-start">
          <div className="flex items-end">
            <span className="text-3xl font-bold text-primary">
              {currentScore}
            </span>
            <span className="mb-[1px] ml-1 font-semibold text-[#D3D3D3]">
              /{totalScore}
            </span>
          </div>
        </div>
      </div>
      <button
        className={`flex items-center justify-center rounded-sm border-2 bg-neutral-100 px-4 py-1.5 text-xsmall14 font-medium outline-none ${currentScore < 80 ? 'cursor-not-allowed border-neutral-80 text-neutral-35' : 'border-primary text-primary-dark'}`}
        onClick={() => {
          if (currentScore < 80) return;
          // openModal();
        }}
        onMouseEnter={() => setIsHoverButton(true)}
        onMouseLeave={() => setIsHoverButton(false)}
      >
        수료증 발급
      </button>
      <div
        className="absolute bottom-[15px] left-1/2 w-[230px] -translate-x-1/2 translate-y-full transform bg-transparent p-4 pt-[29px] text-xsmall14 text-[#333]"
        style={{
          backgroundImage: 'url(/images/common/tooltip-arrow.svg)',
        }}
      >
        <p className="relative z-10 rounded-sm">
          마지막 미션까지 <span className="font-bold">총 80점 이상</span>을
          획득하면 수료증을 발급 받을 수 있어요!
        </p>
      </div>
      {/* {isHoverButton && (
      )} */}
    </section>
  );
};

export default ScoreSection;
