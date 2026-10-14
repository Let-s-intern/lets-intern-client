'use client';

import NoticesView from '@/domain/all-in-one-pass/ui/notices/NoticesView';
import { useParams } from 'next/navigation';

export default function AllInOnePassNoticesPage() {
  const params = useParams<{ applicationId: string }>();

  return (
    <main className="flex flex-col gap-2 px-5 pb-16 pt-8 md:gap-10 md:pb-0 md:pl-12 md:pr-0 md:pt-0">
      <header>
        <h1 className="text-neutral-0 text-medium22 font-semibold">
          공지사항 / 패스 가이드
        </h1>
      </header>
      <NoticesView applicationId={Number(params.applicationId)} />
    </main>
  );
}
