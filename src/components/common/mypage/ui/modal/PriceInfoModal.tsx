
const PriceInfoModal = ({onClose, applicationId}:{
  onClose: () => void;
  applicationId: number;
}) => {
  return (
    <div className="z-100 fixed inset-0 flex items-center justify-center bg-neutral-0/50 px-8">
      <div className="flex items-center justify-center flex-col p-6 rounded-lg gap-y-5 bg-static-100 relative w-[30rem]">
        <img
        onClick={onClose}
        src="/icons/Close_SM.svg" alt="닫기" className="absolute top-6 right-6 cursor-pointer w-6 h-6" />
        <div className="w-full text-center font-bold text-lg">결제정보</div>
        <div className="w-full flex flex-col items-start justify-center pb-3 border-b-2 border-neutral-30 border-b-neutral-85">
          <div className="font-semibold mb-3">결제 방법</div>
          <div className="w-full flex item-center justify-between gap-x-2 p-2">
            <div className="text-neutral-30">입금 계좌</div>
            <div className="grow flex item-center justify-end font-semibold">
              입금계좌 내용
            </div>
          </div>
          <div className="w-full flex item-center justify-between gap-x-2 p-2">
            <div className="text-neutral-30">입금 마감 기한</div>
            <div className="grow flex item-center justify-end font-semibold">
              입금계좌 내용
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col items-start justify-center pb-3 border-b-2 border-neutral-30 border-b-neutral-85">
          <div className="w-full flex item-center justify-between gap-x-2 p-2">
            <div className="text-neutral-30">참여 비용</div>
            <div className="grow flex item-center justify-end font-semibold">
              입금계좌 내용
            </div>
          </div>
          <div className="w-full flex item-center justify-between gap-x-2 p-2 font-semibold text-primary">
            <div className="">쿠폰 할인</div>
            <div className="grow flex item-center justify-end font-semibold">
              입금계좌 내용
            </div>
          </div>
          <div className="w-full flex item-center justify-between gap-x-2 p-2 font-semibold text-system-error">
            <div className="">할인 %</div>
            <div className="grow flex item-center justify-end font-semibold">
              입금계좌 내용
            </div>
          </div>
        </div>
        <div className="w-full flex item-center justify-between gap-x-2 p-2">
          <div className="font-semibold">
            최종 결제 금액
          </div>
          <div className=" font-semibold">
              000
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceInfoModal;