import LibraryBanner from '@/domain/library/ui/LibraryBanner';
import { ReactNode } from 'react';

export default function LibraryListLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center">
      <LibraryBanner />
      <main className="mx-auto mb-12 w-full max-w-[1100px] px-5 pt-8 md:mb-20 md:px-0 md:pt-11">
        {children}
      </main>
    </div>
  );
}
