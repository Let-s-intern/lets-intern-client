'use client';

import CheckboxActive from '@/assets/icons/checkbox-active.svg?react';
import CheckboxInActive from '@/assets/icons/checkbox-inactive.svg?react';
import { memo, ReactNode, useState } from 'react';

interface Props {
  checked?: boolean;
  children?: ReactNode;
}

function CheckListItem({ checked = false, children }: Props) {
  const [selected, setSelected] = useState(checked);

  const handleClick = () => {
    setSelected(!selected);
  };

  return (
    <li className="flex items-center gap-2">
      {selected ? (
        <CheckboxActive onClick={handleClick} className="shrink-0" />
      ) : (
        <CheckboxInActive onClick={handleClick} className="shrink-0" />
      )}
      <span className="text-xsmall14 font-medium text-neutral-10">
        {children}
      </span>
    </li>
  );
}

export default memo(CheckListItem);
