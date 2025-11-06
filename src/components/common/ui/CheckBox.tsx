interface CheckBoxProps {
  checked: boolean;
  onClick?: () => void;
  width?: string;
}

const CheckBox = ({ checked, onClick, width = 'w-8' }: CheckBoxProps) => {
  return (
    <div className="flex cursor-pointer items-center" onClick={onClick}>
      {checked ? (
        <img src="/icons/checkbox-fill.svg" alt="체크됨" className={width} />
      ) : (
        <img
          src="/icons/checkbox-unchecked.svg"
          alt="체크되지 않음"
          className={width}
        />
      )}
    </div>
  );
};

export default CheckBox;
