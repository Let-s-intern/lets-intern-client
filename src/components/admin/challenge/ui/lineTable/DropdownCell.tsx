interface DropdownCellProps {
  name: string;
  optionList: { id: string | number; title: string }[];
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
}

const DropdownCell = ({ name, optionList, onChange }: DropdownCellProps) => {
  return (
    <select className="w-full" name={name} onChange={onChange}>
      {optionList.map(({ id, title }) => (
        <option value={id}>{title}</option>
      ))}
    </select>
  );
};

export default DropdownCell;
