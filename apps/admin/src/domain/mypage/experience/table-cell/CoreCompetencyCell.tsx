const CoreCompetencyCell = ({ value }: { value: string }) => {
  const valueArray = value
    ? value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
  if (valueArray.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1">
      {valueArray.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className="rounded-xxs bg-neutral-90 whitespace-nowrap px-2 py-1 text-xs font-normal"
        >
          {item}
        </span>
      ))}
    </div>
  );
};

export default CoreCompetencyCell;
