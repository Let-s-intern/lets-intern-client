import {
  fetchLatestPassId,
  withQuery,
} from '@/domain/all-in-one-pass/api/openPassPath';
import AllInOnePassLanding from '@/domain/all-in-one-pass/landing/AllInOnePassLanding';
import { redirect } from 'next/navigation';

// [LC-3624] 지난 패스 랜딩으로 들어오면 가장 최근 패스로 보낸다. 쿼리(utm 등)는 그대로 넘긴다.
// 하위 경로(결제·대시보드)는 이 페이지를 거치지 않으니, 이미 산 사람의 이용 화면은 영향 없다.
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ id }, query, latestId] = await Promise.all([
    params,
    searchParams,
    fetchLatestPassId(),
  ]);

  if (latestId !== null && latestId !== Number(id)) {
    redirect(withQuery(`/all-in-one-pass/${latestId}`, query));
  }

  return <AllInOnePassLanding />;
}
