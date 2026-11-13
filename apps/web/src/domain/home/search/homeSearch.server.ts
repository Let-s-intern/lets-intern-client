import 'server-only';

import { getBlogPathname, getProgramPathname } from '@/utils/url';
import {
  HOME_SEARCH_MAX_RESULTS,
  HomeSearchCategory,
  HomeSearchChatMessage,
  HomeSearchItem,
  HomeSearchResponse,
} from './homeSearchTypes';

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;
const CATALOG_REVALIDATE_SECONDS = 600;
const BLOG_CATALOG_SIZE = 60;

type CatalogItem = HomeSearchItem & { searchText: string };

interface ProgramRow {
  programInfo: {
    id: number;
    programType: string;
    title?: string | null;
    shortDesc?: string | null;
    thumbnail?: string | null;
    challengeVersionId?: number | null;
  };
}

interface BlogRow {
  blogThumbnailInfo: {
    id: number;
    title?: string | null;
    description?: string | null;
    thumbnail?: string | null;
  };
}

async function fetchServerData<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${SERVER_API}${path}`, {
      next: { revalidate: CATALOG_REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    return (await res.json()).data as T;
  } catch {
    return null;
  }
}

/** 모집 중·모집 예정 프로그램과 최신 블로그를 검색 대상으로 모은다 */
async function getCatalog(): Promise<CatalogItem[]> {
  const [programData, blogData] = await Promise.all([
    fetchServerData<{ programList: ProgramRow[] }>(
      '/program?page=1&size=200&status=PREV,PROCEEDING',
    ),
    fetchServerData<{ blogInfos: BlogRow[] }>(
      `/blog?page=1&size=${BLOG_CATALOG_SIZE}`,
    ),
  ]);

  const programs: CatalogItem[] = (programData?.programList ?? []).map(
    ({ programInfo: p }) => ({
      key: `P${p.id}-${p.challengeVersionId ?? 0}`,
      kind: p.programType as HomeSearchItem['kind'],
      title: p.title ?? '',
      description: p.shortDesc ?? '',
      thumbnail: p.thumbnail ?? null,
      href: getProgramPathname({
        programType: p.programType.toLowerCase() as never,
        id: p.id,
        title: p.title,
        challengeVersionId: p.challengeVersionId,
      }),
      searchText: `${p.title ?? ''} ${p.shortDesc ?? ''}`,
    }),
  );

  const blogs: CatalogItem[] = (blogData?.blogInfos ?? []).map(
    ({ blogThumbnailInfo: b }) => ({
      key: `B${b.id}`,
      kind: 'BLOG',
      title: b.title ?? '',
      description: b.description ?? '',
      thumbnail: b.thumbnail ?? null,
      href: getBlogPathname({ id: b.id, title: b.title }),
      searchText: `${b.title ?? ''} ${b.description ?? ''}`,
    }),
  );

  return [...programs, ...blogs];
}

function filterByCategory(
  catalog: CatalogItem[],
  category: HomeSearchCategory,
) {
  if (category === 'ALL') return catalog;
  return catalog.filter((item) => item.kind === category);
}

function stripSearchText({ searchText: _, ...item }: CatalogItem) {
  return item;
}

/** API 키가 없거나 AI 호출이 실패했을 때 쓰는 단순 키워드 매칭 */
function keywordSearch(
  catalog: CatalogItem[],
  query: string,
): HomeSearchResponse {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const scored = catalog
    .map((item) => {
      const text = item.searchText.toLowerCase();
      return { item, score: words.filter((w) => text.includes(w)).length };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, HOME_SEARCH_MAX_RESULTS);

  return {
    mode: 'keyword',
    answer: null,
    items: scored.map(({ item }) => stripSearchText(item)),
    showPanel: scored.length > 0,
  };
}

const SYSTEM_PROMPT = `너는 취업 준비 플랫폼 렛츠커리어의 AI 상담사다.
사용자와 대화하며 취업 준비 고민을 듣고 답한다. 이전 대화가 있으면 그 맥락을 이어서 답한다.

- 답변은 친근한 해요체로 2~4문장. 고민에 먼저 공감하거나 짧게 조언한다.
- 사용자에게 도움이 될 프로그램·글이 카탈로그에 있으면 show_programs 도구를 호출해 화면 오른쪽에 띄운다.
  인사, 잡담, 단순 질문처럼 추천이 필요 없으면 호출하지 않는다.
