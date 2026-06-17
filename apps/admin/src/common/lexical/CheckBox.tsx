import { ReactNode, useState } from 'react';

const CHECKED_ICON_PATH = '/icons/checkbox-checked.svg';
const UNCHECKED_ICON_PATH = '/icons/checkbox-unchecked-box3.svg';

interface CheckBoxProps {
  initialChecked: boolean;
  children: ReactNode;
}

const CheckBox = ({ initialChecked, children }: CheckBoxProps) => {
  const [checked, setChecked] = useState(initialChecked);

  return (
    <li className="ml-0 flex list-none items-start gap-2">
      <button
        type="button"
        onClick={() => setChecked((prev) => !prev)}
        role="checkbox"
        className="mt-[2px] h-5 w-5 shrink-0"
        aria-checked={checked}
        aria-label="체크"
      >
        <img
          src={checked ? CHECKED_ICON_PATH : UNCHECKED_ICON_PATH}
          alt=""
          className="h-5 w-5"
        />
      </button>
      <span className={checked ? 'text-neutral-40 line-through' : undefined}>
        {children}
      </span>
    </li>
  );
};

export default CheckBox;
