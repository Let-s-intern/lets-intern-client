const PayInfoSection = () => {
  return (
    <div className="flex flex-col gap-3">
      <div className="font-semibold text-neutral-0">결제 방법</div>
      <div>
        <div className="flex items-center justify-between p-1.5 text-neutral-0">
          <span>입금 계좌</span>
          <span>토스뱅크 12345688089967</span>
        </div>
        <div className="flex items-center justify-between p-1.5 text-neutral-0">
          <span>입금 마감 기한</span>
          <span>2024년 3월 23일 오후 10시</span>
        </div>
      </div>
    </div>
  );
};

export default PayInfoSection;
