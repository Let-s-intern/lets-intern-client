import dayjs from '@/lib/dayjs';
import type { AccessorKeyColumnDef } from '@tanstack/react-table';
import type { LeadHistoryRow } from '../types';
import { groupRowsByPhonePreservingOrder } from './rowUtils';

const escapeCsvValue = (value: unknown) => {
  if (value === null || value === undefined) return '';
  const stringValue = typeof value === 'string' ? value : String(value);
  if (!/[",\n]/.test(stringValue)) return stringValue;
  return `"${stringValue.replace(/"/g, '""')}"`;
};

const resolveHeaderLabel = (
  column: AccessorKeyColumnDef<LeadHistoryRow>,
) => {
  const headerProp = column.header;
  if (typeof headerProp === 'string' || typeof headerProp === 'number') {
    return String(headerProp);
  }
  if (typeof headerProp === 'function') {
    return column.id ?? column.accessorKey ?? '';
  }
  return column.id ?? column.accessorKey ?? '';
};

export const downloadLeadHistoryCsv = (
  columns: AccessorKeyColumnDef<LeadHistoryRow>[],
  filteredRows: LeadHistoryRow[],
) => {
  if (!filteredRows.length) {
    window.alert('다운로드할 리드 히스토리가 없습니다.');
    return;
  }

  const headerRow = columns
    .map((column) => escapeCsvValue(resolveHeaderLabel(column)))
    .join(',');

  const groupedRowsForCsv = groupRowsByPhonePreservingOrder(filteredRows);

  const formattedRows = groupedRowsForCsv.map((row) => {
    return columns.map((column) => {
      const key = column.accessorKey as keyof LeadHistoryRow;
      switch (key) {
        case 'createDate':
          return row.createDate
            ? dayjs(row.createDate).format('YYYY.MM.DD.')
            : '';
        case 'finalPrice':
          return row.finalPrice !== null && row.finalPrice !== undefined
            ? new Intl.NumberFormat('ko-KR').format(row.finalPrice)
            : '';
        default:
          return row[key] ?? '';
      }
    });
  });

  const rows = formattedRows.map((row) =>
    row.map((value) => escapeCsvValue(value)).join(','),
  );

  const csvBody = [headerRow, ...rows].join('\n');
  const blob = new Blob([`\uFEFF${csvBody}`], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute(
    'download',
    `lead-management_${dayjs().format('YYYYMMDD_HHmmss')}.csv`,
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
