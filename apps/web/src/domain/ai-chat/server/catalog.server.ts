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

interface MentoringOpeningRow {
  openingId: number;
  mentorId: number;
  mentorNickname?: string | null;
  mentorIntroduction?: string | null;
  representativeCareer?: {
    company?: string | null;
    job?: string | null;
  } | null;
  title?: string | null;
  thumbnail?: string | null;
  categories?: string[] | null;
  durations?: number[] | null;
  minimumPrice?: number | null;
}

const MENTORING_CATEGORY_LABEL: Record<string, string> = {
  RESUME: '이력서',
  PERSONAL_STATEMENT: '자기소개서',
  PORTFOLIO: '포트폴리오',
  CAREER_COFFEE_CHAT: '커리어 커피챗',
  INTERVIEW: '면접',
  EXPERIENCE: '경험정리',
};

/** 서버 max-page-size. 공개(OPEN) 개설 전체를 한 번에 받는다 */
const MENTORING_PAGE_SIZE = 2000;

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
  const [programData, mentoringData, blogData] = await Promise.all([
    fetchServerData<{ programList: ProgramRow[] }>(
      '/program?page=1&size=200&status=PREV,PROCEEDING',
    ),
    // 1:1 LIVE 멘토링은 /program 목록에 없어서 따로 받는다
    fetchServerData<{ openingList: MentoringOpeningRow[] }>(
      `/live-mentoring?page=1&size=${MENTORING_PAGE_SIZE}`,
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

  const mentorings = (mentoringData?.openingList ?? []).map(
    (o): CatalogItem => {
      const career = [
        o.representativeCareer?.company,
        o.representativeCareer?.job,
      ]
        .filter(Boolean)
        .join(' ');
      const categories = (o.categories ?? [])
        .map((c) => MENTORING_CATEGORY_LABEL[c] ?? c)
        .join('·');
      const minDuration = o.durations?.length ? Math.min(...o.durations) : null;
      const description = [
        `멘토 ${o.mentorNickname ?? ''}${career ? `(${career})` : ''}`,
        categories && `분야 ${categories}`,
        o.mentorIntroduction?.replace(/\s+/g, ' ').slice(0, 80),
      ]
        .filter(Boolean)
        .join(' · ');
      return {
        key: `M${o.openingId}`,
        kind: 'LIVE_MENTORING',
        title: o.title ?? `${o.mentorNickname ?? ''} 멘토 1:1 LIVE 멘토링`,
        description,
        thumbnail: o.thumbnail ?? null,
        href: `/live-mentoring/${o.mentorId}`,
        price:
          o.minimumPrice != null
            ? {
                selling: o.minimumPrice,
                original: null,
                note: minDuration ? `${minDuration}분 기준 최저가` : '최저가',
              }
            : null,
        recruit: null,
        schedule: null,
        searchText: `${o.title ?? ''} 1:1 1대1 라이브 LIVE 멘토링 멘토 ${o.mentorNickname ?? ''} ${career} ${categories} ${o.mentorIntroduction ?? ''}`,
      };
    },
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

  return [...programs, ...mentorings, ...blogs];
}

function describePeriod(label: string, period: AiChatPeriod | null) {
  const text = formatPeriod(period);
  return text ? `${label} ${text}` : null;
}

/**
 * 카탈로그 텍스트는 멘토 소개처럼 외부 사람이 쓴 값이 섞여 있어 데이터로만 다룬다.
 * 줄바꿈·구분자(|)·데이터 블록 태그를 지우고 길이를 잘라 프롬프트 구조를 깨지 못하게 한다.
 */
function sanitizeField(value: string, maxLength: number) {
  return value
    .replace(/<\/?catalog>/gi, '')
    .replace(/[|\r\n\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

/** AI 프롬프트에 넣는 한 줄 표현 */
export function toCatalogLine(item: CatalogItem) {
  return [
    item.key,
    item.kind,
    sanitizeField(item.title, 100),
    sanitizeField(item.description, 160),
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
