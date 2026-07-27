import { CouponItem } from '@/api/coupon/coupon';
import dayjs from '@/lib/dayjs';

interface CouponCardProps {
  coupon: CouponItem;
}

const formatDate = (dateStr: string) =>
  dayjs(dateStr).format('YYYY년 MM월 DD일');

const calcDDay = (endDate: string) =>
  dayjs(endDate).startOf('day').diff(dayjs().startOf('day'), 'day');

const CouponCard = ({ coupon }: CouponCardProps) => {
  const dDay = calcDDay(coupon.endDate);
  const showDDayBadge = dDay >= 0;
  const isUnlimited = coupon.remainTime === -1;
  const showQuantityBadge = isUnlimited || coupon.remainTime >= 2;

  return (
    <div className="rounded-xs border-neutral-85 flex flex-col gap-2 border p-4">
      {(showDDayBadge || showQuantityBadge) && (
        <div className="flex gap-1">
          {showDDayBadge && (
            <span className="bg-primary-10 text-primary text-xxsmall12 w-fit rounded-[3px] px-2 py-1 font-medium">
              D-{dDay}
            </span>
          )}
          {showQuantityBadge && (
            <span className="bg-primary-10 text-primary text-xxsmall12 w-fit rounded-[3px] px-2 py-1 font-medium">
              {isUnlimited ? '무제한' : `${coupon.remainTime}장 보유`}
            </span>
          )}
        </div>
      )}
      <div className="flex flex-col gap-0.5">
        <p className="text-small18 text-neutral-0 font-bold">
          {coupon.discount === -1
            ? '전액 할인'
            : `${coupon.discount.toLocaleString()}원`}
        </p>
        <p className="text-xsmall16 text-neutral-0 font-semibold">
          {coupon.name}
        </p>
        <div className="text-xsmall14 text-neutral-30 flex flex-col font-medium">
          <p>쿠폰코드 : {coupon.code}</p>
          <p>
            유효기간 : {formatDate(coupon.startDate)} ~{' '}
            {formatDate(coupon.endDate)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CouponCard;
