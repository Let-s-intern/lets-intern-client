import { z } from 'zod';

export const programInfoType = z.object({
  paymentId: z.number().nullable().optional(),
  title: z.string().nullable().optional(),
  thumbnail: z.string().nullable().optional(),
  price: z.number().nullable().optional(),
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
  cashReceipts: cashReceiptsInfoType.nullable().optional(),
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

// export type PaymentStatus = 'DONE' | 'CANCELED' | 'PARTIAL_CANCELED';

export const convertPaymentStatus = (status: string) => {
  switch (status) {
    case 'DONE':
      return '결제완료';
    case 'CANCELED':
      return '결제취소';
    case 'PARTIAL_CANCELED':
      return '부분취소';
    default:
      return '상태없음';
  }
};

export const paymentDetailType = z.object({
  programInfo: z.object({
    id: z.number().nullable().optional(),
    title: z.string().nullable().optional(),
    thumbnail: z.string().nullable().optional(),
    programType: z.enum(['CHALLENGE', 'LIVE', 'VOD']).nullable().optional(),
    startDate: z.string().nullable().optional(),
    endDate: z.string().nullable().optional(),
    applicationId: z.number().nullable().optional(),
  }),
  priceInfo: z.object({
    id: z.number().nullable().optional(),
    price: z.number().nullable().optional(),
    discount: z.number().nullable().optional(),
  }),
  paymentInfo: z.object({
    id: z.number().nullable().optional(),
    finalPrice: z.number().nullable().optional(),
    couponDiscount: z.number().nullable().optional(),
  }),
  tossInfo: tossInfoType,
});

export type PaymentDetailType = z.infer<typeof paymentDetailType>;
