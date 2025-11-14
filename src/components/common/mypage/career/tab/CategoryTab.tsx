'use client';

import clsx from 'clsx';

interface CategoryTabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const CategoryTab = ({ label, isActive, onClick }: CategoryTabProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'py-3 text-sm font-semibold transition-colors md:text-base',
        {
          'border-b-2 border-neutral-10 text-neutral-10': isActive,
          'border-b-2 border-transparent text-[#666666] hover:text-[#333333]':
            !isActive,
        },
      )}
    >
      {label}
    </button>
  );
};

export default CategoryTab;
