'use client';

import { ReactNode, useState } from 'react';

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
        aria-label={checked ? '체크 해제' : '체크'}
      >
        <img
          src={
            checked
              ? '/icons/checkbox-checked.svg'
              : '/icons/checkbox-unchecked-box3.svg'
          }
          alt={checked ? '체크' : '체크 안 함'}
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
