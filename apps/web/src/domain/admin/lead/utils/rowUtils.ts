import type { LeadHistoryRow } from '../types';

const koreanNameCollator = new Intl.Collator('ko-KR', {
  sensitivity: 'base',
});

export const compareLeadHistoryRowsByName = (
  a: LeadHistoryRow,
  b: LeadHistoryRow,
) => {
  const nameA = a.name?.trim() ?? '';
  const nameB = b.name?.trim() ?? '';

  if (nameA && nameB) {
    const nameCompare = koreanNameCollator.compare(nameA, nameB);
    if (nameCompare !== 0) return nameCompare;
  } else if (nameA) {
    return -1;
  } else if (nameB) {
    return 1;
  }

  const phoneCompare = (a.displayPhoneNum ?? '').localeCompare(
    b.displayPhoneNum ?? '',
    'ko-KR',
    { numeric: true, sensitivity: 'base' },
  );
  if (phoneCompare !== 0) return phoneCompare;

  return (a.createDate ?? '').localeCompare(b.createDate ?? '');
};

