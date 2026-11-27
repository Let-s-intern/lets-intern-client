import axios from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

/**
 * 어드민 유저 상세의 보유 쿠폰 한 건. 사용자용 `MyCouponVo` 에 소진 여부와 등록형·발급형 구분을 더한 모양이다.
 * 어드민용 필드(`exhausted`, `registered`)는 서버(`AdminUserCouponVo`)가 내려주는 값이다. 배포 전 응답을 위해 nullish 로 받고,
 * 소진 여부는 없으면 `time`, `remainTime` 으로 계산한다. 새 필드가 없으면 구분 칸이 비어 보일 뿐 깨지지 않는다.
 */
export const userCouponSchema = z.object({
  couponId: z.number(),
  couponType: z.string().nullish(),
  couponProgramTypeList: z.array(z.string()).nullish(),
  name: z.string(),
  code: z.string().nullish(),
  /** 정액 -1 은 전액 무료다 */
  discount: z.number().nullish(),
  /** AMOUNT(정액), RATE(정률) */
  discountType: z.string().nullish(),
  /** 사용 한도. 음수면 무제한 */
  time: z.number().nullish(),
  /** 남은 사용 횟수. 한도가 있을 때 0 이면 소진 */
  remainTime: z.number().nullish(),
  startDate: z.string().nullish(),
  endDate: z.string().nullish(),
  exhausted: z.boolean().nullish(),
  /** true 면 유저가 직접 등록한 쿠폰, false 면 결제·수강 이력으로 발급 대상이 된 쿠폰 */
  registered: z.boolean().nullish(),
});
export type UserCoupon = z.infer<typeof userCouponSchema>;

// 응답이 배열이든 `{ couponList }` 든 읽는다. 사용자용 내 쿠폰 응답이 후자 모양이다.
const userCouponsResponseSchema = z
  .union([
    z.array(userCouponSchema),
    z.object({ couponList: z.array(userCouponSchema) }),
  ])
  .transform((value) => (Array.isArray(value) ? value : value.couponList));

export const USER_COUPONS_QUERY_KEY = 'adminUserCoupons';

/** GET /api/v1/coupon/admin/user/{userId}. 쿠폰 탭을 열 때만 쓴다. 읽기 전용이다. */
export const useUserCouponsQuery = (userId: number) =>
  useQuery({
    queryKey: [USER_COUPONS_QUERY_KEY, userId],
    queryFn: async () => {
      const res = await axios.get(`/coupon/admin/user/${userId}`);
      return userCouponsResponseSchema.parse(res.data.data);
    },
  });
