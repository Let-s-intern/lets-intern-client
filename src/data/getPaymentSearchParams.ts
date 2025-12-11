import { z } from 'zod';
import { PayInfo } from '../domain/program/program-detail/section/ApplySection';
import { ICouponForm } from '../types/interface';

export const getPaymentSearchParams = ({
  payInfo,
  coupon,
  userInfo,
  priceId,
  totalPrice,
  programTitle,
  programType,
  progressType,
  programId,
  orderId,
  isFree,
}: {
  payInfo: PayInfo;
  coupon: ICouponForm | null;
  userInfo: {
    contactEmail: string;
    question: string;
    email?: string | null;
    phoneNumber?: string | null;
    name: string;
  };
  priceId: number;
  totalPrice: number;
  programTitle: string;
  programType: string;
  progressType: string;
  programId: number;
  orderId: string;
  isFree: boolean;
}): URLSearchParams => {
  const result = new URLSearchParams();
  result.set('priceId', priceId.toString());
  result.set('price', payInfo.price.toString());
  result.set('discount', payInfo.discount.toString());
  result.set('couponId', coupon && coupon.id ? coupon.id.toString() : '');
  result.set('couponPrice', coupon ? coupon.price.toString() : '0');
  result.set('totalPrice', totalPrice.toString());
  result.set('contactEmail', userInfo.contactEmail);
  result.set('question', userInfo.question);
  result.set('email', userInfo.email ?? '');
  result.set('phone', userInfo.phoneNumber ?? '');
  result.set('name', userInfo.name);
  result.set('programTitle', programTitle);
  result.set('programType', programType);
  result.set('progressType', progressType);
  result.set('programId', programId.toString());
  result.set('orderId', orderId);
  result.set('isFree', isFree.toString());
  return result;
};

export const paymentMethodKeySchema = z.union([
  z.literal('CARD'),
  z.literal('VIRTUAL_ACCOUNT'),
  z.literal('MOBILE_PHONE'),
  z.literal('TRANSFER'),
  z.literal('CULTURE_GIFT_CERTIFICATE'),
  z.literal('GAME_GIFT_CERTIFICATE'),
  z.literal('BOOK_GIFT_CERTIFICATE'),
  z.literal('TOSSPAY'),
  z.literal('NAVERPAY'),
  z.literal('SAMSUNGPAY'),
  z.literal('LPAY'),
  z.literal('KAKAOPAY'),
  z.literal('PAYCO'),
  z.literal('SSG'),
  z.literal('APPLEPAY'),
  z.literal('PINPAY'),
  z.literal('KBPAY'),
  z.literal('PAYPAL'),
  z.literal('GCASH'),
  z.literal('TOUCHNGO'),
  z.literal('BOOST'),
  z.literal('BPI'),
  z.literal('BILLEASE'),
  z.literal('DANA'),
  z.literal('ALIPAYHK'),
  z.literal('TRUEMONEY'),
  z.literal('RABBIT_LINE_PAY'),
  z.literal('ALIPAY'),
  z.literal('SHINHAN'),
  z.literal('HYUNDAI'),
  z.literal('SAMSUNG'),
  z.literal('WOORI'),
  z.literal('KOOKMIN'),
  z.literal('LOTTE'),
  z.literal('NONGHYEOP'),
  z.literal('HANA'),
  z.literal('BC'),
  z.literal('KDBBANK'),
  z.literal('TOSSBANK'),
  z.literal('KAKAOBANK'),
  z.literal('SUHYEOP'),
  z.literal('JEONBUKBANK'),
  z.literal('KBANK'),
  z.literal('POST'),
  z.literal('SAEMAUL'),
  z.literal('CITI'),
  z.literal('SAVINGBANK'),
  z.literal('JEJUBANK'),
  z.literal('GWANGJUBANK'),
  z.literal('SHINHYEOP'),
  z.literal('JCB'),
  z.literal('UNIONPAY'),
  z.literal('MASTER'),
  z.literal('VISA'),
  z.literal('DINERS'),
  z.literal('DISCOVER'),
  z.literal('IBK_BC'),
  z.literal('AMEX'),
  z.literal('TOSS_PAYMENTS'),
  z.literal('BANKPAY'),
  z.literal('BRANDPAY'),
  z.literal('KEYIN'),
]);

const base = {
  priceId: z.coerce.number(),
  couponId: z.union([z.literal(''), z.coerce.number()]),
  price: z.coerce.number(),
  discount: z.coerce.number(),
  couponPrice: z.coerce.number(),
  totalPrice: z.coerce.number(),
  contactEmail: z.string(),
  question: z.string(),
  email: z.string(),
  phone: z.string(),
  name: z.string(),
  programTitle: z.string(),
  programType: z.union([z.literal('challenge'), z.literal('live')]),
  progressType: z.string(),
  programId: z.coerce.number(),
  orderId: z.union([z.array(z.string()), z.string()]),
  isFree: z.string(),
};

