interface CheckBoxProps {
  checked: boolean;
  onClick?: () => void;
  width?: string;
  disabled?: boolean;
  /** 비체크 상태에서도 체크 아이콘을 회색으로 표시 */
  showCheckIcon?: boolean;
}

const CheckBox = ({
  checked,
  onClick,
  width = 'w-8',
  disabled = false,
  showCheckIcon = false,
}: CheckBoxProps) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  const getUncheckedIcon = () => {
    return showCheckIcon
      ? '/icons/Checkbox_Empty.svg'
      : '/icons/checkbox-unchecked-box2.svg';
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
        <img src={getUncheckedIcon()} alt="체크되지 않음" className={width} />
      )}
    </div>
  );
};

export default CheckBox;
