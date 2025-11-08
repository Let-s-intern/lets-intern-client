const YearCell = ({ row }: { row: any }) => {
  // startDate와 endDate로 연도 배열 생성
  const startYear = new Date(row.startDate).getFullYear();
  const endYear = new Date(row.endDate).getFullYear();

  const yearBadges: number[] = [];
  for (let year = startYear; year <= endYear; year++) {
    yearBadges.push(year);
  }

  // 표시할 항목과 숨겨진 항목 수 계산
  const visibleItems = yearBadges.slice(0, 3);
  const hiddenCount = Math.max(0, yearBadges.length - 3);

  return (
    <div className="flex flex-wrap items-center gap-1">
      {visibleItems.map((year: number) => (
        <span
          key={year}
          className="rounded-xxs bg-neutral-90 px-2 py-1 text-xs font-normal"
        >
          {year}
        </span>
      ))}
      <br />
      {hiddenCount > 0 && <span className="text-xs text-neutral-30">+n</span>}
    </div>
  );
};

export default YearCell;
