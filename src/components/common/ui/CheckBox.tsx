interface CheckBoxProps {
  checked: boolean;
  onClick?: () => void;
  width?: string;
  disabled?: boolean;
}

const CheckBox = ({
  checked,
  onClick,
  width = 'w-8',
  disabled = false,
}: CheckBoxProps) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <div
      className={`flex flex-shrink-0 items-center ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
      onClick={handleClick}
    >
      {checked ? (
        <img
          src="/icons/checkbox-fill.svg"
          alt="체크됨"
          className={`${width} flex-shrink-0`}
        />
      ) : (
        <img
          src="/icons/checkbox-unchecked-box.svg"
          alt="체크되지 않음"
          className={width}
        />
      )}
    </div>
  );
};

export default CheckBox;
