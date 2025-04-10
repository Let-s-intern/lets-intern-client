import CheckboxActive from '@/assets/icons/checkbox-active.svg?react';
import CheckboxInActive from '@/assets/icons/checkbox-inactive.svg?react';
import { memo, ReactNode } from 'react';

interface Props {
  checked?: boolean;
  children?: ReactNode;
}

function CheckListItem({ checked = false, children }: Props) {
  return (
    <li className="flex items-center gap-2">
      {checked ? (
        <CheckboxActive className="shrink-0" />
      ) : (
        <CheckboxInActive className="shrink-0" />
      )}
      <span>{children}</span>
    </li>
  );
}

export default memo(CheckListItem);
