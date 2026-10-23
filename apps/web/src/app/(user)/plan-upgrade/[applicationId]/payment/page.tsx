import PlanUpgradePaymentContent from '@/domain/challenge/plan-upgrade/PlanUpgradePaymentContent';

const Page = async ({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) => {
  const { applicationId } = await params;
  return <PlanUpgradePaymentContent applicationId={applicationId} />;
};

export default Page;
