import clsx from 'clsx';
import { bankTypeToText } from '../../../../../../utils/convert';
import PriceView from './PriceView';
import { calculateProgramPrice } from '../../../../../../utils/programPrice';

interface CautionPriceContentProps {
  programFee: {
    feeType: string;
    feeCharge: number;
    feeRefund: number;
    discountValue: number;
    accountType: string;
    accountNumber: string;
    feeDueDate: string;
  };
  couponDiscount: number;
  priceViewClassName?: string;
}

const CautionPriceContent = ({
  programFee,
  couponDiscount,
  priceViewClassName,
}: CautionPriceContentProps) => {
  const { price, discountAmount, totalPrice } = calculateProgramPrice({
    feeType: programFee.feeType,
    feeCharge: programFee.feeCharge,
    feeRefund: programFee.feeRefund,
    programDiscount: programFee.discountValue,
    couponDiscount,
  });

  const formatDateString = (dateString: string) => {
    const date = new Date(dateString);
    const isAm = date.getHours() < 12;
    let hours = date.getHours();
    hours = hours % 12;
    hours = hours ? hours : 12;
    const hoursStr = hours < 10 ? '0' + hours : hours;
    return `${date.getFullYear()}년 ${
      date.getMonth() + 1
    }월 ${date.getDate()}일 ${isAm ? '오전' : '오후'} ${hoursStr}시${
      date.getMinutes() !== 0 && ` ${date.getMinutes()}분`
    }`;
  };

  return (
    <>
      {programFee.feeType !== 'FREE' && price !== 0 && (
        <>
          <hr />
          <section className="mt-4 font-pretendard">
            <h3 className="font-semibold text-zinc-600">결제 방법</h3>
            <div className="mt-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-zinc-600">
                  입급 계좌
                </span>
                <span className="text-sm text-zinc-600">
                  {bankTypeToText[programFee.accountType]}{' '}
                  {programFee.accountNumber}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-zinc-600">
                  입금 마감기한
                </span>
                <span className="text-sm text-zinc-600">
                  {formatDateString(programFee.feeDueDate)}
                </span>
              </div>
            </div>
          </section>
          <hr className="mb-3 mt-4" />
          <PriceView
            as="section"
            className={clsx('mt-4', priceViewClassName)}
            price={price}
            discountAmount={discountAmount}
            couponDiscount={couponDiscount}
            totalPrice={totalPrice}
          />
        </>
      )}
    </>
  );
};

export default CautionPriceContent;
