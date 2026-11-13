import {
  fetchOpenPassPath,
  withQuery,
} from '@/domain/all-in-one-pass/api/openPassPath';
import { redirect } from 'next/navigation';

// [LC-3294] 하반기 공채 멤버십(구버전) 랜딩 — 모집이 끝났다.
//
// 광고·메일·커뮤니티에 뿌려진 `/membership` 링크로 하루 몇 명씩 계속 들어와서, 지금 판매
// 중인 올인원 패스로 보낸다. 쿼리(utm 등)는 그대로 넘긴다.
//
// 기존 랜딩(`@/domain/membership-legacy`)은 지우지 않았다. 되살리려면 이 파일을 git 이력의
// 이전 버전으로 되돌린다.
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [path, params] = await Promise.all([fetchOpenPassPath(), searchParams]);
  redirect(withQuery(path, params));
}
