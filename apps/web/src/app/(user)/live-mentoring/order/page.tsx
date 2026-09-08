import OrderPage from '@/domain/live-mentoring/order/OrderPage';

/**
 * 1대1 라이브 멘토링 결제 페이지 라우트.
 *
 * 기존 `/order/**` 는 `useProgramStore` 의 `programId` + `programType` 체계라
 * `openingId` + `applicationId` 로 도는 라이브 멘토링을 얹을 수 없다. 스토어를
 * 늘리면 프로그램·리포트 결제가 함께 흔들려 전용 경로를 따로 둔다.
 */
const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ mentorId?: string }>;
}) => {
  const { mentorId } = await searchParams;
  return <OrderPage mentorId={mentorId ?? null} />;
};

export default Page;
