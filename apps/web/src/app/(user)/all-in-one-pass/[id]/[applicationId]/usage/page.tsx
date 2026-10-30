'use client';

import {
  useGetMyMembershipApplication,
  useGetMyPassPlan,
} from '@/domain/all-in-one-pass/api/dashboard';
import { useGetMembershipApplicationForm } from '@/domain/all-in-one-pass/api/purchase';
import { isPassLocked } from '@/domain/all-in-one-pass/passLock';
import LockedTab from '@/domain/all-in-one-pass/ui/LockedTab';
import UsageTabs from '@/domain/all-in-one-pass/ui/usage/UsageTabs';
import { useParams } from 'next/navigation';

export default function AllInOnePassUsagePage() {
  const params = useParams<{ id: string; applicationId: string }>();
  const membershipId = Number(params.id);
  const applicationId = Number(params.applicationId);
  const { data: base } = useGetMyMembershipApplication(applicationId);
  const { data: plan } = useGetMyPassPlan(applicationId);
  // VOD 탭 노출 여부(판매가 켜졌으면 vodPassProduct 가 있다). 라우트의 패스 id 로 위 조회와 함께 시작한다
  const { data: applicationForm } =
    useGetMembershipApplicationForm(membershipId);
  const locked = isPassLocked(base?.startDate, base?.endDate);

  return (
    <main className="flex flex-col px-5 pb-16 md:gap-10 md:pb-0 md:pl-12 md:pr-0 md:pt-0">
      <header>
        <h1 className="text-medium22 hidden font-semibold md:block">
          {base?.title ? `${base.title}로 이용 가능한 혜택` : '나의 패스 이용'}
        </h1>
      </header>
      {locked ? (
        <LockedTab />
      ) : (
        plan && (
          <UsageTabs
            membershipId={membershipId}
            privileges={plan.privilegeList}
            passTitle={base?.title ?? undefined}
            vodOptionOnSale={applicationForm?.vodPassProduct != null}
          />
        )
      )}
    </main>
  );
}
