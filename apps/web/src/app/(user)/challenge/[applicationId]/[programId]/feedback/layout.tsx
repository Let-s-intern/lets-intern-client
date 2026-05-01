'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';

import CategoryTabs from '@/common/ui/CategoryTabs';

type TabValue = 'written' | 'live';

const TABS: { value: TabValue; label: string }[] = [
  { value: 'written', label: '서면 피드백' },
  { value: 'live', label: '라이브 피드백' },
];

const FeedbackLayout = ({ children }: { children: React.ReactNode }) => {
  const params = useParams<{ applicationId: string; programId: string }>();
  const pathname = usePathname();
  const router = useRouter();

  const base = `/challenge/${params.applicationId}/${params.programId}/feedback`;
  const selected: TabValue = pathname.endsWith('/live') ? 'live' : 'written';

  const handleChange = (value: TabValue) => {
    router.push(`${base}/${value}`);
  };

  return (
    <main className="px-5 md:px-0 md:pl-12">
      <div className="-mx-5 md:hidden">
        <CategoryTabs
          className="pt-[14px]"
          options={TABS}
          selected={selected}
          onChange={handleChange}
          size="small"
        />
      </div>
      <div className="hidden md:block">
        <CategoryTabs
          options={TABS}
          selected={selected}
          onChange={handleChange}
          size="small"
          full
        />
      </div>
      <div className="pt-8 md:pt-6">{children}</div>
    </main>
  );
};

export default FeedbackLayout;
