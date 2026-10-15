import type { PostApplicationInterface } from '@/api/application';
import type { paymentResultSearchParamsSchema } from '@/data/getPaymentSearchParams';
import type useProgramStore from '@/store/useProgramStore';

type ProgramApplicationData = ReturnType<
  typeof useProgramStore.getState
>['data'];

type PaymentResultParams = ReturnType<
  typeof paymentResultSearchParamsSchema.parse
>;

/** POST /application/{programId} 본문. challengeVersionId 는 LC-3247 에서 추가된 nullable 필드다 */
export type PostApplicationBody = PostApplicationInterface & {
  challengeVersionId: number | null;
};

/** 결제 결과 페이지가 신청을 만들 때 보내는 본문 */
export const buildPostApplicationBody = (
  data: ProgramApplicationData,
  params: PaymentResultParams,
): PostApplicationBody => ({
  paymentInfo: {
    couponId: data.couponId ? Number(data.couponId) : null,
    priceId: data.priceId ?? -1,
    paymentKey:
      data.isFree === true || !params.paymentKey ? null : params.paymentKey,
    orderId: params.orderId,
    amount:
      data.isFree === true || !params.amount
        ? (data.totalPrice?.toString() ?? '0')
        : (params.amount?.toString() ?? '0'),
  },
  contactEmail: data.contactEmail ?? '',
  motivate: '',
  question: data.question ?? '',
  // 버전을 묻지 않은 신청은 신청 입력이 null 로 저장한다. 배포 전에 저장된 폼에는 키가 없다
  challengeVersionId: data.challengeVersionId ?? null,
});
