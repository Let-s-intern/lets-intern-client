import type { CreateOneTimeFormApplicationRequest } from '@/api/one-time-form/oneTimeFormSchema';
import type { OneTimeFormDraft } from '../../utils/applicationDraft';
import type { OneTimeFormUtm } from '../../utils/utmStorage';

/** U3 `payment`. 0원이면 paymentKey 가 null 이고 amount 가 0 이다(계약 7절) */
export interface OneTimeFormPaymentInfo {
  paymentKey: string | null;
  orderId: string;
  amount: number;
}

const NO_UTM: OneTimeFormUtm = {
  utmSource: null,
  utmMedium: null,
  utmCampaign: null,
  utmContent: null,
  utmTerm: null,
  referrer: null,
};

/**
 * 유료 폼 U3 요청. 보관한 입력값, 보관한 UTM(없으면 모두 null), 결제 정보를 합친다.
 * 0원 신청(결제 단계)과 토스 성공 리다이렉트(결과 처리)가 같이 쓴다.
 */
export const buildCreateApplicationRequest = (
  draft: OneTimeFormDraft,
  utm: OneTimeFormUtm | null,
  payment: OneTimeFormPaymentInfo,
): CreateOneTimeFormApplicationRequest => {
  const { utmSource, utmMedium, utmCampaign, utmContent, utmTerm, referrer } =
    utm ?? NO_UTM;
  return {
    name: draft.name,
    email: draft.email,
    phoneNum: draft.phoneNum,
    selectedOptionIds: draft.selectedOptionIds,
    answers: draft.answers,
    utmSource,
    utmMedium,
    utmCampaign,
    utmContent,
    utmTerm,
    referrer,
    payment,
  };
};
