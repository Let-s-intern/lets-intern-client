import ScoreTooltipQuestion from '../../ui/tooltip-question/ScoreTooltipQuestion';

interface Props {
  totalScore: number;
}

const ScoreSection = ({ totalScore }: Props) => {
  return (
    <section className="flex w-[12rem] flex-col rounded-xl border border-[#E4E4E7] p-6">
      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-[#4A495C]">미션 점수 현황</h2>
          <ScoreTooltipQuestion />
        </div>
        <div className="flex flex-1 items-center justify-start font-pretendard">
          <div className="flex items-end">
            <span className="text-3xl font-bold text-primary">
              {totalScore}
            </span>
            <span className="mb-[1px] ml-1 font-semibold text-[#D3D3D3]">
              /{100}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScoreSection;
