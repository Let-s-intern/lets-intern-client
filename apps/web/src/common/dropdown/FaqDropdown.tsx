import { memo, useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';

import { twMerge } from '@/lib/twMerge';
import { Faq } from '@/schema';

function FaqDropdown({ faq }: { faq: Faq }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      key={faq.id}
      className="overflow-hidden rounded-sm border border-neutral-80 bg-white"
    >
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-4 bg-neutral-100 p-5 text-left transition-colors hover:bg-neutral-95"
      >
        <span className="break-keep text-xsmall14 font-semibold text-neutral-0 md:text-small20">
          {faq.question}
        </span>
        <IoIosArrowDown
          className={twMerge(
            'shrink-0 transition-transform',
            isOpen && 'rotate-180',
          )}
          size={24}
          color="#7A7D84"
        />
      </button>
      {isOpen && (
        <div className="break-keep border-t border-neutral-80 bg-neutral-95 px-5 py-4 text-xsmall14 leading-relaxed text-neutral-35 md:text-small18">
          {faq.answer}
        </div>
      )}
    </div>
  );
}

export default memo(FaqDropdown);
