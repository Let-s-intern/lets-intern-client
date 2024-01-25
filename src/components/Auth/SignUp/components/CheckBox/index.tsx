interface CheckBoxProps {
  checked: boolean;
  onClick: () => void;
}

const CheckBox = ({ checked, onClick }: CheckBoxProps) => {
  return (
    <div className="flex cursor-pointer items-center" onClick={onClick}>
      {checked ? (
        <img src="/icons/checkbox-checked.svg" alt="체크됨" />
      ) : (
        <img src="/icons/checkbox-unchecked.svg" alt="체크되지 않음" />
      )}
    </div>
  );
};

export default CheckBox;
