const PeriodCell = ({ row }: { row: any }) => {
  const start = new Date(row.startDate);
  const end = new Date(row.endDate);

  const format = (date: Date) =>
    `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`;

  return (
    <span>
      {format(start)} - {format(end)}
    </span>
  );
};

export default PeriodCell;
