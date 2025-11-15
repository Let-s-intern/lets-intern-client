'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
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
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({
    width: 0,
    left: 0,
  });

  const activeTab = tabs.find((tab) => tab.id === currentTab) || tabs[0];

  useEffect(() => {
    const activeIndex = tabs.findIndex((tab) => tab.id === currentTab);
    const activeTabElement = tabRefs.current[activeIndex];

    if (activeTabElement) {
      const { offsetLeft, offsetWidth } = activeTabElement;
      setIndicatorStyle({
        width: offsetWidth,
        left: offsetLeft,
      });
    }
  }, [currentTab, tabs]);

  const handleTabClick = (tabId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(paramKey, tabId);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex w-full flex-col">
      <div className="relative flex items-center gap-6 overflow-x-auto border-b border-[#E4E4E7]">
        {tabs.map((tab, index) => (
          <CategoryTab
            key={tab.id}
            ref={(el: HTMLButtonElement | null) => {
              tabRefs.current[index] = el;
            }}
            label={tab.label}
            isActive={tab.id === currentTab}
            onClick={() => handleTabClick(tab.id)}
          />
        ))}
        <div
          className="absolute bottom-0 h-0.5 bg-neutral-10 transition-all duration-300 ease-in-out"
          style={{
            width: `${indicatorStyle.width}px`,
            transform: `translateX(${indicatorStyle.left}px)`,
          }}
        />
      </div>
      <div className="mt-6">{activeTab?.content}</div>
    </div>
  );
};

export default CategoryTabContainer;
