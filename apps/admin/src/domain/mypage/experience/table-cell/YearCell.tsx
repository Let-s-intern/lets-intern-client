import { TableData } from '@/common/table/DataTable';

interface YearCellProps {
  row: TableData;
}

const YearCell = ({ row }: YearCellProps) => {
  if (!row.startDate || !row.endDate) {
    return null;
  }
  const startYear = new Date(row.startDate).getFullYear();
  const endYear = new Date(row.endDate).getFullYear();

  if (isNaN(startYear) || isNaN(endYear) || startYear > endYear) return null;

  const yearBadges = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i,
  );

  return (
    <div className="flex flex-wrap items-center gap-1">
      {yearBadges.map((year: number) => (
        <span
          key={year}
          className="rounded-xxs bg-neutral-90 px-2 py-1 text-xs font-normal"
        >
          {year}
        </span>
      ))}
    </div>
  );
};

export default YearCell;
