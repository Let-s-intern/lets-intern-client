import type { CouponDiscountType } from '@/api/coupon/coupon';

export function getCouponDiscountAmount({
  discount,
  discountType,
  salePrice,
}: {
  discount: number;
  discountType?: CouponDiscountType | null;
  salePrice?: number;
}): number {
  if (discountType === 'RATE' && Number.isFinite(salePrice)) {
    const base = Math.max(salePrice as number, 0);
    return Math.floor((base * discount) / 100 / 10) * 10;
  }
  return discount;
}
