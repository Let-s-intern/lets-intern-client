import {
  fetchOpenPassPath,
  withQuery,
} from '@/domain/all-in-one-pass/api/openPassPath';
import { redirect } from 'next/navigation';

// [LC-3294] 마케팅 취준 올인원 패스 랜딩 — 판매가 끝났다.
//
// 이 주소로 계속 들어오는 사람을 지금 판매 중인 올인원 패스로 보낸다. 쿼리(utm 등)는
// 그대로 넘긴다.
//
// 기존 랜딩(`@/domain/membership`)은 지우지 않았다. 되살리려면 이 파일을 git 이력의
// 이전 버전으로 되돌린다.
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [path, params] = await Promise.all([fetchOpenPassPath(), searchParams]);
  redirect(withQuery(path, params));
}
