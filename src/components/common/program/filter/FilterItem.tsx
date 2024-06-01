interface FilterItemProps {
  caption: string;
}

const FilterItem = ({ caption }: FilterItemProps) => {
  return (
    <div className="flex min-w-fit items-center gap-1 rounded-md bg-primary px-4 py-2.5">
      <span className="text-0.875-medium text-static-100">{caption}</span>
      <img
        className="cursor-pointer"
        src="/icons/close-md.svg"
        alt="필터 취소 아이콘"
      />
    </div>
  );
};

export default FilterItem;
