'use client';

import clsx from 'clsx';
import { forwardRef } from 'react';

interface CategoryTabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const CategoryTab = forwardRef<HTMLButtonElement, CategoryTabProps>(
  ({ label, isActive, onClick }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        className={clsx(
          'py-3 text-sm font-semibold transition-colors md:text-base',
          {
            'text-neutral-10': isActive,
            'text-[#666666] hover:text-[#333333]': !isActive,
          },
        )}
      >
        {label}
      </button>
    );
  },
);

CategoryTab.displayName = 'CategoryTab';

export default CategoryTab;
