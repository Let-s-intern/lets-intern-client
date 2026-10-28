import type { OneTimeFormOptionSelectType } from '@/api/one-time-form/oneTimeFormSchema';

/** 계약 5.4 의 어드민 표시 이름 */
export const OPTION_SELECT_TYPE_LABELS: Record<
  OneTimeFormOptionSelectType,
  string
> = {
  SINGLE: '하나만',
  MULTIPLE: '여러 개',
};

/** 계약 5.6 옵션 그룹·옵션 길이 제한 */
export const OPTION_LIMITS = {
  groupTitle: 100,
  groupDescription: 300,
  name: 100,
  description: 200,
  badge: 20,
} as const;
