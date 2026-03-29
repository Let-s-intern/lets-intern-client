import type { Row } from '@tanstack/react-table';
import type { ReactNode } from 'react';
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

export const groupRowsByPhonePreservingOrder = (rows: LeadHistoryRow[]) => {
  const phoneOrder: string[] = [];
  const grouped = new Map<string, LeadHistoryRow[]>();

  rows.forEach((row) => {
    const phoneKey = row.displayPhoneNum;
    if (!grouped.has(phoneKey)) {
      grouped.set(phoneKey, []);
      phoneOrder.push(phoneKey);
    }
    grouped.get(phoneKey)?.push(row);
  });

  return phoneOrder.flatMap((phone) => grouped.get(phone) ?? []);
};

export const renderGroupedLeaf = (
  row: Row<LeadHistoryRow>,
  render: (original: LeadHistoryRow) => ReactNode,
) => {
  if (row.getIsGrouped()) {
    return null;
  }
  return render(row.original);
};

export const formatNullableText = (value: unknown) => {
  if (typeof value === 'string') {
    return value.trim().length ? value : '-';
  }
  if (typeof value === 'number') {
    return String(value);
  }
  return '-';
};
