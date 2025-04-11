import CheckboxActive from '@/assets/icons/checkbox-active.svg?react';
import CheckboxInActive from '@/assets/icons/checkbox-inactive.svg?react';
import { memo, ReactNode } from 'react';

interface Props {
  checked: boolean;
  children?: ReactNode;
  onChange: (value: boolean) => void;
}

function CheckListItem({ checked = false, children, onChange }: Props) {
  return (
    <li
      className="flex cursor-pointer items-center gap-2"
      onClick={() => onChange && onChange(!checked)}
    >
      {checked ? (
        <CheckboxActive className="shrink-0" />
      ) : (
        <CheckboxInActive className="shrink-0" />
      )}
      <span className="text-xsmall14 font-medium text-neutral-10">
        {children}
      </span>
    </li>
  );
}

export default memo(
  CheckListItem,
  (oldProps, newProps) => oldProps.checked === newProps.checked,
);
