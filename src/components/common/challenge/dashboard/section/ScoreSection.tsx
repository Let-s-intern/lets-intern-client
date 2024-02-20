interface Props {
  refundInfo: any;
  isLoading: boolean;
}

const ScoreSection = ({ refundInfo, isLoading }: Props) => {
  if (isLoading) {
    return <section className="mb-10">로딩 중...</section>;
  }

  return (
    <section className="flex w-[12rem] flex-col rounded-xl border border-[#E4E4E7] p-6">
      <div className="flex flex-1 flex-col">
        <h2 className="font-semibold text-[#4A495C]">환급 가능 금액</h2>
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
        <h2 className="font-semibold text-[#4A495C]">오늘 함께한 참여자</h2>
        <div className="flex flex-1 items-center justify-start">
          <span className="font-pretendard text-2xl font-semibold text-[#4A495C]">
            {refundInfo.headCount}명 🔥
          </span>
        </div>
      </div>
    </section>
  );
};

export default ScoreSection;
