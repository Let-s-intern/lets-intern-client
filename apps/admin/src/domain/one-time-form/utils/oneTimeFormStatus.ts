import dayjs from '@/lib/dayjs';
import type { Dayjs } from 'dayjs';

import type { AdminOneTimeFormListItem } from '@/api/one-time-form/oneTimeFormSchema';

export type OneTimeFormStatus = 'HIDDEN' | 'BEFORE' | 'OPEN' | 'CLOSED';

export const ONE_TIME_FORM_STATUS_LABEL: Record<OneTimeFormStatus, string> = {
  HIDDEN: '비공개',
  BEFORE: '시작 전',
  OPEN: '진행 중',
  CLOSED: '마감',
};

/**
 * 목록 상태(계약 9절 A1). 비공개가 기간보다 앞선다.
 * 기간 경계는 사용자 신청 상태(계약 5.5)와 같다: 시작·마감 시각 당일 포함.
 */
export const getOneTimeFormStatus = (
  form: Pick<AdminOneTimeFormListItem, 'isVisible' | 'startDate' | 'endDate'>,
  now: Dayjs = dayjs(),
): OneTimeFormStatus => {
  if (!form.isVisible) return 'HIDDEN';
  if (now.isBefore(dayjs(form.startDate))) return 'BEFORE';
  if (now.isAfter(dayjs(form.endDate))) return 'CLOSED';
  return 'OPEN';
};
