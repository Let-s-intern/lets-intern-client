import type { ProgramApplicationFormInfo } from '@/api/application';
import { getPayInfo } from '@/lib/order';

interface BuildApplicationFormParams {
  application: ProgramApplicationFormInfo;
  liveId: number;
  title: string | undefined;
  orderId: string;
  hasPrivilege: boolean;
}

/** LiveCTAButtons 의 onApplyClick 과 같은 값을 만든다. 가격 정보가 없으면 null 이다 */
export const buildApplicationForm = ({
  application,
  liveId,
  title,
  orderId,
  hasPrivilege,
}: BuildApplicationFormParams) => {
  const payInfo = getPayInfo(application);
  if (!payInfo) return null;

  const baseTotalPrice = Math.max(payInfo.price - payInfo.discount, 0);
  const totalPrice = hasPrivilege ? 0 : baseTotalPrice;

  return {
    priceId: payInfo.priceId,
    price: payInfo.price,
    discount: payInfo.discount,
    couponId: '',
    couponPrice: 0,
    totalPrice,
    membershipDiscount: hasPrivilege ? baseTotalPrice : 0,
    contactEmail: application.contactEmail ?? '',
    question: '',
    email: application.email ?? '',
    phone: application.phoneNumber ?? '',
    name: application.name ?? '',
    programTitle: title ?? '',
    programType: 'live' as const,
    progressType: 'none',
    programId: liveId,
    programOrderId: orderId,
    isFree: payInfo.livePriceType === 'FREE' || totalPrice === 0,
  };
};
