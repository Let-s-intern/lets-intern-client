import { UserInfo } from '@/lib/order';
import { twMerge } from '@/lib/twMerge';
import { useRef } from 'react';
import { FaArrowLeft } from 'react-icons/fa6';
import { ProgramQuery } from '../../../../../api/program';
import Input from '../../../../../common/ui/input/Input';
import { ICouponForm } from '../../../../../types/interface';
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
  handleApplyButtonClick: (isFree: boolean) => void;
  contentIndex: number;
  setContentIndex: (contentIndex: number) => void;
  programType: 'live' | 'challenge';
  progressType: string;
  totalPrice: number;
  programDate: ProgramDate;
  programQuery: ProgramQuery;
  programId: number;
  userInfo: UserInfo;
  isMobile?: boolean;
}

const PayContent = ({
  payInfo,
  coupon,
  setCoupon,
  handleApplyButtonClick,
  contentIndex,
  setContentIndex,
  programType,
  progressType,
  totalPrice,
  programDate,
  programQuery,
  programId,
  userInfo,
  isMobile,
}: PayContentProps) => {
  const topRef = useRef<HTMLDivElement>(null);

  const handleBackButtonClick = () => {
    setContentIndex(contentIndex - 2);
  };

  const isFree =
    payInfo.challengePriceType === 'FREE' ||
    payInfo.livePriceType === 'FREE' ||
    payInfo.price === 0;

  return (
    <div className={`flex h-full flex-col gap-3 ${isMobile ? 'px-5' : ''}`}>
      <h2 className="pb-6 pt-3 text-small20 font-bold md:py-0" ref={topRef}>
        결제하기
      </h2>
      <div className="flex flex-col gap-y-10 pb-8">
        <div className="flex flex-col gap-y-6">
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
            startDate={programDate.startDate}
            endDate={programDate.endDate}
            progressType={progressType}
            thumbnailLinkClassName="max-w-32"
            showType={programType === 'live'}
          />
        </div>
        <div className="flex flex-col gap-y-6">
          <h3 className="text-xsmall16 font-semibold text-neutral-0">
            참여자 정보
          </h3>
          <div className="mb-4 flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="ml-3 text-xsmall14 font-semibold">이름</label>
              <Input
                value={userInfo.name}
                disabled
                readOnly
                className="text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="ml-3 text-xsmall14 font-semibold">
                휴대폰 번호
              </label>
              <Input
                value={userInfo.phoneNumber}
                disabled
                readOnly
                className="text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="ml-3 text-xsmall14 font-semibold">이메일</label>
              <Input
                value={userInfo.contactEmail}
                disabled
                readOnly
                className="text-sm"
              />
            </div>
          </div>
        </div>
        {!isFree && (
          <div className="flex flex-col gap-y-6">
            <div className="font-semibold text-neutral-0">결제 정보</div>
            <div className="flex flex-col gap-y-5">
              <CouponSection setCoupon={setCoupon} programType={programType} />
              <hr className="bg-neutral-85" />
              <PriceSection payInfo={payInfo} coupon={coupon} />
              <hr className="bg-neutral-85" />
              <div className="flex h-10 items-center justify-between px-3 font-semibold text-neutral-0">
                <span>결제금액</span>
                <span>{totalPrice.toLocaleString()}원</span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div
        className={twMerge(
          'sticky bottom-0 -mx-5 flex gap-2 bg-white/[64%] px-5',
          isMobile && '-mb-3 rounded-t-lg py-3 shadow-05',
        )}
      >
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
            handleApplyButtonClick(isFree || totalPrice === 0);
          }}
        >
          {isFree || totalPrice === 0 ? '신청하기' : '결제하기'}
        </button>
      </div>
    </div>
  );
};

export default PayContent;
