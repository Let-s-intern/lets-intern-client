import { memo, useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';

import { twMerge } from '@/lib/twMerge';
import { Faq } from '@/schema';

function FaqDropdown({ faq }: { faq: Faq }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      key={faq.id}
      className="overflow-hidden rounded-xxs border border-neutral-80"
    >
      <div className="flex items-center justify-between bg-neutral-100 p-5">
        <span className="text-xsmall14 font-semibold text-neutral-0 md:text-medium22">
          {faq.question}
        </span>
        <IoIosArrowDown
          className={twMerge('cursor-pointer', isOpen && 'rotate-180')}
          size={24}
          color="#7A7D84"
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
      {isOpen && (
        <div className="border-t border-neutral-80 px-5 py-3 text-xxsmall12 text-neutral-35 md:text-small18">
          {faq.answer}
        </div>
      )}
    </div>
  );
}

export default memo(FaqDropdown);
