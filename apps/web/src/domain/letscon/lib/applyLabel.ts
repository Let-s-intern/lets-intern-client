import type { LetsconApplyStatus } from './applyStatus';

export const getApplyButtonLabel = (
  status: LetsconApplyStatus,
  label: string,
): string => {
  if (status === 'applied') return '신청 완료';
  if (status === 'closed') return '신청 마감';
  if (status === 'unavailable') return '신청 준비 중';
  return label;
};
