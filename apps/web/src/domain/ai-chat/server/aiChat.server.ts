import 'server-only';

import {
  AI_CHAT_COMPARE_MAX,
  AI_CHAT_RECOMMEND_MAX,
} from '../constants/aiChat';
import { AiChatMessage, AiChatPanel, AiChatResponse } from '../types/aiChat';
import {
  CatalogItem,
  getCatalog,
  toCatalogLine,
  toPublicItem,
} from './catalog.server';

const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions';
const DEEPSEEK_MODEL = 'deepseek-chat';
const DEEPSEEK_TIMEOUT_MS = 20_000;

const SYSTEM_PROMPT = `너는 취업 준비 플랫폼 렛츠커리어의 AI 상담사다.
사용자와 대화하며 취업 준비 고민을 듣고 답한다. 이전 대화가 있으면 그 맥락을 이어서 답한다.

답변
- 친근한 해요체로 2~5문장. 고민에 먼저 공감하거나 짧게 조언한다.
- 강조는 **굵게**, 목록은 "- " 로만 쓴다. 표·제목(#)·링크 문법은 쓰지 않는다.
- 가격·모집 기간·진행 기간은 카탈로그에 적힌 값만 말한다. 없는 값은 지어내지 않는다.
- '패널', '도구', '카탈로그', 'key' 같은 내부 용어는 답변에 쓰지 않는다. 추천 목록은 "오른쪽"이라고 부른다.

도구 (화면 오른쪽 패널)
- show_programs: 사용자 고민에 맞는 프로그램·글을 추천할 때 호출한다.
- compare_programs: 사용자가 둘 이상을 비교해 달라고 하거나, 가격·기간·차이를 묻거나, 무엇을 고를지 고민할 때 호출한다. 이때 show_programs 는 호출하지 않는다.
- 인사, 잡담, 단순 질문처럼 패널이 필요 없으면 아무 도구도 호출하지 않는다.
- 도구를 호출할 때도 답변 본문은 반드시 함께 쓴다. 목록은 패널에 따로 보이니 제목을 길게 나열하지 않는다.
- keys 에는 카탈로그의 key 만 넣는다. 카탈로그에 없는 key 는 만들지 않는다.
- 같은 프로그램의 버전 행(대학생·무경력자 Ver., 인턴·실무 경험자 Ver.)은 사용자 상황에 맞는 쪽을 우선한다.
- 고민이 모호하면 상황을 묻는 질문을 한다. 취업 준비와 무관한 요청에는 렛츠커리어에서 도울 수 있는 일을 안내한다.`;

function keysTool(name: string, description: string, max: number) {
  return {
    type: 'function',
    function: {
      name,
      description,
      parameters: {
        type: 'object',
        properties: {
          keys: {
            type: 'array',
            items: { type: 'string' },
            description: `카탈로그의 key 목록, 최대 ${max}개`,
          },
        },
        required: ['keys'],
      },
    },
  };
}

const TOOLS = [
  keysTool(
    'show_programs',
    '사용자에게 추천할 프로그램·블로그 글을 화면 오른쪽에 목록으로 띄운다. 관련도 높은 순.',
    AI_CHAT_RECOMMEND_MAX,
  ),
  keysTool(
    'compare_programs',
    '프로그램 2~4개의 가격·모집 기간·진행 기간을 화면 오른쪽에 비교표로 띄운다.',
    AI_CHAT_COMPARE_MAX,
  ),
];

const FALLBACK_ANSWER = {
  recommend: '도움이 될 만한 프로그램을 오른쪽에 띄워 드렸어요.',
  compare: '오른쪽 비교표에서 가격과 일정을 한눈에 확인해 보세요.',
};

interface ToolCall {
  function?: { name?: string; arguments?: string };
}

/** 모델이 도구에 넘긴 인자는 신뢰하지 않고 형태를 직접 확인한다 */
function parseToolKeys(args: string | undefined): string[] {
  try {
    const parsed = JSON.parse(args ?? '');
    return Array.isArray(parsed?.keys)
      ? parsed.keys.filter((k: unknown) => typeof k === 'string')
      : [];
  } catch {
    return [];
  }
}

function pickItems(catalog: CatalogItem[], keys: string[], max: number) {
  const byKey = new Map(catalog.map((item) => [item.key, item]));
  return [...new Set(keys)]
    .map((key) => byKey.get(key))
    .filter((item): item is CatalogItem => !!item)
    .slice(0, max)
    .map(toPublicItem);
}

