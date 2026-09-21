import PlanUpgradeResultContent from '@/domain/challenge/plan-upgrade/PlanUpgradeResultContent';

const Page = async ({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) => {
  const { applicationId } = await params;
  return <PlanUpgradeResultContent applicationId={applicationId} />;
};

export default Page;
