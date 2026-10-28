import type { CreateOneTimeFormApplicationRequest } from '@/api/one-time-form/oneTimeFormSchema';
import type { ApplicationFormRequest } from '../hooks/useApplicationForm';
import type { OneTimeFormUtm } from './utmStorage';

/**
 * 무료 폼 U3 요청(계약 7절 무료 행). 결제는 null, 옵션은 받지 않으므로 [] 로 보낸다.
 * 보관한 UTM 이 없으면 모두 null.
 */
export const buildFreeApplicationRequest = (
  request: ApplicationFormRequest,
  utm: OneTimeFormUtm | null,
): CreateOneTimeFormApplicationRequest => ({
  name: request.name,
  email: request.email,
  phoneNum: request.phoneNum,
  selectedOptionIds: [],
  answers: request.answers,
  utmSource: utm?.utmSource ?? null,
  utmMedium: utm?.utmMedium ?? null,
  utmCampaign: utm?.utmCampaign ?? null,
  utmContent: utm?.utmContent ?? null,
  utmTerm: utm?.utmTerm ?? null,
  referrer: utm?.referrer ?? null,
  payment: null,
});