/** 비교 도구가 있으면 비교를, 없으면 추천을 패널로 쓴다 */
function toPanel(
  catalog: CatalogItem[],
  toolCalls: ToolCall[],
): AiChatPanel | null {
  const compare = toolCalls.find(
    (c) => c.function?.name === 'compare_programs',
  );
  if (compare) {
    const items = pickItems(
      catalog,
      parseToolKeys(compare.function?.arguments),
      AI_CHAT_COMPARE_MAX,
    );
    // 하나뿐이면 비교가 아니므로 추천 목록으로 보여준다
    if (items.length >= 2) return { type: 'compare', items };
    if (items.length === 1) return { type: 'recommend', items };
  }
  const show = toolCalls.find((c) => c.function?.name === 'show_programs');
  if (show) {
    const items = pickItems(
      catalog,
      parseToolKeys(show.function?.arguments),
      AI_CHAT_RECOMMEND_MAX,
    );
    if (items.length > 0) return { type: 'recommend', items };
  }
  return null;
}

async function askDeepSeek(
  catalog: CatalogItem[],
  query: string,
  history: AiChatMessage[],
): Promise<AiChatResponse> {
  const res = await fetch(DEEPSEEK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: DEEPSEEK_MODEL,
      max_tokens: 1200,
      tools: TOOLS,
      tool_choice: 'auto',
      messages: [
        // 시스템 프롬프트+카탈로그를 앞에 고정해 DeepSeek 컨텍스트 캐시가 맞도록 한다
        {
          role: 'system',
          content: `${SYSTEM_PROMPT}\n\n카탈로그 (key | 종류 | 제목 | 설명 | 가격 | 모집 | 진행)\n${catalog.map(toCatalogLine).join('\n')}`,
        },
        ...history,
        { role: 'user', content: query },
      ],
    }),
    signal: AbortSignal.timeout(DEEPSEEK_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`DeepSeek ${res.status}`);

  const message = (await res.json())?.choices?.[0]?.message;
  const content =
    typeof message?.content === 'string' ? message.content.trim() : '';
  const panel = toPanel(catalog, message?.tool_calls ?? []);

  if (!content && !panel) return keywordAnswer(catalog, query);
  return {
    mode: 'ai',
    answer: content || (panel ? FALLBACK_ANSWER[panel.type] : null),
    panel,
  };
}

/** 키가 없거나 AI 호출이 실패했을 때 쓰는 단순 키워드 매칭 */
function keywordAnswer(catalog: CatalogItem[], query: string): AiChatResponse {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const items = catalog
    .map((item) => {
      const text = item.searchText.toLowerCase();
      return { item, score: words.filter((w) => text.includes(w)).length };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, AI_CHAT_RECOMMEND_MAX)
    .map(({ item }) => toPublicItem(item));

  return {
    mode: 'keyword',
    answer: null,
    panel: items.length > 0 ? { type: 'recommend', items } : null,
  };
}

/** 같은 첫 질문 반복으로 AI 비용이 새지 않게 인스턴스 메모리에 결과를 잠시 둔다 */
const CACHE_TTL_MS = 10 * 60 * 1000;
const CACHE_MAX_ENTRIES = 500;
const cache = new Map<string, { at: number; result: AiChatResponse }>();

function getCached(key: string) {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.at > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return hit.result;
}

function setCached(key: string, result: AiChatResponse) {
  if (cache.size >= CACHE_MAX_ENTRIES) {
    cache.delete(cache.keys().next().value!);
  }
  cache.set(key, { at: Date.now(), result });
}

export async function answerAiChat(
  query: string,
  history: AiChatMessage[],
): Promise<AiChatResponse> {
  const catalog = await getCatalog();
  if (catalog.length === 0)
    return { mode: 'keyword', answer: null, panel: null };

  if (!process.env.DEEPSEEK_API_KEY) return keywordAnswer(catalog, query);

  // 이어지는 대화는 맥락마다 답이 달라 첫 질문만 캐시한다
  const cacheKey =
    history.length === 0 ? query.toLowerCase().replace(/\s+/g, ' ') : null;
  const cached = cacheKey ? getCached(cacheKey) : null;
  if (cached) return cached;

  try {
    const result = await askDeepSeek(catalog, query, history);
    if (cacheKey && result.mode === 'ai') setCached(cacheKey, result);
    return result;
  } catch (error) {
    console.error('[ai-chat] AI 응답 실패, 키워드 매칭으로 대체', error);
    return keywordAnswer(catalog, query);
  }
}
