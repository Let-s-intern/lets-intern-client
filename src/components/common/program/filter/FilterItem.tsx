interface FilterItemProps {
  caption: string;
  programType: string;
  handleClick: (key: string, value: string) => void;
}

const FilterItem = ({ caption, programType, handleClick }: FilterItemProps) => {
  return (
    <div className="flex min-w-fit items-center gap-1 rounded-md bg-primary px-4 py-2.5">
      <span className="text-0.875-medium text-static-100">{caption}</span>
      <img
        onClick={() => handleClick(programType, caption)}
        className="cursor-pointer"
        src="/icons/close-md.svg"
        alt="필터 취소 아이콘"
      />
    </div>
  );
};

export default FilterItem;
