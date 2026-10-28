/**
 * A2·A4 로 함께 저장되는 기본 정보와 결제 설정의 입력 상태.
 *
 * 입력칸이 다루기 쉽게 비울 수 있는 문자열은 `''` 로 두고, 저장할 때 null 로 바꾼다.
 * 일시는 `YYYY-MM-DDTHH:mm:ss` 문자열이고 비어 있으면 `''` 다.
 */
export type OneTimeFormSettingsValues = {
  // 기본 정보
  title: string;
  slug: string;
  categoryText: string;
  scheduleText: string;
  thumbnailUrl: string | null;
  isVisible: boolean;
  startDate: string;
  endDate: string;
  /** 비우면 신청 마감까지 취소할 수 있다 */
  cancelDeadline: string;
  completionMessage: string;
  // 결제 설정
  isPaid: boolean;
  basePrice: number;
  paymentProductName: string;
};

export type OneTimeFormSettingsField = keyof OneTimeFormSettingsValues;

export type OneTimeFormSettingsErrors = Partial<
  Record<OneTimeFormSettingsField, string>
>;
