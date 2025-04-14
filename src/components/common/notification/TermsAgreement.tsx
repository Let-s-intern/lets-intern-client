'use client';

import { memo, ReactNode, useState } from 'react';
import CheckListItem from './CheckListItem';

interface Props {
  checked: boolean;
  title: string;
  description: ReactNode;
  onChange: (value: boolean) => void;
}

function TermsAgreement({ checked, title, description, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <ul className="flex items-center justify-between">
        <CheckListItem checked={checked} onChange={onChange}>
          {title}
        </CheckListItem>
        <span
          className="cursor-pointer text-xsmall14 text-neutral-50"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? '접기' : '자세히 보기'}
        </span>
      </ul>
      {isOpen && (
        <p className="mt-2 whitespace-pre-line rounded-xs bg-neutral-95 px-4 py-2.5 text-xsmall14 leading-relaxed text-neutral-40">
          {description}
        </p>
      )}
    </div>
  );
}

export default memo(
  TermsAgreement,
  (oldProps, newProps) => oldProps.checked === newProps.checked,
);
