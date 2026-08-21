import LiveMentoringCreditDetailPage from '@/domain/live-mentoring/credit/LiveMentoringCreditDetailPage';

/**
 * 1대1 라이브 멘토링 결제 상세 라우트.
 *
 * `paymentId` 가 아니라 `applicationId` 로 연다. Toss 승인 전에는 신청에 결제 id 가
 * 붙지 않아 `paymentId` 로는 열 수 없는 구간이 생긴다.
 */
const Page = async ({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) => {
  const { applicationId } = await params;
  return <LiveMentoringCreditDetailPage applicationId={Number(applicationId)} />;
};

export default Page;
