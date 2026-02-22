'use client';

import LibraryListContent from '@/domain/library/LibraryListContent';
import LibraryBanner from '@/domain/library/ui/LibraryBanner';

export default function LibraryListPage() {
  return (
    <div className="flex flex-col items-center">
      <LibraryBanner />

      <main className="mx-auto mb-12 w-full max-w-[1100px] px-5 pt-11 md:mb-20 md:px-0">
        <LibraryListContent />
      </main>
    </div>
  );
}
