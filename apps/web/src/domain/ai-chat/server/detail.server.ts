import 'server-only';

import { AiChatProgramDetail, AiChatReview } from '../types/aiChat';
import { formatWon } from '../utils/format';
import {
  CatalogItem,
  fetchServerData,
  sanitizeField,
  toPublicItem,
} from './catalog.server';

const V2_SERVER_API = process.env.NEXT_PUBLIC_SERVER_API_V2;

const MAX_HIGHLIGHTS = 4;
const MAX_STEPS = 6;
const MAX_REVIEWS = 3;

type DetailBody = Omit<AiChatProgramDetail, 'item'>;

const EMPTY_BODY: DetailBody = {
  summary: null,
  highlights: [],
  steps: [],
  stepsTitle: '',
  reviews: [],
};

function parseJson<T>(raw: unknown): T | null {
  if (typeof raw !== 'string') return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function text(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

/** 챌린지 상세 desc(JSON) 의 포인트·커리큘럼·운영진이 고른 후기 */
interface ChallengeDesc {
  challengePoint?: { list?: { title?: string; subtitle?: string }[] };
  curriculum?: { session?: string; title?: string }[];
  challengeReview?: {
    name?: string;
    programName?: string;
    passedState?: string;
    title?: string;
    content?: string;
  }[];
}

interface ProgramReviewRow {
  reviewInfo: { name?: string | null; programTitle?: string | null };
  reviewItemList?: { questionType?: string; answer?: string | null }[] | null;
}

/** 운영진이 고른 후기가 없을 때, 같은 챌린지 타입 수강생 후기의 '좋았던 점' */
async function fetchChallengeTypeReviews(
  challengeType: string,
): Promise<AiChatReview[]> {
  try {
    const res = await fetch(
      `${V2_SERVER_API}/review?type=CHALLENGE_REVIEW&challengeType=${challengeType}&page=1&size=20`,
      { next: { revalidate: 600 } },
    );
    if (!res.ok) return [];
    const list: ProgramReviewRow[] = (await res.json())?.data?.reviewList ?? [];
    return list
      .map((r) => ({
        review: r,
        good: r.reviewItemList?.find((i) => i.questionType === 'GOOD_POINT')
          ?.answer,
      }))
      .filter(({ good }) => text(good))
      .slice(0, MAX_REVIEWS)
      .map(({ review, good }) => ({
        title: '좋았던 점',
        content: good!.trim(),
        author: review.reviewInfo.name
          ? `${review.reviewInfo.name[0]}**`
          : null,
        meta: review.reviewInfo.programTitle ?? null,
      }));
  } catch {
    return [];
  }
}

async function challengeDetail(id: number): Promise<DetailBody> {
  const data = await fetchServerData<{
    desc?: string;
    shortDesc?: string;
    challengeType?: string;
  }>(`/challenge/${id}`);
  const desc = parseJson<ChallengeDesc>(data?.desc);

  const curated: AiChatReview[] = (desc?.challengeReview ?? [])
    .filter((r) => text(r.content))
    .slice(0, MAX_REVIEWS)
    .map((r) => ({
      title: text(r.title),
      content: r.content!.trim(),
      author: text(r.name),
      meta: [text(r.programName), text(r.passedState)]
        .filter(Boolean)
        .join(' · '),
    }));

  return {
    summary: text(data?.shortDesc),
    highlights: (desc?.challengePoint?.list ?? [])
      .filter((p) => text(p.title))
      .slice(0, MAX_HIGHLIGHTS)
      .map((p) => ({ title: p.title!.trim(), description: text(p.subtitle) })),
    steps: (desc?.curriculum ?? [])
      .filter((c) => text(c.title))
      .slice(0, MAX_STEPS)
      .map((c) => ({ label: text(c.session) ?? '', title: c.title!.trim() })),
    stepsTitle: '커리큘럼',
    reviews:
      curated.length > 0 || !data?.challengeType
        ? curated
        : await fetchChallengeTypeReviews(data.challengeType),
  };
}

interface MembershipLanding {
  hero?: { description?: string };
  benefitsSummary?: { name?: string; description?: string }[];
  reviews?: { source?: string; resultTags?: string[]; summary?: string }[];
}

async function membershipDetail(id: number): Promise<DetailBody> {
  const data = await fetchServerData<{
    landingDescription?: string;
    periodDays?: number;
  }>(`/membership/${id}`);
  const landing = parseJson<MembershipLanding>(data?.landingDescription);

  return {
    summary: text(landing?.hero?.description),
    highlights: (landing?.benefitsSummary ?? [])
      .filter((b) => text(b.name))
      .slice(0, MAX_HIGHLIGHTS)
      .map((b) => ({
        title: b.name!.trim(),
        description: text(b.description),
      })),
    steps: data?.periodDays
      ? [{ label: '이용 기간', title: `결제일부터 ${data.periodDays}일` }]
      : [],
    stepsTitle: '이용 안내',
    reviews: (landing?.reviews ?? [])
      .filter((r) => text(r.summary))
      .slice(0, MAX_REVIEWS)
      .map((r) => ({
        title: (r.resultTags ?? []).join(' ') || null,
        content: r.summary!.trim(),
        author: null,
        meta: text(r.source),
      })),
  };
}

interface MentorDetail {
  profile?: {
    introduction?: string;
    careers?: { company?: string; position?: string; visible?: boolean }[];
  };
  detailPage?: {
    strategy?: {
      visible?: boolean;
      title?: string;
      points?: { title?: string; description?: string }[];
    };
  };
  durationPrices?: { duration: number; price: number }[];
  reviews?: { menteeName?: string; score?: number; content?: string }[];
}

async function mentoringDetail(mentorId: number): Promise<DetailBody> {
  const data = await fetchServerData<MentorDetail>(
    `/live-mentoring/mentors/${mentorId}`,
  );
  const strategy = data?.detailPage?.strategy;
  const strategyPoints =
    strategy?.visible === false ? [] : (strategy?.points ?? []);
  const careers = (data?.profile?.careers ?? [])
    .filter((c) => c.visible !== false && text(c.company))
    .map((c) => ({ title: c.company!.trim(), description: text(c.position) }));

  return {
    summary: text(strategy?.title) ?? text(data?.profile?.introduction),
    highlights: (strategyPoints.length > 0
      ? strategyPoints
          .filter((p) => text(p.title))
          .map((p) => ({
            title: p.title!.trim(),
            description: text(p.description),
          }))
      : careers
    ).slice(0, MAX_HIGHLIGHTS),
    steps: (data?.durationPrices ?? []).map((d) => ({
      label: `${d.duration}분`,
      title: formatWon(d.price),
    })),
    stepsTitle: '시간별 가격',
    reviews: (data?.reviews ?? [])
      .filter((r) => text(r.content))
      .slice(0, MAX_REVIEWS)
      .map((r) => ({
        title: r.score ? `★ ${r.score}` : null,
        content: r.content!.trim(),
        author: r.menteeName ? `${r.menteeName[0]}**` : null,
        meta: null,
      })),
  };
}

export async function fetchProgramDetail(
  item: CatalogItem,
): Promise<AiChatProgramDetail> {
  let body = EMPTY_BODY;
  switch (item.ref.kind) {
    case 'CHALLENGE':
      body = await challengeDetail(item.ref.id);
      break;
    case 'MEMBERSHIP':
      body = await membershipDetail(item.ref.id);
      break;
    case 'LIVE_MENTORING':
      body = await mentoringDetail(item.ref.id);
      break;
    default:
      body = { ...EMPTY_BODY, summary: item.description || null };
  }
  return { item: toPublicItem(item), ...body };
}

/**
 * 상세 내용을 AI 답변용 텍스트로. 후기·소개는 외부 사람이 쓴 글이라 정제하고 길이를 자른다.
 */
export function toDetailToolResult(detail: AiChatProgramDetail) {
  const clean = (v: string | null, max: number) =>
    v ? sanitizeField(v, max) : '';
  return [
    `제목: ${clean(detail.item.title, 100)}`,
    detail.summary && `소개: ${clean(detail.summary, 200)}`,
    ...detail.highlights.map(
      (h) => `특징: ${clean(h.title, 60)} - ${clean(h.description, 100)}`,
    ),
    ...detail.steps.map(
      (s) =>
        `${detail.stepsTitle}: ${clean(s.label, 20)} ${clean(s.title, 60)}`,
    ),
    ...detail.reviews.map((r) => `후기: ${clean(r.content, 150)}`),
  ]
    .filter(Boolean)
    .join('\n');
}
