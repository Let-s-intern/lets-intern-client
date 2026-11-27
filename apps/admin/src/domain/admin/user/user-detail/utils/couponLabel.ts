import dayjs from '@/lib/dayjs';
import type { UserCoupon } from '@/api/coupon/userCoupons';
import type { Dayjs } from 'dayjs';

const PROGRAM_TYPE_LABELS: Record<string, string> = {
  ALL: '전체',
  CHALLENGE: '챌린지',
  LIVE: 'LIVE',
  VOD: 'VOD',
  REPORT: '서류진단',
  GUIDEBOOK: '가이드북',
  LIVE_MENTORING: '1:1 멘토링',
  MEMBERSHIP: '멤버십',
};

export const formatCouponPrograms = (list?: string[] | null) =>
  list && list.length > 0
    ? list.map((type) => PROGRAM_TYPE_LABELS[type] ?? type).join(', ')
    : '-';

/** 정액 -1 은 전액 무료다. 정률 100% 와 별개라 둘 다 100% 할인으로 읽히게 적는다. */
export const formatCouponDiscount = (coupon: UserCoupon) => {
  if (coupon.discount == null) return '-';
  if (coupon.discount === -1) return '100% 할인 (전액 무료)';
  return coupon.discountType === 'RATE'
    ? `${coupon.discount}% 할인`
    : `${coupon.discount.toLocaleString()}원 할인`;
};

export const formatCouponPeriod = (coupon: UserCoupon) => {
  const format = (value?: string | null) =>
    value ? dayjs(value).format('YYYY-MM-DD') : '';
  if (!coupon.startDate && !coupon.endDate) return '기간 제한 없음';
  return `${format(coupon.startDate)} ~ ${format(coupon.endDate)}`;
};

export const isCouponExhausted = (coupon: UserCoupon) =>
  coupon.exhausted ??
  (coupon.time != null && coupon.time >= 0 && coupon.remainTime === 0);

export const formatCouponUsage = (coupon: UserCoupon) => {
  if (coupon.time == null) return '-';
  if (coupon.time < 0) return '무제한';
  const used =
    coupon.remainTime == null
      ? null
      : Math.max(coupon.time - coupon.remainTime, 0);
  return used == null
    ? `한도 ${coupon.time}회`
    : `${used}회 사용 / 한도 ${coupon.time}회`;
};

/** 상태는 색이 아니라 글자로 적는다. 소진이 기간보다 먼저다. */
export const resolveCouponState = (
  coupon: UserCoupon,
  now: Dayjs = dayjs(),
) => {
  if (isCouponExhausted(coupon)) return '소진';
  if (coupon.endDate && now.isAfter(dayjs(coupon.endDate))) return '기간 만료';
  if (coupon.startDate && now.isBefore(dayjs(coupon.startDate)))
    return '사용 전';
  return '사용 가능';
};

export const formatCouponKind = (coupon: UserCoupon) =>
  coupon.registered == null ? '-' : coupon.registered ? '등록형' : '발급형';
