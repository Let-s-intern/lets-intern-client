'use client';

import { twMerge } from '@/lib/twMerge';

interface Tab {
  label: string;
  value: string;
}

interface LibraryTabNavProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (value: string) => void;
}

export default function LibraryTabNav({
  tabs,
  activeTab,
  onTabChange,
}: LibraryTabNavProps) {
  return (
    <div className="flex gap-5">
      {tabs.map((tab) => {
        const isActive = tab.value === activeTab;
        return (
          <button
            key={tab.value}
            type="button"
            className={twMerge(
              'border-b-[1.6px] pb-3 font-semibold md:text-small20',
              isActive
                ? 'border-neutral-10 text-neutral-10'
                : 'border-transparent text-neutral-45',
            )}
            onClick={() => onTabChange(tab.value)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
