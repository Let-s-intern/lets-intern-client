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
              'pb-3 text-small20 font-semibold',
              isActive
                ? 'border-b-[1.6px] border-neutral-10 text-neutral-10'
                : 'text-neutral-45',
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
