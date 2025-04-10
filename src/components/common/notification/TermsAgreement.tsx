'use client';

import { useState } from 'react';
import CheckListItem from './CheckListItem';

interface Props {
  checked?: boolean;
  title: string;
  description: string;
}

function TermsAgreement({ checked = false, title, description }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <ul className="flex items-center justify-between">
        <CheckListItem checked={checked}>{title}</CheckListItem>
        <span onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? '접기' : '자세히 보기'}
        </span>
      </ul>
      {isOpen && <p className="whitespace-pre-line">{description}</p>}
    </div>
  );
}

export default TermsAgreement;
