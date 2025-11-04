const CoreCompetencyCell = ({ value }: { value: string }) => {
  const valueArray = value ? value.split(', ') : [];
  if (!Array.isArray(valueArray) || valueArray.length === 0) return null;

  const visibleItems = valueArray.slice(0, 2);
  const hiddenCount = valueArray.length - visibleItems.length;

  return (
    <div className="flex flex-wrap items-center gap-1">
      {visibleItems.map((item) => (
        <span
          key={item}
          className="rounded-xxs bg-neutral-90 px-2 py-1 text-xs font-normal"
        >
          {item}
        </span>
      ))}
      {hiddenCount > 0 && <span className="text-xs text-neutral-30">+n</span>}
    </div>
  );
};

export default CoreCompetencyCell;
