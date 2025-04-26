import { ProgramTypeEnum, reportTypeSchema } from '@/schema';
import { z } from 'zod';

export const programInfoType = z.object({
  paymentId: z.number().nullable().optional(),
  applicationId: z.number().nullable().optional(),
  programType: ProgramTypeEnum.nullable().optional(),
  reportType: reportTypeSchema.nullable().optional(),
  title: z.string().nullable().optional(),
  thumbnail: z.string().nullable().optional(),
  price: z.number().nullable().optional(), // 챌린지 이용료
  paybackPrice: z.number().nullable().optional(), // 챌린지 보증금
  isCanceled: z.boolean().nullable().optional(),
  isRefunded: z.boolean().nullable().optional(),
  createDate: z.string().nullable().optional(),
  optionPrice: z.number().nullable().optional(), // 옵션 정가 총액
});

// CardInfo schema
const cardInfoType = z.object({
  amount: z.number().int().nullable().optional(),
  issuerCode: z.string().nullable().optional(),
  acquirerCode: z.string().nullable().optional(),
  number: z.string().nullable().optional(),
  installmentPlanMonths: z.number().int().nullable().optional(),
  approveNo: z.string().nullable().optional(),
  useCardPoint: z.boolean().nullable().optional(),
  cardType: z.string().nullable().optional(),
  ownerType: z.string().nullable().optional(),
  acquireStatus: z.string().nullable().optional(),
  isInterestFree: z.boolean().nullable().optional(),
  interestPayer: z.string().nullable().optional(),
});

// VirtualAccountInfo schema
const virtualAccountInfoType = z.object({
  accountType: z.string().nullable().optional(),
  accountNumber: z.string().nullable().optional(),
  bankCode: z.string().nullable().optional(),
  customerName: z.string().nullable().optional(),
  dueDate: z.string().nullable().optional(),
  refundStatus: z.string().nullable().optional(),
  expired: z.boolean().nullable().optional(),
  settlementStatus: z.string().nullable().optional(),
  refundReceiveAccount: z.string().nullable().optional(),
});

// TransferInfo schema
const transferInfoType = z.object({
  bankCode: z.string().nullable().optional(),
  settlementStatus: z.string().nullable().optional(),
});

// MobilePhoneInfo schema
const mobilePhoneInfoType = z.object({
  customerMobilePhone: z.string().nullable().optional(),
  settlementStatus: z.string().nullable().optional(),
  receiptUrl: z.string().nullable().optional(),
});

// GiftCertificateInfo schema
const giftCertificateInfoType = z.object({
  approveNo: z.string().nullable().optional(),
  settlementStatus: z.string().nullable().optional(),
});

// CashReceiptInfo schema
const cashReceiptInfoType = z.object({
  type: z.string().nullable().optional(),
  receiptKey: z.string().nullable().optional(),
  issueNumber: z.string().nullable().optional(),
  receiptUrl: z.string().nullable().optional(),
  amount: z.number().int().nullable().optional(),
  taxFreeAmount: z.number().int().nullable().optional(),
});

const failureInfoType = z.object({
  code: z.string(),
  message: z.string(),
});

// CashReceiptsInfo schema
const cashReceiptsInfoType = z.object({
  receiptKey: z.string().nullable().optional(),
  orderId: z.string().nullable().optional(),
  orderName: z.string().nullable().optional(),
  type: z.string().nullable().optional(),
  issueNumber: z.string().nullable().optional(),
  receiptUrl: z.string().nullable().optional(),
  businessNumber: z.string().nullable().optional(),
  transactionType: z.string().nullable().optional(),
  amount: z.number().int().nullable().optional(),
  taxFreeAmount: z.number().int().nullable().optional(),
  issueStatus: z.string().nullable().optional(),
  failure: failureInfoType.nullable().optional(),
  customerIdentityNumber: z.string().nullable().optional(),
  requestedAt: z.string().nullable().optional(),
});

// DiscountInfo schema
const discountInfoType = z.object({
  amount: z.string().nullable().optional(),
});

