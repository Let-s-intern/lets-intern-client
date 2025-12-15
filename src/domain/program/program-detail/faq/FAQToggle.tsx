import clsx from 'clsx';
import { useState } from 'react';
import { IoTriangleSharp } from 'react-icons/io5';

import { FAQType } from '../tab/tab-content/FAQTabContent';

interface FAQToggleProps {
  faq: FAQType;
}

const FAQToggle = ({ faq }: FAQToggleProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleToggleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <li>
      <div
        className="flex cursor-pointer items-center gap-4 border-b border-neutral-80 px-2 py-4"
        onClick={handleToggleClick}
      >
        <span
          className={clsx('text-[0.875rem] duration-300', {
            'rotate-90': !isOpen,
            'rotate-180': isOpen,
          })}
        >
          <IoTriangleSharp />
        </span>
        <p>{faq.question}</p>
      </div>
      {isOpen && (
        <div className="px-2 py-4">
          <p>{faq.answer}</p>
        </div>
      )}
    </li>
  );
};

export default FAQToggle;
