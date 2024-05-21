import ScoreTooltipQuestion from '../tooltip-question/ScoreTooltipQuestion';

interface Props {
  refundInfo: any;
  isLoading: boolean;
  todayTh: number;
}

const ScoreSection = ({ refundInfo, isLoading, todayTh }: Props) => {
  if (isLoading) {
    return <section className="mb-10">로딩 중...</section>;
  }

  return (
    <section className="flex w-[12rem] flex-col rounded-xl border border-[#E4E4E7] p-6">
      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-[#4A495C]">환급 가능 금액</h2>
          <ScoreTooltipQuestion />
        </div>
        <div className="flex flex-1 items-center justify-start font-pretendard">
          <div className="flex items-end">
            <span className="text-3xl font-bold text-primary">
              {refundInfo.currentRefund}
            </span>
            <span className="mb-[1px] ml-1 font-semibold text-[#D3D3D3]">
              /{refundInfo.totalRefund}
            </span>
          </div>
        </div>
      </div>
      <hr className="my-4 border-[#AEADB6]" />
      <div className="flex flex-1 flex-col">
        <h2 className="font-semibold text-[#4A495C]">
          {refundInfo.yesterdayHeadCount !== null ? (
            <>
              {todayTh - 1}회차에
              <br />
              성공한 참여자
            </>
          ) : (
            <>
              챌린지에
              <br />
              함께하는 참여자
            </>
          )}
        </h2>
        <div className="flex flex-1 items-center justify-start">
          <span className="font-pretendard text-2xl font-semibold text-[#4A495C]">
            {refundInfo.yesterdayHeadCount !== null
              ? refundInfo.yesterdayHeadCount
              : refundInfo.finalHeadCount}
            명 🔥
          </span>
        </div>
      </div>
    </section>
  );
};

export default ScoreSection;
