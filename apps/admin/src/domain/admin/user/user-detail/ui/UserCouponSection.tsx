import { useUserCouponsQuery } from '@/api/coupon/userCoupons';
import {
  formatCouponDiscount,
  formatCouponKind,
  formatCouponPeriod,
  formatCouponPrograms,
  formatCouponUsage,
  resolveCouponState,
} from '../utils/couponLabel';

/**
 * 유저의 보유 쿠폰. 쿠폰 탭을 열 때만 렌더되므로 그때서야 조회한다. 보기만 하고 쓰기 동작은 없다.
 * 소진·기간 상태는 색이 아니라 글자로 적는다.
 */
const UserCouponSection = ({ userId }: { userId: number }) => {
  const { data, isLoading, isError } = useUserCouponsQuery(userId);

  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>쿠폰을 불러오지 못했습니다.</div>;
  if (!data || data.length === 0) return <div>보유한 쿠폰이 없습니다.</div>;

  return (
    <ul className="flex flex-col gap-y-3">
      {data.map((coupon) => (
        <li
          key={coupon.couponId}
          className="rounded-xs border border-[#E4E4E7] p-4"
        >
          <div className="flex items-start justify-between gap-x-4">
            <h3 className="font-semibold">{coupon.name}</h3>
            <span className="shrink-0 rounded-xs border border-neutral-300 px-2 py-0.5 text-sm">
              {resolveCouponState(coupon)}
            </span>
          </div>
          <dl className="mt-3 grid grid-cols-[8rem_1fr] gap-y-1 text-sm">
            <dt className="text-neutral-500">할인</dt>
            <dd>{formatCouponDiscount(coupon)}</dd>

            <dt className="text-neutral-500">사용 가능 프로그램</dt>
            <dd>{formatCouponPrograms(coupon.couponProgramTypeList)}</dd>

            <dt className="text-neutral-500">유효기간</dt>
            <dd>{formatCouponPeriod(coupon)}</dd>

            <dt className="text-neutral-500">사용 횟수</dt>
            <dd>{formatCouponUsage(coupon)}</dd>

            <dt className="text-neutral-500">구분</dt>
            <dd>{formatCouponKind(coupon)}</dd>
          </dl>
        </li>
      ))}
    </ul>
  );
};

export default UserCouponSection;
