import { useQuery } from "@tanstack/react-query";
import axios from "../../../../../utils/axios";
import LoadingContainer from "../../../ui/loading/LoadingContainer";
import { bankTypeToText } from "../../../../../utils/convert";
import dayjs from "dayjs";

const PriceInfoModal = ({onClose, paymentId}:{
  onClose: () => void;
  paymentId: number;
}) => {

  const { data, isLoading} = useQuery({
    queryKey: ['payment', paymentId],
    queryFn: async () => {
      const res = await axios.get(`/payment/${paymentId}`);
      console.log(res.data);
      return res.data.data;
    }
  });

  return (
    <div className="z-100 fixed inset-0 flex items-center justify-center bg-neutral-0/50 px-8 z-10">
      <div className="flex items-center justify-center flex-col p-6 rounded-lg gap-y-5 bg-static-100 relative w-[30rem]">
        <img
        onClick={onClose}
        src="/icons/Close_SM.svg" alt="닫기" className="absolute top-6 right-6 cursor-pointer w-6 h-6" />
        {
          isLoading ? (
            <LoadingContainer />
          ) : data && (
            <>
            <div className="w-full text-center font-bold text-lg">결제정보</div>
            <div className="w-full flex flex-col items-start justify-center pb-3 border-b-2 border-neutral-30 border-b-neutral-85">
              <div className="font-semibold mb-3">결제 방법</div>
              <div className="w-full flex item-center justify-between gap-x-2 p-2">
                <div className="text-neutral-30">입금 계좌</div>
                <div className="grow flex item-center justify-end font-semibold flex-wrap">
                  <div>
                    {bankTypeToText[data.priceInfo.accountType]}
                  </div>
                  <div>
                    {data.priceInfo.accountNumber}
                  </div>
                </div>
              </div>
              <div className="w-full flex item-center justify-between gap-x-2 p-2">
                <div className="text-neutral-30">입금 마감 기한</div>
                <div className="grow flex item-center justify-end font-semibold text-end">
                  {dayjs(data.priceInfo.deadline).format(
                    `MM.DD (ddd) A hh시${
                      dayjs(data.priceInfo.deadline).minute() !== 0 ? ' mm분' : ''
                    }`,
                  )}
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col items-start justify-center pb-3 border-b-2 border-neutral-30 border-b-neutral-85">
              <div className="w-full flex item-center justify-between gap-x-2 p-2">
                <div className="text-neutral-30">참여 비용</div>
                <div className="grow flex item-center justify-end font-semibold">
                  {data.priceInfo.price} 원
                </div>
              </div>
              <div className="w-full flex item-center justify-between gap-x-2 p-2 font-semibold text-primary">
                <div className="">쿠폰 할인</div>
                <div className="grow flex item-center justify-end font-semibold">
                  -{data.paymentInfo.couponDiscount === null ? '0' : data.paymentInfo.couponDiscount} 원
                </div>
              </div>
              <div className="w-full flex item-center justify-between gap-x-2 p-2 font-semibold text-system-error">
                <div className="">할인 {Math.floor((data.priceInfo.price - data.paymentInfo.finalPrice - data.paymentInfo.couponDiscount)/data.priceInfo.price * 100)}%
                </div>
                <div className="grow flex item-center justify-end font-semibold">
                  -{
                    data.priceInfo.price - data.paymentInfo.finalPrice - data.paymentInfo.couponDiscount
                  } 원
                </div>
              </div>
            </div>
            <div className="w-full flex item-center justify-between gap-x-2 p-2">
              <div className="font-semibold">
                최종 결제 금액
              </div>
              <div className=" font-semibold">
                  {
                    data.paymentInfo.finalPrice
                  } 원
              </div>
            </div>
            </>
          )
        }
      </div>
    </div>
  );
};

export default PriceInfoModal;