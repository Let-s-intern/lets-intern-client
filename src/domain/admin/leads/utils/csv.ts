import dayjs from '@/lib/dayjs';

export const escapeCsvValue = (value: unknown) => {
  if (value === null || value === undefined) return '';
  const stringValue = typeof value === 'string' ? value : String(value);
  if (!/[",\n]/.test(stringValue)) return stringValue;
  return `"${stringValue.replace(/"/g, '""')}"`;
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