export const paymentSearchParamsSchema = z.object(base);

export const paymentResultSearchParamsSchema = z.object({
  // ...base,
  orderId: z.string(),
  paymentKey: z.string().nullable().optional(),
  amount: z.coerce.number().nullable().optional(),
  paymentMethodKey: paymentMethodKeySchema.nullable().optional(),
});

export const paymentFailSearchParamsSchema = z.object({
  // ...base,
  orderId: z.string(),
  code: z.string(),
  message: z.string(),
});

/** 토스 라이브러리의 WidgetsPaymentMethodCode 참고 */
export type PaymentMethodKey = z.infer<typeof paymentMethodKeySchema>;

export const getPaymentMethodLabel = (
  key: PaymentMethodKey | null | undefined,
) => {
  if (!key) {
    return '0원 결제';
  }

  switch (key) {
    case 'CARD':
      return '카드';
    case 'TOSSPAY':
    case 'TOSS_PAYMENTS':
      return '토스페이';
    case 'NAVERPAY':
      return '네이버페이';
    case 'KAKAOPAY':
      return '카카오페이';
    case 'VIRTUAL_ACCOUNT':
      return '가상계좌';
    case 'MOBILE_PHONE':
      return '휴대폰';
    case 'TRANSFER':
      return '계좌이체';
    case 'CULTURE_GIFT_CERTIFICATE':
      return '문화상품권';
    case 'GAME_GIFT_CERTIFICATE':
      return '게임상품권';
    case 'BOOK_GIFT_CERTIFICATE':
      return '도서상품권';
    case 'SAMSUNGPAY':
      return '삼성페이';
    case 'LPAY':
      return 'L페이';
    case 'PAYCO':
      return '페이코';
    case 'SSG':
      return 'SSG페이';
    case 'APPLEPAY':
      return '애플페이';
    case 'PINPAY':
      return '핀페이';
    case 'KBPAY':
      return 'KB페이';
    case 'PAYPAL':
      return '페이팔';
    case 'GCASH':
      return 'G캐시';
    case 'TOUCHNGO':
      return '터치앤고';
    case 'BOOST':
      return '부스트';
    case 'BPI':
      return 'BPI';
    case 'BILLEASE':
      return '빌리즈';
    case 'DANA':
      return '다나페이';
    case 'ALIPAYHK':
      return '알리페이HK';
    case 'TRUEMONEY':
      return '트루머니';
    case 'RABBIT_LINE_PAY':
      return '라인페이';
    case 'ALIPAY':
      return '알리페이';
    case 'SHINHAN':
      return '신한카드';
    case 'HYUNDAI':
      return '현대카드';
    case 'SAMSUNG':
      return '삼성카드';
    case 'WOORI':
      return '우리카드';
    case 'KOOKMIN':
      return '국민카드';
    case 'LOTTE':
      return '롯데카드';
    case 'NONGHYEOP':
      return '농협카드';
    case 'HANA':
      return '하나카드';
    case 'BC':
      return 'BC카드';
    case 'KDBBANK':
      return 'KDB은행';
    case 'TOSSBANK':
      return '토스뱅크';
    case 'KAKAOBANK':
      return '카카오뱅크';
    case 'SUHYEOP':
      return '수협은행';
    case 'JEONBUKBANK':
      return '전북은행';
    case 'KBANK':
      return '케이뱅크';
    case 'POST':
      return '우체국';
    case 'SAEMAUL':
      return '새마을금고';
    case 'CITI':
      return '씨티은행';
    case 'SAVINGBANK':
      return '저축은행';
    case 'JEJUBANK':
      return '제주은행';
    case 'GWANGJUBANK':
      return '광주은행';
    case 'SHINHYEOP':
      return '신협';
    case 'JCB':
      return 'JCB';
    case 'UNIONPAY':
      return 'UNIONPAY';
    case 'MASTER':
      return 'MASTER';
    case 'VISA':
      return 'VISA';
    case 'DINERS':
      return 'DINERS';
    case 'DISCOVER':
      return 'DISCOVER';
    case 'IBK_BC':
      return 'IBK BC';
    case 'AMEX':
      return 'AMEX';
    case 'BANKPAY':
      return '은행';
    case 'BRANDPAY':
      return '브랜드페이';
    case 'KEYIN':
      return 'KEYIN';
  }
};
