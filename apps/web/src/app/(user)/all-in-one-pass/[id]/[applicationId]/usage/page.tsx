'use client';

import {
  useGetMyMembershipApplication,
  useGetMyPassPlan,
} from '@/domain/all-in-one-pass/api/dashboard';
import UsageTabs from '@/domain/all-in-one-pass/ui/usage/UsageTabs';
import { useParams } from 'next/navigation';

export default function AllInOnePassUsagePage() {
  const params = useParams<{ applicationId: string }>();
  const applicationId = Number(params.applicationId);
  const { data: base } = useGetMyMembershipApplication(applicationId);
  const { data: plan } = useGetMyPassPlan(applicationId);

  return (
    <main className="flex flex-col px-5 pb-16 md:gap-10 md:pb-0 md:pl-12 md:pr-0 md:pt-0">
      <header>
        <h1 className="text-medium22 hidden font-semibold md:block">
          {base?.title ? `${base.title}로 이용 가능한 혜택` : '나의 패스 이용'}
        </h1>
      </header>
      {plan && (
        <UsageTabs
          privileges={plan.privilegeList}
          passTitle={base?.title ?? undefined}
        />
      )}
    </main>
  );
}
