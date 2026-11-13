import { searchHome } from '@/domain/home/search/homeSearch.server';
import {
  HOME_SEARCH_CATEGORIES,
  HOME_SEARCH_QUERY_MAX_LENGTH,
  HomeSearchCategory,
} from '@/domain/home/search/homeSearchTypes';

/** 홈 상단 검색창 AI 검색. 페이지 이동 없이 홈에서 결과를 그린다. */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const query =
    typeof body?.query === 'string'
      ? body.query.trim().slice(0, HOME_SEARCH_QUERY_MAX_LENGTH)
      : '';
  const category: HomeSearchCategory = HOME_SEARCH_CATEGORIES.some(
    (c) => c.value === body?.category,
  )
    ? body.category
    : 'ALL';

  if (!query) {
    return Response.json(
      { message: '검색어를 입력해 주세요.' },
      { status: 400 },
    );
  }

  return Response.json(await searchHome(query, category));
}
