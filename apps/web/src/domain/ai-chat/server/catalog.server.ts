import 'server-only';

import getChallengeOptionPriceInfo from '@/utils/getChallengeOptionPriceInfo';
import { getBlogPathname, getProgramPathname } from '@/utils/url';

import {
  AiChatItem,
  AiChatItemKind,
  AiChatPeriod,
  AiChatPrice,
} from '../types/aiChat';
import { formatPeriod, formatPriceText } from '../utils/format';

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;
const CATALOG_REVALIDATE_SECONDS = 600;
const BLOG_CATALOG_SIZE = 60;

/** AI 프롬프트·키워드 매칭에만 쓰는 필드를 덧붙인 카탈로그 항목 */
export type CatalogItem = AiChatItem & { searchText: string };

interface ProgramRow {
  programInfo: {
    id: number;
    programType: string;
    title?: string | null;
    shortDesc?: string | null;
    thumbnail?: string | null;
    challengeVersionId?: number | null;
    beginning?: string | null;
    deadline?: string | null;
    startDate?: string | null;
    endDate?: string | null;
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

function toPrice(selling: number, original: number | null, note?: string) {
  return {
    selling,
    original: original && original > selling ? original : null,
    note: note ?? null,
  };
}

/** 프로그램 상세 API 에서 사용자에게 보이는 판매가를 뽑는다. 화면의 가격 표기와 같은 계산을 쓴다 */
async function fetchProgramPrice(
  kind: AiChatItemKind,
  id: number,
): Promise<AiChatPrice | null> {
  switch (kind) {
    case 'CHALLENGE': {
      const data = await fetchServerData<{
        priceInfo?: Parameters<typeof getChallengeOptionPriceInfo>[0];
      }>(`/challenge/${id}`);
      if (!data?.priceInfo?.length) return null;
      const { basicRegularPrice, basicDiscountAmount } =
        getChallengeOptionPriceInfo(data.priceInfo);
      const refund = data.priceInfo[0]?.refund ?? 0;
      const note =
        refund > 0
          ? `베이직 기준, 환급 보증금 ${refund.toLocaleString('ko-KR')}원 포함`
          : '베이직 기준';
      return toPrice(
        basicRegularPrice - basicDiscountAmount,
        basicRegularPrice,
        note,
      );
    }
    case 'VOD':
    case 'GUIDEBOOK': {
      const path = kind === 'VOD' ? 'vods' : 'guidebooks';
      const data = await fetchServerData<{
        priceInfo?: { originalPrice?: number; finalPrice?: number };
      }>(`/${path}/${id}`);
      const finalPrice = data?.priceInfo?.finalPrice;
      if (finalPrice == null) return null;
      return toPrice(finalPrice, data?.priceInfo?.originalPrice ?? null);
    }
    case 'LIVE': {
      const data = await fetchServerData<{
        priceInfo?: { price?: number; discount?: number };
      }>(`/live/${id}`);
      const price = data?.priceInfo?.price;
      if (price == null) return null;
      return toPrice(price - (data?.priceInfo?.discount ?? 0), price);
    }
    default:
      return null;
  }
}

function toPeriod(start?: string | null, end?: string | null) {
  return start || end ? { start: start ?? null, end: end ?? null } : null;
}

/** 모집 중·모집 예정 프로그램(가격·기간 포함)과 최신 블로그를 모은다 */
export async function getCatalog(): Promise<CatalogItem[]> {
  const [programData, blogData] = await Promise.all([
    fetchServerData<{ programList: ProgramRow[] }>(
      '/program?page=1&size=200&status=PREV,PROCEEDING',
    ),
    fetchServerData<{ blogInfos: BlogRow[] }>(
      `/blog?page=1&size=${BLOG_CATALOG_SIZE}`,
    ),
  ]);
  const programRows = programData?.programList ?? [];

  // 버전 행은 같은 프로그램 id 를 공유하므로 상세 조회는 한 번만 한다
  const priceByProgram = new Map<string, Promise<AiChatPrice | null>>();
  for (const { programInfo: p } of programRows) {
    const id = `${p.programType}:${p.id}`;
    if (!priceByProgram.has(id)) {
      priceByProgram.set(
        id,
        fetchProgramPrice(p.programType as AiChatItemKind, p.id),
      );
    }
  }

  const programs = await Promise.all(
    programRows.map(async ({ programInfo: p }): Promise<CatalogItem> => {
      const price = await priceByProgram.get(`${p.programType}:${p.id}`)!;
      const recruit = toPeriod(p.beginning, p.deadline);
      const schedule = toPeriod(p.startDate, p.endDate);
      return {
        key: `P${p.id}-${p.challengeVersionId ?? 0}`,
        kind: p.programType as AiChatItemKind,
        title: p.title ?? '',
        description: p.shortDesc ?? '',
        thumbnail: p.thumbnail ?? null,
        href: getProgramPathname({
          programType: p.programType.toLowerCase() as never,
          id: p.id,
          title: p.title,
          challengeVersionId: p.challengeVersionId,
        }),
        price,
        recruit,
        schedule,
        searchText: `${p.title ?? ''} ${p.shortDesc ?? ''}`,
      };
    }),
  );

  const blogs = (blogData?.blogInfos ?? []).map(
    ({ blogThumbnailInfo: b }): CatalogItem => ({
      key: `B${b.id}`,
      kind: 'BLOG',
      title: b.title ?? '',
      description: b.description ?? '',
      thumbnail: b.thumbnail ?? null,
      href: getBlogPathname({ id: b.id, title: b.title }),
      price: null,
      recruit: null,
      schedule: null,
      searchText: `${b.title ?? ''} ${b.description ?? ''}`,
    }),
  );

  return [...programs, ...blogs];
}

function describePeriod(label: string, period: AiChatPeriod | null) {
  const text = formatPeriod(period);
  return text ? `${label} ${text}` : null;
}

/** AI 프롬프트에 넣는 한 줄 표현 */
export function toCatalogLine(item: CatalogItem) {
  return [
    item.key,
    item.kind,
    item.title,
    item.description,
    item.price ? `가격 ${formatPriceText(item.price)}` : null,
    describePeriod('모집', item.recruit),
    describePeriod('진행', item.schedule),
  ]
    .filter(Boolean)
    .join(' | ');
}

export function toPublicItem({ searchText: _, ...item }: CatalogItem) {
  return item;
}