// CancelsInfo schema
const cancelsInfoType = z.object({
  cancelAmount: z.number().int().nullable().optional(),
  cancelReason: z.string().nullable().optional(),
  taxFreeAmount: z.number().int().nullable().optional(),
  taxExemptionAmount: z.number().int().nullable().optional(),
  refundableAmount: z.number().int().nullable().optional(),
  easyPayDiscountAmount: z.number().int().nullable().optional(),
  canceledAt: z.string().nullable().optional(),
  transactionKey: z.string().nullable().optional(),
  receiptKey: z.string().nullable().optional(),
  cancelStatus: z.string().nullable().optional(),
  cancelRequestId: z.string().nullable().optional(),
});

// PayInfo schema
const payInfoType = z.object({
  provider: z.string().nullable().optional(),
  amount: z.number().int().nullable().optional(),
  discountAmount: z.string().nullable().optional(),
});

// ReceiptInfo schema
const receiptInfoType = z.object({
  url: z.string().nullable().optional(),
});

// CheckoutInfo schema
const checkoutInfoType = z.object({
  url: z.string().nullable().optional(),
});

// TossPaymentsResponseDto schema
export const tossInfoType = z.object({
  mId: z.string().nullable().optional(),
  lastTransactionKey: z.string().nullable().optional(),
  paymentKey: z.string().nullable().optional(),
  orderId: z.string().nullable().optional(),
  orderName: z.string().nullable().optional(),
  taxExemptionAmount: z.number().int().nullable().optional(),
  status: z.string().nullable().optional(),
  requestedAt: z.string().nullable().optional(),
  approvedAt: z.string().nullable().optional(),
  useEscrow: z.boolean().nullable().optional(),
  cultureExpense: z.boolean().nullable().optional(),
  card: cardInfoType.nullable().optional(),
  virtualAccount: virtualAccountInfoType.nullable().optional(),
  transfer: transferInfoType.nullable().optional(),
  mobilePhone: mobilePhoneInfoType.nullable().optional(),
  giftCertificate: giftCertificateInfoType.nullable().optional(),
  cashReceipt: cashReceiptInfoType.nullable().optional(),
  cashReceipts: cashReceiptsInfoType.array().nullable().optional(),
  discount: discountInfoType.nullable().optional(),
  cancels: z.array(cancelsInfoType).nullable().optional(),
  secret: z.string().nullable().optional(),
  type: z.string().nullable().optional(),
  easyPay: payInfoType.nullable().optional(),
  country: z.string().nullable().optional(),
  failure: failureInfoType.nullable().optional(),
  isPartialCancelable: z.boolean().nullable().optional(),
  receipt: receiptInfoType.nullable().optional(),
  checkout: checkoutInfoType.nullable().optional(),
  currency: z.string().nullable().optional(),
  totalAmount: z.number().int().nullable().optional(),
  balanceAmount: z.number().int().nullable().optional(),
  suppliedAmount: z.number().int().nullable().optional(),
  vat: z.number().int().nullable().optional(),
  taxFreeAmount: z.number().int().nullable().optional(),
  method: z.string().nullable().optional(),
  version: z.string().nullable().optional(),
});

export type ProgramInfoType = z.infer<typeof programInfoType>;
export type TossInfoType = z.infer<typeof tossInfoType>;

// Payment schema
export const paymentType = z.object({
  programInfo: programInfoType,
  tossInfo: tossInfoType.nullable().optional(),
});

export const paymentListType = z.object({
  payments: z.array(paymentType),
});

export type PaymentType = z.infer<typeof paymentType>;

export const convertPaymentStatus = (status: string) => {
  switch (status) {
    case 'REFUNDED':
      return '페이백 완료';
    case 'DONE':
      return '결제완료';
    case 'CANCELED':
      return '결제취소';
    case 'PARTIAL_CANCELED':
      return '결제취소';
    case 'ZERO':
      return '결제취소';
    default:
      return '상태없음';
  }
};

