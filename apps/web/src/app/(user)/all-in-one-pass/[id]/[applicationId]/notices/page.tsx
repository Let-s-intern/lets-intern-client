'use client';

import { useGetMyMembershipApplication } from '@/domain/all-in-one-pass/api/dashboard';
import { isPassLocked } from '@/domain/all-in-one-pass/passLock';
import LockedTab from '@/domain/all-in-one-pass/ui/LockedTab';
import NoticesView from '@/domain/all-in-one-pass/ui/notices/NoticesView';
import { useParams } from 'next/navigation';

export default function AllInOnePassNoticesPage() {
  const params = useParams<{ applicationId: string }>();
  const applicationId = Number(params.applicationId);
  const { data: base } = useGetMyMembershipApplication(applicationId);
  const locked = isPassLocked(base?.startDate, base?.endDate);

  return (
    <main className="flex flex-col gap-2 px-5 pb-16 pt-8 md:gap-10 md:pb-0 md:pl-12 md:pr-0 md:pt-0">
      <header>
        <h1 className="text-neutral-0 text-medium22 font-semibold">
          공지사항 / 패스 가이드
        </h1>
      </header>
      {locked ? <LockedTab /> : <NoticesView applicationId={applicationId} />}
    </main>
  );
}
