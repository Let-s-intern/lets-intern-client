const YearCell = ({ row }: { row: any }) => {
  const end = new Date(row.endDate);

  return (
    <span className="rounded-xxs bg-neutral-90 px-2 py-1 text-xs font-normal">
      {end.getFullYear()}
    </span>
  );
};

export default YearCell;
