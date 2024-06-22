import { useQuery } from '@tanstack/react-query';
import axios from '../../../../../utils/axios';
import LoadingContainer from '../../../ui/loading/LoadingContainer';
import { bankTypeToText } from '../../../../../utils/convert';
import dayjs from 'dayjs';

const PriceInfoModal = ({
  onClose,
  paymentId,
}: {
  onClose: () => void;
  paymentId: number;
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ['payment', paymentId],
    queryFn: async () => {
      const res = await axios.get(`/payment/${paymentId}`);
      console.log(res.data);
      return res.data.data;
    },
  });

  return (
    <div className="z-100 fixed inset-0 z-10 flex items-center justify-center bg-neutral-0/50 px-8">
      <div className="relative flex w-[30rem] flex-col items-center justify-center gap-y-5 rounded-lg bg-static-100 p-6">
        <img
          onClick={onClose}
          src="/icons/Close_SM.svg"
          alt="닫기"
          className="absolute right-6 top-6 h-6 w-6 cursor-pointer"
        />
        {isLoading ? (
          <LoadingContainer />
        ) : (
          data && (
            <>
              <div className="w-full text-center text-lg font-bold">
                결제정보
              </div>
              <div className="flex w-full flex-col items-start justify-center border-b-2 border-neutral-30 border-b-neutral-85 pb-3">
                <div className="mb-3 font-semibold">결제 방법</div>
                <div className="item-center flex w-full justify-between gap-x-2 p-2">
                  <div className="text-neutral-30">입금 계좌</div>
                  <div className="item-center flex grow flex-wrap justify-end gap-1.5 font-semibold">
                    <div>{bankTypeToText[data.priceInfo.accountType]}</div>
                    <div>{data.priceInfo.accountNumber}</div>
                  </div>
                </div>
                <div className="item-center flex w-full justify-between gap-x-2 p-2">
                  <div className="text-neutral-30">입금 마감 기한</div>
                  <div className="item-center flex grow justify-end text-end font-semibold">
                    {dayjs(data.priceInfo.deadline).format(
                      `MM.DD (ddd) A hh시${
                        dayjs(data.priceInfo.deadline).minute() !== 0
                          ? ' mm분'
                          : ''
                      }`,
                    )}
                  </div>
                </div>
              </div>
              <div className="flex w-full flex-col items-start justify-center border-b-2 border-neutral-30 border-b-neutral-85 pb-3">
                <div className="item-center flex w-full justify-between gap-x-2 p-2">
                  <div className="text-neutral-30">참여 비용</div>
                  <div className="item-center flex grow justify-end font-semibold">
                    {data.priceInfo.price.toLocaleString()} 원
                  </div>
                </div>
                <div className="item-center flex w-full justify-between gap-x-2 p-2 font-semibold text-primary">
                  <div className="">쿠폰 할인</div>
                  <div className="item-center flex grow justify-end font-semibold">
                    -
                    {data.paymentInfo.couponDiscount === null
                      ? 0
                      : data.paymentInfo.couponDiscount === -1
                      ? (
                          data.priceInfo.price - data.priceInfo.discount
                        ).toLocaleString()
                      : data.paymentInfo.couponDiscount.toLocaleString()}{' '}
                    원
                  </div>
                </div>
                <div className="item-center flex w-full justify-between gap-x-2 p-2 font-semibold text-system-error">
                  <div className="">
                    할인{' '}
                    {Math.floor(
                      (data.priceInfo.discount / data.priceInfo.price) * 100,
                    )}
                    %
                  </div>
                  <div className="item-center flex grow justify-end font-semibold">
                    -{data.priceInfo.discount.toLocaleString()} 원
                  </div>
                </div>
              </div>
              <div className="item-center flex w-full justify-between gap-x-2 p-2">
                <div className="font-semibold">최종 결제 금액</div>
                <div className=" font-semibold">
                  {data.paymentInfo.finalPrice.toLocaleString()} 원
                </div>
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default PriceInfoModal;
