'use client';

import { twMerge } from '@/lib/twMerge';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

interface Tab {
  label: string;
  href: string;
}

interface LibraryTabNavProps {
  tabs: Tab[];
}

export default function LibraryTabNav({ tabs }: LibraryTabNavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const qs = searchParams.toString();

  return (
    <div className="flex gap-5">
      {tabs.map((tab) => {
        const isActive = tab.href === pathname;
        const fullHref = qs ? `${tab.href}?${qs}` : tab.href;
        return (
          <Link
            key={tab.href}
            href={fullHref}
            className={twMerge(
              'md:text-small20 border-b-[1.6px] pb-3 font-semibold',
              isActive
                ? 'border-neutral-10 text-neutral-10'
                : 'text-neutral-45 border-transparent',
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
