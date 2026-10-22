'use client';

import { useGetMyMembershipApplication } from '@/domain/all-in-one-pass/api/dashboard';
import RetrospectivesView from '@/domain/all-in-one-pass/ui/retrospectives/RetrospectivesView';
import { useParams } from 'next/navigation';

export default function AllInOnePassRetrospectivesPage() {
  const params = useParams<{ applicationId: string }>();
  const { data: base } = useGetMyMembershipApplication(
    Number(params.applicationId),
  );

  return (
    <main className="flex flex-col gap-6 px-5 py-8 md:gap-8 md:pb-0 md:pl-12 md:pr-0 md:pt-0">
      <header>
        <h1 className="text-neutral-0 hidden text-[22px] font-semibold md:block">
          취준 회고록
        </h1>
      </header>
      {base?.startDate && (
        <RetrospectivesView
          applicationId={Number(params.applicationId)}
          passStart={base.startDate}
        />
      )}
    </main>
  );
}
