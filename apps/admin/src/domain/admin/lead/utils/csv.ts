import dayjs from '@/lib/dayjs';
import type { AccessorKeyColumnDef } from '@tanstack/react-table';
import type { AggregatedLeadRow } from '../types';

const escapeCsvValue = (value: unknown) => {
  if (value === null || value === undefined) return '';
  const stringValue = typeof value === 'string' ? value : String(value);
  if (!/[",\n]/.test(stringValue)) return stringValue;
  return `"${stringValue.replace(/"/g, '""')}"`;
};

const resolveHeaderLabel = (
  column: AccessorKeyColumnDef<AggregatedLeadRow>,
) => {
  const headerProp = column.header;
  if (typeof headerProp === 'string' || typeof headerProp === 'number') {
    return String(headerProp);
  }
  return column.id ?? column.accessorKey ?? '';
};

export const downloadLeadHistoryCsv = (
  columns: AccessorKeyColumnDef<AggregatedLeadRow>[],
  rows: AggregatedLeadRow[],
) => {
  if (!rows.length) {
    window.alert('다운로드할 리드 히스토리가 없습니다.');
    return;
  }

  const headerRow = columns
    .map((column) => escapeCsvValue(resolveHeaderLabel(column)))
    .join(',');

  const dataRows = rows.map((row) =>
    columns
      .map((column) => {
        const key = column.accessorKey as keyof AggregatedLeadRow;
        const value = row[key];
        if (key === 'marketingAgree') {
          if (value === true) return '동의';
          if (value === false) return '미동의';
          return '';
        }
        return escapeCsvValue(value ?? '');
      })
      .join(','),
  );

  const csvBody = [headerRow, ...dataRows].join('\n');
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

export const downloadCsv = (
  filename: string,
  headers: string[],
  dataRows: string[][],
) => {
  const headerRow = headers.map(escapeCsvValue).join(',');
  const rows = dataRows.map((row) => row.map(escapeCsvValue).join(','));
  const csvBody = [headerRow, ...rows].join('\n');
  const blob = new Blob([`\uFEFF${csvBody}`], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute(
    'download',
    `${filename}_${dayjs().format('YYYYMMDD_HHmmss')}.csv`,
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