export const paymentDetailType = z.object({
  programInfo: z.object({
    id: z.number().nullable().optional(),
    title: z.string().nullable().optional(),
    thumbnail: z.string().nullable().optional(),
    programType: ProgramTypeEnum.exclude(['REPORT']).nullable().optional(),
    progressType: z.string().nullable().optional(),
    isCanceled: z.boolean().nullable().optional(),
    startDate: z.string().nullable().optional(),
    endDate: z.string().nullable().optional(),
    applicationId: z.number().nullable().optional(),
  }),
  priceInfo: z.object({
    id: z.number().nullable().optional(),
    price: z.number().nullable().optional(),
    discount: z.number().nullable().optional(), // 할인 금액
    refund: z.number().nullable().optional(), // 보증금
  }),
  paymentInfo: z.object({
    id: z.number().nullable().optional(),
    finalPrice: z.number().nullable().optional(),
    paybackPrice: z.number().nullable().optional(),
    couponDiscount: z.number().nullable().optional(),
    isRefunded: z.boolean().nullable().optional(),
    lastModifiedDate: z.string().nullable().optional(),
    createDate: z.string().nullable().optional(),
  }),
  tossInfo: tossInfoType.nullable().optional(),
});

export type PaymentDetailType = z.infer<typeof paymentDetailType>;

export const applicationResultType = z.object({
  tossInfo: tossInfoType,
});

export type ApplicationResult = z.infer<typeof applicationResultType>;

export const DiscountCardSchema = z.object({
  issuerCode: z.string(),
  discountAmount: z.number(),
  balance: z.number(),
  discountCode: z.string(),
  dueDate: z.string(),
  minimumPaymentAmount: z.number(),
  maximumPaymentAmount: z.number(),
  currency: z.string(),
});

export const InterestFreeCardSchema = z.object({
  issuerCode: z.string(),
  minimumPaymentAmount: z.number(),
  dueDate: z.string(),
  installmentFreeMonths: z.array(z.number()),
});

export const CardPromotionSchema = z.object({
  discountCards: z.array(DiscountCardSchema),
  interestFreeCards: z.array(InterestFreeCardSchema),
});

/**
 * |카드사 | 코드 | 한글 | 영문|
 * | --- | --- | --- | --- |
 * |기업 BC | 3K | 기업비씨 | IBK_BC|
 * |광주은행 | 46 | 광주 | GWANGJUBANK|
 * |롯데카드 | 71 | 롯데 | LOTTE|
 * |KDB산업은행 | 30 | 산업 | KDBBANK|
 * |BC카드 | 31 | - | BC|
 * |삼성카드 | 51 | 삼성 | SAMSUNG|
 * |새마을금고 | 38 | 새마을 | SAEMAUL|
 * |신한카드 | 41 | 신한 | SHINHAN|
 * |신협 | 62 | 신협 | SHINHYEOP|
 * |씨티카드 | 36 | 씨티 | CITI|
 * |우리BC카드(BC 매입) | 33 | 우리 | WOORI|
 * |우리카드(우리 매입) | W1 | 우리 | WOORI|
 * |우체국예금보험 | 37 | 우체국 | POST|
 * |저축은행중앙회 | 39 | 저축 | SAVINGBANK|
 * |전북은행 | 35 | 전북 | JEONBUKBANK|
 * |제주은행 | 42 | 제주 | JEJUBANK|
 * |카카오뱅크 | 15 | 카카오뱅크 | KAKAOBANK|
 * |케이뱅크 | 3A | 케이뱅크 | KBANK|
 * |토스뱅크 | 24 | 토스뱅크 | TOSSBANK|
 * |하나카드 | 21 | 하나 | HANA|
 * |현대카드 | 61 | 현대 | HYUNDAI|
 * |KB국민카드 | 11 | 국민 | KOOKMIN|
 * |NH농협카드 | 91 | 농협 | NONGHYEOP|
 * |Sh수협은행 | 34 | 수협 | SUHYEOP|
 * |페이코 | - | - | PCP|
 * |KB증권 | - | - | KBS|
 */
export const convertCodeToCardKorName: Record<string, string> = {
  '3K': '기업비씨',
  '46': '광주',
  '71': '롯데',
  '30': '산업',
  '31': 'BC',
  '51': '삼성',
  '38': '새마을',
  '41': '신한',
  '62': '신협',
  '36': '씨티',
  '33': '우리',
  W1: '우리',
  '37': '우체국',
  '39': '저축',
  '35': '전북',
  '42': '제주',
  '15': '카카오뱅크',
  '3A': '케이뱅크',
  '24': '토스뱅크',
  '21': '하나',
  '61': '현대',
  '11': '국민',
  '91': '농협',
  '34': '수협',
};
