import LiveMentoringCreditDeletePage from '@/domain/live-mentoring/credit/LiveMentoringCreditDeletePage';

/** 1대1 라이브 멘토링 결제 취소·환불 라우트. */
const Page = async ({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) => {
  const { applicationId } = await params;
  return <LiveMentoringCreditDeletePage applicationId={Number(applicationId)} />;
};

export default Page;
