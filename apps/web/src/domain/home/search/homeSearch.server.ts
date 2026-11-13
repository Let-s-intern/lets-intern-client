import 'server-only';

import Anthropic from '@anthropic-ai/sdk';
import { betaJSONSchemaOutputFormat } from '@anthropic-ai/sdk/helpers/beta/json-schema';

import { getBlogPathname, getProgramPathname } from '@/utils/url';
import {
  HOME_SEARCH_MAX_RESULTS,
  HomeSearchCategory,
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
  };
}

const SYSTEM_PROMPT = `너는 취업 준비 플랫폼 렛츠커리어의 검색 도우미다.
사용자가 홈 화면 검색창에 입력한 고민이나 키워드를 읽고, 아래 카탈로그에서 가장 도움이 될 항목을 골라라.

- picks 에는 카탈로그의 key 만 넣는다. 카탈로그에 없는 key 는 절대 만들지 않는다.
- 관련도가 높은 순서로 최대 ${HOME_SEARCH_MAX_RESULTS}개. 관련 있는 항목이 없으면 빈 배열.
- 같은 프로그램의 버전 행(대학생·무경력자 Ver., 인턴·실무 경험자 Ver.)은 사용자 상황에 맞는 쪽을 우선한다. 상황을 알 수 없으면 둘 다 넣어도 된다.
- answer 는 사용자에게 보여줄 한두 문장 안내다. 친근한 해요체로, 왜 이 항목들을 골랐는지 짧게 말한다. 관련 항목이 없으면 다른 검색어를 제안한다.`;

const OUTPUT_FORMAT = betaJSONSchemaOutputFormat({
  type: 'object',
  properties: {
    answer: { type: 'string' },
    picks: { type: 'array', items: { type: 'string' } },
  },
  required: ['answer', 'picks'],
  additionalProperties: false,
} as const);

let anthropic: Anthropic | null = null;
function getAnthropic() {
  anthropic ??= new Anthropic();
  return anthropic;
}

async function aiSearch(
  catalog: CatalogItem[],
  query: string,
): Promise<HomeSearchResponse> {
  const catalogText = catalog
    .map(
      (item) =>
        `${item.key} | ${item.kind} | ${item.title} | ${item.description}`,
    )
    .join('\n');

  const message = await getAnthropic().beta.messages.parse({
    model: 'claude-opus-5-5',
    max_tokens: 2000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: { effort: 'low', format: OUTPUT_FORMAT },
    system: [
      { type: 'text', text: SYSTEM_PROMPT },
      {
        type: 'text',
        text: `카탈로그 (key | 종류 | 제목 | 설명)\n${catalogText}`,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [{ role: 'user', content: query }],
  });

  if (message.stop_reason === 'refusal' || !message.parsed_output) {
    return keywordSearch(catalog, query);
  }

  const byKey = new Map(catalog.map((item) => [item.key, item]));
  const items = message.parsed_output.picks
    .map((key) => byKey.get(key))
    .filter((item): item is CatalogItem => !!item)
    .slice(0, HOME_SEARCH_MAX_RESULTS)
    .map(stripSearchText);

  return { mode: 'ai', answer: message.parsed_output.answer, items };
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
): Promise<HomeSearchResponse> {
  const catalog = filterByCategory(await getCatalog(), category);
  if (catalog.length === 0) return { mode: 'keyword', answer: null, items: [] };

  if (!process.env.ANTHROPIC_API_KEY) return keywordSearch(catalog, query);

  const cacheKey = `${category}:${query.toLowerCase().replace(/\s+/g, ' ')}`;
  const cached = getCachedAi(cacheKey);
  if (cached) return cached;

  try {
    const result = await aiSearch(catalog, query);
    if (result.mode === 'ai') setCachedAi(cacheKey, result);
    return result;
  } catch (error) {
    console.error('[home-search] AI 검색 실패, 키워드 검색으로 대체', error);
    return keywordSearch(catalog, query);
  }
}
