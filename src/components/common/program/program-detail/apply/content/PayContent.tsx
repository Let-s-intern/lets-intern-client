import dayjs from 'dayjs';
import { useRef } from 'react';
import { FaArrowLeft } from 'react-icons/fa6';
import { ProgramQuery } from '../../../../../../api/program';
import { ICouponForm } from '../../../../../../types/interface';
import ProgramCard from '../../../ProgramCard';

import { PayInfo, ProgramDate } from '../../section/ApplySection';
import CouponSection from '../section/CouponSection';
import PriceSection from '../section/PriceSection';

interface PayContentProps {
  payInfo: PayInfo;
  coupon: ICouponForm;
  setCoupon: (
    coupon: ((prevCoupon: ICouponForm) => ICouponForm) | ICouponForm,
  ) => void;
  handleApplyButtonClick: () => void;
  contentIndex: number;
  setContentIndex: (contentIndex: number) => void;
  programType: 'live' | 'challenge';
  totalPrice: number;
  programDate: ProgramDate;
  programQuery: ProgramQuery;
  programId: number;
}

const PayContent = ({
  payInfo,
  coupon,
  setCoupon,
  handleApplyButtonClick,
  contentIndex,
  setContentIndex,
  programType,
  totalPrice,
  programDate,
  programQuery,
  programId,
}: PayContentProps) => {
  const topRef = useRef<HTMLDivElement>(null);

  const handleBackButtonClick = () => {
    setContentIndex(contentIndex - 2);
  };

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex h-full flex-col gap-6">
        {payInfo.challengePriceType !== 'FREE' &&
          payInfo.livePriceType !== 'FREE' && (
            <>
              <h2 className="text-small20 font-bold" ref={topRef}>
                결제하기
              </h2>
              <h3 className="text-xsmall16 font-semibold text-neutral-0">
                {programType === 'live'
                  ? 'LIVE 클래스'
                  : programType === 'challenge'
                    ? '챌린지'
                    : ''}{' '}
                프로그램 정보
              </h3>
              <ProgramCard
                border={false}
                type={programType}
                id={programId}
                title={programQuery.query.data?.title ?? ''}
                thumbnail={programQuery.query.data?.thumbnail ?? ''}
                startDate={programDate.startDate ?? dayjs()}
                endDate={programDate.endDate ?? dayjs()}
                thumbnailLinkClassName="max-w-32"
              />
              <hr className="bg-neutral-85" />
              <div className="font-semibold text-neutral-0">결제</div>
              <CouponSection setCoupon={setCoupon} programType={programType} />
              <hr className="bg-neutral-85" />
              <PriceSection payInfo={payInfo} coupon={coupon} />
              <hr className="bg-neutral-85" />
              <div className="flex h-10 items-center justify-between px-3 font-semibold text-neutral-0">
                <span>결제금액</span>
                <span>{totalPrice.toLocaleString()}원</span>
              </div>
            </>
          )}
      </div>
      <div className="flex gap-2">
        <button
          className="flex w-full flex-1 items-center justify-center rounded-md border-2 border-primary bg-neutral-100 px-6 py-3 text-lg font-medium text-primary-dark"
          onClick={handleBackButtonClick}
        >
          <span className="text-[1.25rem]">
            <FaArrowLeft />
          </span>
        </button>
        <button
          className="complete_button text-1.125-medium flex w-full justify-center rounded-md bg-primary px-6 py-3 font-medium text-neutral-100"
          onClick={() => {
            handleApplyButtonClick();
          }}
        >
          결제하기
        </button>
      </div>
    </div>
  );
};

export default PayContent;
