import React from 'react';

interface FilterCheckboxProps {
  caption: string;
  isChecked: boolean;
  index: number;
  setIsChecked: React.Dispatch<React.SetStateAction<boolean[]>>;
}

const FilterCheckbox = ({
  caption,
  isChecked,
  index,
  setIsChecked,
}: FilterCheckboxProps) => {
  const handleCheckbox = () => {
    if (isChecked)
      setIsChecked((prev) => {
        const _prev = [...prev];
        _prev[index] = false;
        return _prev;
      });
    else {
      setIsChecked((prev) => {
        const i = prev.findIndex((ele) => ele === true);
        const _prev = [...prev];
        if (i !== -1) _prev[i] = false;
        _prev[index] = true;
        return _prev;
      });
    }
  };

  return (
    <div
      onClick={handleCheckbox}
      className="flex items-center gap-2 px-2 py-2.5"
    >
      <img
        className="w-8"
        src={`/icons/${
          isChecked ? 'checkbox-fill.svg' : 'checkbox-unchecked.svg'
        }`}
        alt="체크박스"
      />
      <span className="text-1 text-neutral-0/75">{caption}</span>
    </div>
  );
};

export default React.memo(FilterCheckbox);
