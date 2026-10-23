import PlanUpgradeFailContent from '@/domain/challenge/plan-upgrade/PlanUpgradeFailContent';

const Page = async ({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) => {
  const { applicationId } = await params;
  return <PlanUpgradeFailContent applicationId={applicationId} />;
};

export default Page;