- 도구를 호출할 때도 답변 본문은 반드시 함께 쓴다. 추천 목록은 화면에 따로 보이니 제목을 길게 나열하지 않는다.
- keys 에는 카탈로그의 key 만, 관련도 높은 순서로 최대 ${HOME_SEARCH_MAX_RESULTS}개 넣는다. 카탈로그에 없는 key 는 만들지 않는다.
- 같은 프로그램의 버전 행(대학생·무경력자 Ver., 인턴·실무 경험자 Ver.)은 사용자 상황에 맞는 쪽을 우선한다.
- 고민이 모호하면 상황을 묻는 질문을 한다.
- 취업 준비와 무관한 요청에는 렛츠커리어에서 도울 수 있는 일을 안내한다.`;

const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions';
const DEEPSEEK_MODEL = 'deepseek-chat';
const DEEPSEEK_TIMEOUT_MS = 15_000;

const SHOW_PROGRAMS_TOOL = {
  type: 'function',
  function: {
    name: 'show_programs',
    description:
      '사용자에게 추천할 렛츠커리어 프로그램·블로그 글을 화면 오른쪽 패널에 띄운다.',
    parameters: {
      type: 'object',
      properties: {
        keys: {
          type: 'array',
          items: { type: 'string' },
          description: '카탈로그의 key 목록, 관련도 높은 순',
        },
      },
      required: ['keys'],
    },
  },
};

const FALLBACK_TOOL_ANSWER =
  '도움이 될 만한 프로그램을 오른쪽에 띄워 드렸어요.';

/** 모델이 도구에 넘긴 인자는 신뢰하지 않고 형태를 직접 확인한다 */
function parseToolKeys(args: string | undefined): string[] | null {
  try {
    const parsed = JSON.parse(args ?? '');
    if (
      !Array.isArray(parsed?.keys) ||
      !parsed.keys.every((k: unknown) => typeof k === 'string')
    ) {
      return null;
    }
    return parsed.keys;
  } catch {
    return null;
  }
}

async function aiSearch(
  catalog: CatalogItem[],
  query: string,
  history: HomeSearchChatMessage[],
): Promise<HomeSearchResponse> {
  const catalogText = catalog
    .map(
      (item) =>
        `${item.key} | ${item.kind} | ${item.title} | ${item.description}`,
    )
    .join('\n');

  const res = await fetch(DEEPSEEK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: DEEPSEEK_MODEL,
      max_tokens: 1000,
      tools: [SHOW_PROGRAMS_TOOL],
      tool_choice: 'auto',
      messages: [
        // 시스템 프롬프트+카탈로그를 앞에 고정해 DeepSeek 컨텍스트 캐시가 맞도록 한다
        {
          role: 'system',
          content: `${SYSTEM_PROMPT}\n\n카탈로그 (key | 종류 | 제목 | 설명)\n${catalogText}`,
        },
        ...history,
        { role: 'user', content: query },
      ],
    }),
    signal: AbortSignal.timeout(DEEPSEEK_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`DeepSeek ${res.status}`);

  const data = await res.json();
  const message = data?.choices?.[0]?.message;
  const content =
    typeof message?.content === 'string' ? message.content.trim() : '';
  const toolCall = (message?.tool_calls ?? []).find(
    (call: { function?: { name?: string } }) =>
      call?.function?.name === 'show_programs',
  );

  if (!toolCall) {
    if (!content) return keywordSearch(catalog, query);
    return { mode: 'ai', answer: content, items: [], showPanel: false };
  }

  const keys = parseToolKeys(toolCall.function.arguments) ?? [];
  const byKey = new Map(catalog.map((item) => [item.key, item]));
  const items = keys
    .map((key) => byKey.get(key))
    .filter((item): item is CatalogItem => !!item)
    .slice(0, HOME_SEARCH_MAX_RESULTS)
    .map(stripSearchText);

  return {
    mode: 'ai',
    answer: content || FALLBACK_TOOL_ANSWER,
    items,
    showPanel: items.length > 0,
  };
}

/** 같은 검색어 반복 호출로 AI 비용이 새지 않게 인스턴스 메모리에 결과를 잠시 둔다 */
const AI_CACHE_TTL_MS = 10 * 60 * 1000;
const AI_CACHE_MAX_ENTRIES = 500;
const aiCache = new Map<string, { at: number; result: HomeSearchResponse }>();

function getCachedAi(key: string) {
  const hit = aiCache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.at > AI_CACHE_TTL_MS) {
    aiCache.delete(key);
    return null;
  }
  return hit.result;
}

function setCachedAi(key: string, result: HomeSearchResponse) {
  if (aiCache.size >= AI_CACHE_MAX_ENTRIES) {
    aiCache.delete(aiCache.keys().next().value!);
  }
  aiCache.set(key, { at: Date.now(), result });
}

export async function searchHome(
  query: string,
  category: HomeSearchCategory,
  history: HomeSearchChatMessage[] = [],
): Promise<HomeSearchResponse> {
  const catalog = filterByCategory(await getCatalog(), category);
  if (catalog.length === 0) {
    return { mode: 'keyword', answer: null, items: [], showPanel: false };
  }

  if (!process.env.DEEPSEEK_API_KEY) return keywordSearch(catalog, query);

  // 이어지는 대화는 맥락마다 답이 달라 첫 질문만 캐시한다
  const cacheKey =
    history.length === 0
      ? `${category}:${query.toLowerCase().replace(/\s+/g, ' ')}`
      : null;
  const cached = cacheKey ? getCachedAi(cacheKey) : null;
  if (cached) return cached;

  try {
    const result = await aiSearch(catalog, query, history);
    if (cacheKey && result.mode === 'ai') setCachedAi(cacheKey, result);
    return result;
  } catch (error) {
    console.error('[home-search] AI 검색 실패, 키워드 검색으로 대체', error);
    return keywordSearch(catalog, query);
  }
}
