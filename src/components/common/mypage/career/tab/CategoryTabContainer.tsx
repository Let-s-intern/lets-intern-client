'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import CategoryTab from './CategoryTab';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface CategoryTabContainerProps {
  tabs: TabItem[];
  defaultTab?: string;
  paramKey?: string;
}

const CategoryTabContainer = ({
  tabs,
  defaultTab,
  paramKey = 'category',
}: CategoryTabContainerProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get(paramKey) || defaultTab || tabs[0]?.id;

  const activeTab = useMemo(() => {
    return tabs.find((tab) => tab.id === currentTab) || tabs[0];
  }, [tabs, currentTab]);

  const handleTabClick = (tabId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(paramKey, tabId);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex w-full flex-col">
      <div className="flex items-center gap-6 overflow-x-auto border-b border-[#E4E4E7]">
        {tabs.map((tab) => (
          <CategoryTab
            key={tab.id}
            label={tab.label}
            isActive={tab.id === currentTab}
            onClick={() => handleTabClick(tab.id)}
          />
        ))}
      </div>
      <div className="mt-6">{activeTab?.content}</div>
    </div>
  );
};

export default CategoryTabContainer;
