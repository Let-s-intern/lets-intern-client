// 지금 판매 중인 올인원 패스 랜딩 경로를 서버에서 구한다. 공개 API GET /membership/open/privilege.
//
// 종료된 멤버십 랜딩(`/membership`, `/membership-marketing`)이 이 경로로 리다이렉트한다.
// 패스 ID 를 박지 않는 이유는 다음 시즌 패스가 열려도 코드를 고치지 않기 위해서다.

// 열린 패스가 없거나 2개 이상(어느 쪽인지 모호)이면 프로그램 목록의 올인원패스 필터로 보낸다.
// 헤더(useMembershipNavEntry)와 같은 판정이다.
const FALLBACK_PATH = '/program?type=MEMBERSHIP';

export async function fetchOpenPassPath(): Promise<string> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API}/membership/open/privilege`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return FALLBACK_PATH;

    const { data } = await res.json();
    const membershipId = Number(data?.membershipId);
    if (data?.exists && data?.openCount === 1 && membershipId > 0) {
      return `/all-in-one-pass/${membershipId}`;
    }
  } catch {
    // API 장애로 페이지가 깨지면 안 된다. 목록으로라도 보낸다.
  }
  return FALLBACK_PATH;
}

type SearchParams = Record<string, string | string[] | undefined>;

/** 리다이렉트할 경로에 들어온 쿼리(utm 등)를 그대로 붙인다. 유입 추적이 끊기지 않게. */
export function withQuery(path: string, params: SearchParams): string {
  const [pathname, existing] = path.split('?');
  const query = new URLSearchParams(existing);
  for (const [key, value] of Object.entries(params)) {
    for (const v of [value].flat()) if (v !== undefined) query.append(key, v);
  }
  const qs = query.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}
