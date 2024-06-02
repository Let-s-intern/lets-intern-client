const PriceSection = () => {
  return (
    <div className="flex flex-col gap-3">
      <div className="font-semibold text-neutral-0">결제 금액</div>
      <div>
        <div className="flex items-center justify-between px-1.5 py-2.5 text-neutral-0">
          <span>참여 비용</span>
          <span>80,0000원</span>
        </div>
        <div className="flex items-center justify-between px-1.5 py-2.5 font-semibold text-primary">
          <span>쿠폰 할인</span>
          <span>-0원</span>
        </div>
        <div className="flex items-center justify-between px-1.5 py-2.5 font-semibold text-system-error">
          <span>할인 50%</span>
          <span>-0원</span>
        </div>
      </div>
    </div>
  );
};

export default PriceSection;
