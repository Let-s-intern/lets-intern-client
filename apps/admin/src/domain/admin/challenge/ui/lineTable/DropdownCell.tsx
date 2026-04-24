interface DropdownCellProps {
  name: string;
  selected?: string | number;
  optionList: { id: string | number; title: string }[];
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
}

const DropdownCell = ({
  name,
  optionList,
  selected,
  onChange,
}: DropdownCellProps) => {
  return (
    <select className="w-full" name={name} onChange={onChange}>
      {optionList.map(({ id, title }) => (
        <option
          key={id}
          selected={selected === id || selected === title ? true : false}
          value={id}
        >
          {title}
        </option>
      ))}
    </select>
  );
};

export default DropdownCell;
