/**
 * 1대1 라이브 멘토링 — 공유 목(mock) 데이터 (SSOT).
 *
 * `apps/web`(공개 리스트/상세)와 `apps/mentor`(오픈 설정·정산·오픈 현황)가
 * 동일한 목 계약을 바라보도록 카테고리·진행시간·가격·멘토·후기·정산·오픈현황을
 * **한 곳에서** 정의한다. MSW 핸들러(`handlers.ts`)가 이 데이터를 그대로 서빙한다.
 *
 * 실제 BE 연동은 이번 범위 밖이며, 결제/예약 실행 로직도 없다(가격은 표시용).
 */

// ─────────────────────────────────────────────────────────────
// 카테고리 / 진행시간 / 가격 (PRD §4.1)
// ─────────────────────────────────────────────────────────────

/** 멘토가 파는 서비스 종류 — 자소서 / 이력서 / 포트폴리오 */
export type LiveMentoringCategory =
  | 'PERSONAL_STATEMENT'
  | 'RESUME'
  | 'PORTFOLIO';

/** 진행시간(분). 가격을 결정하는 유일한 변수. */
export type LiveMentoringDuration = 30 | 50;

export const LIVE_MENTORING_CATEGORIES: readonly LiveMentoringCategory[] = [
  'PERSONAL_STATEMENT',
  'RESUME',
  'PORTFOLIO',
] as const;

export const LIVE_MENTORING_DURATIONS: readonly LiveMentoringDuration[] = [
  30, 50,
] as const;

/**
 * 진행시간 → 고정 가격. 멘토가 입력하지 않으며 카테고리·등급 등 다른 변수는 없다.
 * 30분 = 35,000원 / 50분 = 60,000원 (운영팀 소관, 이번엔 고정).
 */
export const PRICE_BY_DURATION: Record<LiveMentoringDuration, number> = {
  30: 35000,
  50: 60000,
};

/** 진행시간에 해당하는 고정 가격을 반환한다. */
export function getPriceByDuration(durationMin: LiveMentoringDuration): number {
  return PRICE_BY_DURATION[durationMin];
}

/**
 * 여러 진행시간이 선택된 경우 웹에는 **가장 낮은 금액**을 노출한다.
 * (30분 35,000 < 50분 60,000 이므로 사실상 최소 진행시간의 가격)
 * 빈 배열이면 0.
 */
export function getLowestPrice(durations: LiveMentoringDuration[]): number {
  if (durations.length === 0) return 0;
  return Math.min(...durations.map(getPriceByDuration));
}

/** 고정 시작일에 days 를 더한 YYYY-MM-DD 문자열 (목 피드백 기간 종료일 파생용). */
function addDays(isoDate: string, days: number): string {
  const d = new Date(isoDate);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

// ─────────────────────────────────────────────────────────────
// 타입 정의 (PRD §4.2 ~ §4.7)
// ─────────────────────────────────────────────────────────────

/** 리스트 카드용 멘토 요약 (PRD §4.2) */
export interface LiveMentorCard {
  mentorId: number;
  nickname: string;
  profileImage: string | null;
  profileVisible: boolean;
  mosaicEnabled: boolean;
  mosaicBlur: number;
  headline: string;
  mentoringPoints: string;
  /** 멘토가 오픈한 타입(다중). */
  categories: LiveMentoringCategory[];
  /** 멘토가 오픈한 진행시간(다중). */
  durations: LiveMentoringDuration[];
  /** 여러 진행시간 선택 시 최저가. */
  price: number;
  rating: number;
  reviewCount: number;
  /** 피드백 진행 일정(오픈 기간) 시작·종료일. */
  feedbackStartDate: string;
  feedbackEndDate: string;
}

/** 멘토 이력 1건 (노출 선택 가능) */
export interface LiveMentoringCareer {
  company: string;
  position: string;
  period: string;
  visible: boolean;
}

/** 멘티 제출물 체크리스트 항목 (PRD §4.4) */
export interface ChecklistItem {
  id: number;
  label: string;
  mode: 'SHOWN' | 'HIDDEN' | 'CUSTOM';
  customText?: string;
}

/** 타입별 기본 + 멘토 편집분 템플릿 (PRD §4.4) */
export interface LiveMentoringTemplate {
  category: LiveMentoringCategory;
  // --- 편집 불가 (기본 템플릿 고정) ---
  faq: { q: string; a: string }[];
  process: { step: number; title: string; desc: string }[];
  submissionSpec: { title: string; desc: string };
  // --- 편집 가능 ---
  introduction: string;
  careers: LiveMentoringCareer[];
  mentoringPoints: string;
  reviews: { visible: boolean; selectedReviewIds: number[] };
  checklist: ChecklistItem[];
}

/** 상세 페이지 프로필 블록 (PRD §4.3) */
export interface LiveMentorProfile {
  visible: boolean;
  mosaicEnabled: boolean;
  mosaicBlur: number;
  nickname: string;
  profileImage: string | null;
  introduction: string;
  careers: LiveMentoringCareer[];
}

/** 후기 (PRD §4.5) */
export interface LiveMentoringReview {
  reviewId: number;
  menteeName: string;
  score: number;
  content: string;
  createdAt: string;
}

/** 멘토 상세 (상세 페이지 렌더용, +reviews) (PRD §4.3) */
export interface LiveMentorDetail {
  mentorId: number;
  categories: LiveMentoringCategory[];
  durations: LiveMentoringDuration[];
  price: number;
  rating: number;
  reviewCount: number;
  feedbackStartDate: string;
  feedbackEndDate: string;
  profile: LiveMentorProfile;
  template: LiveMentoringTemplate;
  reviews: LiveMentoringReview[];
}

/**
 * 오픈 설정(메타) (PRD §5 S3-a).
 * 오픈은 하나만 가능하므로 이 설정이 곧 단일 오픈이다.
 * 타입·진행시간은 다중 선택, 가격은 진행시간에 따라 파생(최저가)한다.
 */
export interface LiveMentoringSettings {
  profileVisible: boolean;
  mosaicEnabled: boolean;
  mosaicBlur: number;
  nickname: string;
  profileImage: string | null;
  introduction: string;
  careers: LiveMentoringCareer[];
  categories: LiveMentoringCategory[];
  durations: LiveMentoringDuration[];
  /** 피드백 진행 일정(오픈 기간) 시작·종료일. */
  feedbackStartDate: string;
  feedbackEndDate: string;
}

/** 정산 현황 행 (PRD §4.6, read-only) */
export interface SettlementRow {
  period: string;
  completedCount: number;
  grossAmount: number;
  status: 'PENDING' | 'PAID';
}

/** 오픈 현황 행 (PRD §4.7, read-only). 오픈은 하나만 가능. */
export interface OpenStatusRow {
  categories: LiveMentoringCategory[];
  durations: LiveMentoringDuration[];
  price: number;
  /** 피드백 진행 일정(오픈 기간) 시작·종료일. */
  feedbackStartDate: string;
  feedbackEndDate: string;
  status: 'OPEN' | 'CLOSED';
  reservationCount: number;
}

// ─────────────────────────────────────────────────────────────
// 카테고리별 기본 템플릿 (편집 불가 영역 + 기본 체크리스트)
// 타입(자소서/이력서/포폴)에 따라 기본값이 달라진다. (PRD §6)
// ─────────────────────────────────────────────────────────────

type CategoryTemplateDefault = Pick<
  LiveMentoringTemplate,
  'faq' | 'process' | 'submissionSpec' | 'checklist'
>;

export const CATEGORY_TEMPLATE_DEFAULTS: Record<
  LiveMentoringCategory,
  CategoryTemplateDefault
> = {
  PERSONAL_STATEMENT: {
    faq: [
      {
        q: '자기소개서 몇 개 문항까지 봐주시나요?',
        a: '30분은 1~2문항, 50분은 3~4문항까지 집중적으로 봐드립니다.',
      },
      {
        q: '완성본이 없어도 신청할 수 있나요?',
        a: '초안이나 개요만 있어도 방향을 함께 잡아드립니다.',
      },
    ],
    process: [
      {
        step: 1,
        title: '사전 제출',
        desc: '자소서 문항과 초안을 미리 공유합니다.',
      },
      {
        step: 2,
        title: '라이브 첨삭',
        desc: '문항별 강약과 소재를 함께 다듬습니다.',
      },
      { step: 3, title: '정리', desc: '수정 방향을 요약해 전달드립니다.' },
    ],
    submissionSpec: {
      title: '자기소개서 초안',
      desc: '지원 회사·문항과 함께 작성한 초안을 제출해 주세요.',
    },
    checklist: [
      { id: 1, label: '지원 직무/회사', mode: 'SHOWN' },
      { id: 2, label: '자소서 문항 원문', mode: 'SHOWN' },
      { id: 3, label: '작성 초안', mode: 'SHOWN' },
      { id: 4, label: '핵심 경험 요약', mode: 'HIDDEN' },
    ],
  },
  RESUME: {
    faq: [
      {
        q: '경력기술서도 함께 봐주시나요?',
        a: '네, 이력서와 경력기술서를 함께 검토합니다.',
      },
      {
        q: '신입도 신청 가능한가요?',
        a: '신입/경력 모두 가능하며 경험 정리부터 도와드립니다.',
      },
    ],
    process: [
      { step: 1, title: '사전 제출', desc: '이력서와 지원 직무를 공유합니다.' },
      {
        step: 2,
        title: '라이브 리뷰',
        desc: '핵심 성과 표현과 구조를 점검합니다.',
      },
      {
        step: 3,
        title: '정리',
        desc: '개선 포인트를 항목별로 정리해 드립니다.',
      },
    ],
    submissionSpec: {
      title: '이력서 파일',
      desc: '지원 직무 기준으로 정리한 이력서를 제출해 주세요.',
    },
    checklist: [
      { id: 1, label: '지원 직무/회사', mode: 'SHOWN' },
      { id: 2, label: '이력서 파일', mode: 'SHOWN' },
      { id: 3, label: '경력기술서', mode: 'SHOWN' },
      { id: 4, label: '희망 연봉', mode: 'HIDDEN' },
    ],
  },
  PORTFOLIO: {
    faq: [
      {
        q: '어떤 직군 포트폴리오를 봐주시나요?',
        a: '기획·디자인·개발 포트폴리오 모두 검토 가능합니다.',
      },
      {
        q: '노션 링크로 제출해도 되나요?',
        a: '네, 노션/PDF/웹 링크 모두 가능합니다.',
      },
    ],
    process: [
      {
        step: 1,
        title: '사전 제출',
        desc: '포트폴리오 링크와 목표를 공유합니다.',
      },
      {
        step: 2,
        title: '라이브 리뷰',
        desc: '프로젝트 서사와 구성 흐름을 점검합니다.',
      },
      {
        step: 3,
        title: '정리',
        desc: '보완할 프로젝트와 우선순위를 정리합니다.',
      },
    ],
    submissionSpec: {
      title: '포트폴리오 링크/파일',
      desc: '대표 프로젝트가 담긴 포트폴리오를 제출해 주세요.',
    },
    checklist: [
      { id: 1, label: '지원 직무/회사', mode: 'SHOWN' },
      { id: 2, label: '포트폴리오 링크', mode: 'SHOWN' },
      { id: 3, label: '대표 프로젝트 설명', mode: 'SHOWN' },
      { id: 4, label: '기여도/역할', mode: 'HIDDEN' },
    ],
  },
};

// ─────────────────────────────────────────────────────────────
// 멘토 시드 → 카드/상세/후기 파생
// ─────────────────────────────────────────────────────────────

interface MentorSeed {
  mentorId: number;
  nickname: string;
  headline: string;
  mentoringPoints: string;
  /** 대표 카테고리(템플릿 기본값 기준). */
  category: LiveMentoringCategory;
  /** 기본 진행시간. */
  durationMin: LiveMentoringDuration;
  /** 오픈한 타입(다중). 미지정 시 [category]. */
  categories?: LiveMentoringCategory[];
  /** 오픈한 진행시간(다중). 미지정 시 [durationMin]. */
  durations?: LiveMentoringDuration[];
  rating: number;
  reviewCount: number;
  profileVisible: boolean;
  mosaicEnabled: boolean;
  mosaicBlur: number;
  hasImage: boolean;
  nextAvailableDate: string | null;
  introduction: string;
  careers: LiveMentoringCareer[];
}

const PROFILE_IMAGE_BASE = 'https://avatars.githubusercontent.com/u';

/** hasImage 여부에 따라 결정적(deterministic) 프로필 이미지 URL 또는 null */
function imageFor(seed: MentorSeed): string | null {
  return seed.hasImage
    ? `${PROFILE_IMAGE_BASE}/${100 + seed.mentorId}?v=4`
    : null;
}

/** 시드의 오픈 타입(다중) — 미지정 시 대표 카테고리 단일. */
function categoriesFor(seed: MentorSeed): LiveMentoringCategory[] {
  return seed.categories ?? [seed.category];
}

/** 시드의 오픈 진행시간(다중) — 미지정 시 기본 진행시간 단일. */
function durationsFor(seed: MentorSeed): LiveMentoringDuration[] {
  return seed.durations ?? [seed.durationMin];
}

/** 시드의 피드백 진행 일정(오픈 기간) — 시작은 nextAvailableDate, 종료는 +13일. */
function periodFor(seed: MentorSeed): {
  feedbackStartDate: string;
  feedbackEndDate: string;
} {
  const feedbackStartDate = seed.nextAvailableDate ?? '2026-07-10';
  return { feedbackStartDate, feedbackEndDate: addDays(feedbackStartDate, 13) };
}

/**
 * 멘토 시드 — 12명 이상(size=9 기준 2페이지 이상), 카테고리·30/50분·평점(0~5)·
 * 후기 수 분포를 다양화. 모자이크/프로필 비노출 케이스도 섞는다.
 */
const MENTOR_SEEDS: MentorSeed[] = [
  {
    mentorId: 1,
    nickname: '자소서장인',
    headline: '네이버 · 서비스 기획 7년',
    mentoringPoints: '두괄식 구조와 경험 소재 발굴 위주로 봅니다.',
    category: 'PERSONAL_STATEMENT',
    durationMin: 50,
    // 다중 타입·진행시간 오픈 예시 → 웹에는 최저가(30분 35,000원)로 노출.
    categories: ['PERSONAL_STATEMENT', 'RESUME'],
    durations: [30, 50],
    rating: 4.9,
    reviewCount: 182,
    profileVisible: true,
    mosaicEnabled: false,
    mosaicBlur: 0,
    hasImage: true,
    nextAvailableDate: '2026-07-14',
    introduction:
      '대기업 서비스 기획자로 일하며 수백 건의 자소서를 리뷰했습니다. 소재 선정부터 문장 압축까지 함께합니다.',
    careers: [
      {
        company: '네이버',
        position: '서비스 기획',
        period: '2019-2026',
        visible: true,
      },
      {
        company: '라인',
        position: '기획 인턴',
        period: '2018-2019',
        visible: true,
      },
    ],
  },
  {
    mentorId: 2,
    nickname: '이력서닥터',
    headline: '카카오 · 백엔드 개발 6년',
    mentoringPoints: '성과를 숫자로 드러내는 표현을 집중적으로 다듬습니다.',
    category: 'RESUME',
    durationMin: 30,
    rating: 4.7,
    reviewCount: 96,
    profileVisible: true,
    mosaicEnabled: true,
    mosaicBlur: 6,
    hasImage: true,
    nextAvailableDate: '2026-07-11',
    introduction:
      '현직 백엔드 개발자입니다. 기술 경험을 채용 관점에서 재구성하도록 돕습니다.',
    careers: [
      {
        company: '카카오',
        position: '백엔드 개발',
        period: '2020-2026',
        visible: true,
      },
      {
        company: '우아한형제들',
        position: '주니어 개발',
        period: '2018-2020',
        visible: false,
      },
    ],
  },
  {
    mentorId: 3,
    nickname: '포폴메이커',
    headline: '토스 · 프로덕트 디자이너 5년',
    mentoringPoints: '프로젝트 서사와 문제-해결 흐름을 강화합니다.',
    category: 'PORTFOLIO',
    durationMin: 50,
    rating: 5.0,
    reviewCount: 210,
    profileVisible: true,
    mosaicEnabled: false,
    mosaicBlur: 0,
    hasImage: true,
    nextAvailableDate: '2026-07-18',
    introduction:
      '핀테크 프로덕트 디자이너로 포트폴리오의 스토리라인을 설계하는 것을 돕습니다.',
    careers: [
      {
        company: '토스',
        position: '프로덕트 디자이너',
        period: '2021-2026',
        visible: true,
      },
    ],
  },
  {
    mentorId: 4,
    nickname: '익명멘토A',
    headline: '대기업 인사팀 · 채용 담당',
    mentoringPoints: '실제 서류 평가 기준으로 냉정하게 봐드립니다.',
    category: 'PERSONAL_STATEMENT',
    durationMin: 30,
    rating: 4.5,
    reviewCount: 41,
    profileVisible: false,
    mosaicEnabled: false,
    mosaicBlur: 0,
    hasImage: true,
    nextAvailableDate: '2026-07-12',
    introduction:
      '현직 채용 담당자입니다. 신원 노출이 어려워 익명으로 진행하지만, 평가자 관점을 그대로 전달합니다.',
    careers: [
      {
        company: '대기업',
        position: '채용 담당',
        period: '2017-2026',
        visible: false,
      },
    ],
  },
  {
    mentorId: 5,
    nickname: '스타트업PM',
    headline: '시리즈B 스타트업 · PM 4년',
    mentoringPoints: '경험을 임팩트 중심으로 재구성합니다.',
    category: 'RESUME',
    durationMin: 50,
    rating: 4.3,
    reviewCount: 28,
    profileVisible: true,
    mosaicEnabled: true,
    mosaicBlur: 10,
    hasImage: true,
    nextAvailableDate: null,
    introduction:
      '작은 팀에서 다역할을 경험한 PM입니다. 스타트업 지원자의 이력을 강점화합니다.',
    careers: [
      {
        company: '스타트업',
        position: '프로덕트 매니저',
        period: '2022-2026',
        visible: true,
      },
      {
        company: '컨설팅펌',
        position: '애널리스트',
        period: '2020-2022',
        visible: true,
      },
    ],
  },
  {
    mentorId: 6,
    nickname: '디자인리드',
    headline: '쿠팡 · UX 리드 8년',
    mentoringPoints: '케이스 스터디 구성과 시각 위계를 봅니다.',
    category: 'PORTFOLIO',
    durationMin: 30,
    rating: 4.8,
    reviewCount: 134,
    profileVisible: true,
    mosaicEnabled: false,
    mosaicBlur: 0,
    hasImage: false,
    nextAvailableDate: '2026-07-13',
    introduction:
      '이커머스 UX 리드로 포트폴리오의 논리와 밀도를 함께 점검합니다.',
    careers: [
      {
        company: '쿠팡',
        position: 'UX 리드',
        period: '2018-2026',
        visible: true,
      },
    ],
  },
  {
    mentorId: 7,
    nickname: '취업연구소',
    headline: '컨설팅 · 커리어 코치 10년',
    mentoringPoints: '지원 전략과 자소서 방향을 함께 잡습니다.',
    category: 'PERSONAL_STATEMENT',
    durationMin: 50,
    rating: 4.6,
    reviewCount: 77,
    profileVisible: true,
    mosaicEnabled: false,
    mosaicBlur: 0,
    hasImage: true,
    nextAvailableDate: '2026-07-20',
    introduction:
      '커리어 코치로 지원 전략 수립과 자소서 컨설팅을 함께 진행합니다.',
    careers: [
      {
        company: '커리어컨설팅',
        position: '수석 코치',
        period: '2016-2026',
        visible: true,
      },
    ],
  },
  {
    mentorId: 8,
    nickname: '현직개발자',
    headline: '배민 · 프론트엔드 5년',
    mentoringPoints: '기술 이력서의 프로젝트 서술을 다듬습니다.',
    category: 'RESUME',
    durationMin: 30,
    rating: 4.2,
    reviewCount: 15,
    profileVisible: true,
    mosaicEnabled: true,
    mosaicBlur: 4,
    hasImage: true,
    nextAvailableDate: '2026-07-10',
    introduction:
      '프론트엔드 개발자로 기술 이력서의 성과 표현을 채용 관점에서 봅니다.',
    careers: [
      {
        company: '우아한형제들',
        position: '프론트엔드',
        period: '2021-2026',
        visible: true,
      },
    ],
  },
  {
    mentorId: 9,
    nickname: '익명멘토B',
    headline: '외국계 · 마케팅 매니저',
    mentoringPoints: '브랜드/퍼포먼스 경험을 정리합니다.',
    category: 'PORTFOLIO',
    durationMin: 50,
    rating: 3.9,
    reviewCount: 8,
    profileVisible: false,
    mosaicEnabled: false,
    mosaicBlur: 0,
    hasImage: false,
    nextAvailableDate: null,
    introduction:
      '외국계 마케팅 매니저입니다. 익명으로 진행하며 마케팅 포트폴리오를 봐드립니다.',
    careers: [
      {
        company: '외국계',
        position: '마케팅 매니저',
        period: '2019-2026',
        visible: false,
      },
    ],
  },
  {
    mentorId: 10,
    nickname: '데이터멘토',
    headline: '라인 · 데이터 분석 6년',
    mentoringPoints: '분석 프로젝트를 성과 스토리로 재구성합니다.',
    category: 'RESUME',
    durationMin: 50,
    rating: 4.4,
    reviewCount: 53,
    profileVisible: true,
    mosaicEnabled: false,
    mosaicBlur: 0,
    hasImage: true,
    nextAvailableDate: '2026-07-16',
    introduction:
      '데이터 분석가로 분석 경험을 채용 관점의 성과 서술로 바꾸도록 돕습니다.',
    careers: [
      {
        company: '라인',
        position: '데이터 분석',
        period: '2020-2026',
        visible: true,
      },
    ],
  },
  {
    mentorId: 11,
    nickname: '자소서코치',
    headline: '공기업 · 인사 7년',
    mentoringPoints: '공기업 자소서 항목별 대응을 봅니다.',
    category: 'PERSONAL_STATEMENT',
    durationMin: 30,
    rating: 4.1,
    reviewCount: 22,
    profileVisible: true,
    mosaicEnabled: true,
    mosaicBlur: 8,
    hasImage: true,
    nextAvailableDate: '2026-07-15',
    introduction:
      '공기업 인사 경험을 바탕으로 NCS·자소서 항목 대응을 도와드립니다.',
    careers: [
      {
        company: '공기업',
        position: '인사',
        period: '2018-2026',
        visible: true,
      },
    ],
  },
  {
    mentorId: 12,
    nickname: '포폴클리닉',
    headline: '당근 · 프로덕트 디자이너 4년',
    mentoringPoints: '주니어 포트폴리오의 첫인상을 강화합니다.',
    category: 'PORTFOLIO',
    durationMin: 30,
    rating: 4.0,
    reviewCount: 0,
    profileVisible: true,
    mosaicEnabled: false,
    mosaicBlur: 0,
    hasImage: false,
    nextAvailableDate: null,
    introduction:
      '주니어 디자이너의 첫 포트폴리오가 잘 읽히도록 구성을 함께 정리합니다.',
    careers: [
      {
        company: '당근',
        position: '프로덕트 디자이너',
        period: '2022-2026',
        visible: true,
      },
    ],
  },
  {
    mentorId: 13,
    nickname: '이력서멘토',
    headline: '삼성 · HRD 9년',
    mentoringPoints: '대기업 지원 이력서 표준화를 봅니다.',
    category: 'RESUME',
    durationMin: 30,
    rating: 4.85,
    reviewCount: 160,
    profileVisible: true,
    mosaicEnabled: false,
    mosaicBlur: 0,
    hasImage: true,
    nextAvailableDate: '2026-07-19',
    introduction:
      '대기업 HRD 경험으로 대기업 채용 기준에 맞춘 이력서 정리를 돕습니다.',
    careers: [
      { company: '삼성', position: 'HRD', period: '2017-2026', visible: true },
    ],
  },
  {
    mentorId: 14,
    nickname: '기획자J',
    headline: '무신사 · 서비스 기획 5년',
    mentoringPoints: '경험을 문항 의도에 맞게 배치합니다.',
    category: 'PERSONAL_STATEMENT',
    durationMin: 50,
    rating: 4.65,
    reviewCount: 64,
    profileVisible: true,
    mosaicEnabled: true,
    mosaicBlur: 6,
    hasImage: true,
    nextAvailableDate: '2026-07-17',
    introduction:
      '커머스 서비스 기획자로 자소서 문항 의도에 맞춘 경험 배치를 함께 설계합니다.',
    careers: [
      {
        company: '무신사',
        position: '서비스 기획',
        period: '2021-2026',
        visible: true,
      },
    ],
  },
];

/** 리스트 카드 목록 — size=9 기준 2페이지 이상. */
export const LIVE_MENTOR_CARDS: LiveMentorCard[] = MENTOR_SEEDS.map((seed) => {
  const durations = durationsFor(seed);
  return {
    mentorId: seed.mentorId,
    nickname: seed.nickname,
    profileImage: imageFor(seed),
    profileVisible: seed.profileVisible,
    mosaicEnabled: seed.mosaicEnabled,
    mosaicBlur: seed.mosaicBlur,
    headline: seed.headline,
    mentoringPoints: seed.mentoringPoints,
    categories: categoriesFor(seed),
    durations,
    price: getLowestPrice(durations),
    rating: seed.rating,
    reviewCount: seed.reviewCount,
    ...periodFor(seed),
  };
});

const REVIEW_CONTENTS = [
  '군더더기 없이 핵심만 짚어주셔서 방향이 확실해졌어요.',
  '제가 놓친 강점을 발견해 주셔서 큰 도움이 됐습니다.',
  '50분이 짧게 느껴질 만큼 알찬 피드백이었어요.',
  '실제 평가 기준으로 봐주셔서 현실감이 있었습니다.',
  '문장 구조를 바로 고쳐주셔서 바로 적용할 수 있었어요.',
];

const REVIEW_NAMES = ['김**', '이**', '박**', '최**', '정**'];

/** 멘토별 후기 파생 — reviewCount에 비례하되 최대 4건까지만 목으로 노출. */
function reviewsFor(seed: MentorSeed): LiveMentoringReview[] {
  const count = Math.min(seed.reviewCount, 4);
  return Array.from({ length: count }, (_, i) => ({
    reviewId: seed.mentorId * 100 + i + 1,
    menteeName: REVIEW_NAMES[i % REVIEW_NAMES.length],
    score: Math.max(3, Math.min(5, Math.round(seed.rating) - (i % 2))),
    content: REVIEW_CONTENTS[i % REVIEW_CONTENTS.length],
    createdAt: `2026-0${6 - (i % 2)}-1${(seed.mentorId + i) % 9}`,
  }));
}

export const REVIEWS_BY_MENTOR: Record<number, LiveMentoringReview[]> =
  Object.fromEntries(
    MENTOR_SEEDS.map((seed) => [seed.mentorId, reviewsFor(seed)]),
  );

/** 시드 + 카테고리 기본 템플릿으로 상세 템플릿 파생 */
function templateFor(seed: MentorSeed): LiveMentoringTemplate {
  const base = CATEGORY_TEMPLATE_DEFAULTS[seed.category];
  return {
    category: seed.category,
    faq: base.faq,
    process: base.process,
    submissionSpec: base.submissionSpec,
    checklist: base.checklist,
    introduction: seed.introduction,
    careers: seed.careers,
    mentoringPoints: seed.mentoringPoints,
    reviews: {
      visible: seed.reviewCount > 0,
      selectedReviewIds: reviewsFor(seed).map((r) => r.reviewId),
    },
  };
}

/** 멘토 상세(+reviews) — mentorId로 조회. */
export const LIVE_MENTOR_DETAILS: Record<number, LiveMentorDetail> =
  Object.fromEntries(
    MENTOR_SEEDS.map((seed) => [
      seed.mentorId,
      {
        mentorId: seed.mentorId,
        categories: categoriesFor(seed),
        durations: durationsFor(seed),
        price: getLowestPrice(durationsFor(seed)),
        rating: seed.rating,
        reviewCount: seed.reviewCount,
        ...periodFor(seed),
        profile: {
          visible: seed.profileVisible,
          mosaicEnabled: seed.mosaicEnabled,
          mosaicBlur: seed.mosaicBlur,
          nickname: seed.nickname,
          profileImage: imageFor(seed),
          introduction: seed.introduction,
          careers: seed.careers,
        },
        template: templateFor(seed),
        reviews: reviewsFor(seed),
      } satisfies LiveMentorDetail,
    ]),
  );

// ─────────────────────────────────────────────────────────────
// 멘토 마이페이지 목 — "나"(mentorId 1) 기준 (PRD §5 S3-a/b/c/d)
// ─────────────────────────────────────────────────────────────

/** 로그인 멘토로 간주하는 시드 mentorId */
const MY_MENTOR_ID = 1;

const mySeed = MENTOR_SEEDS[0];

/** GET /mentor/live-mentoring/settings — 오픈 설정(메타) 기본값. 오픈은 하나. */
export const LIVE_MENTORING_SETTINGS: LiveMentoringSettings = {
  profileVisible: mySeed.profileVisible,
  mosaicEnabled: mySeed.mosaicEnabled,
  mosaicBlur: mySeed.mosaicBlur,
  nickname: mySeed.nickname,
  profileImage: imageFor(mySeed),
  introduction: mySeed.introduction,
  careers: mySeed.careers,
  categories: categoriesFor(mySeed),
  durations: durationsFor(mySeed),
  ...periodFor(mySeed),
};

/** GET /mentor/live-mentoring/template — "나"의 선택 타입 기본 템플릿 + 편집분. */
export const LIVE_MENTORING_TEMPLATE: LiveMentoringTemplate =
  LIVE_MENTOR_DETAILS[MY_MENTOR_ID].template;

/** GET /mentor/live-mentoring/settlement — 정산 현황(read-only). */
export const SETTLEMENT_ROWS: SettlementRow[] = [
  {
    period: '2026-06',
    completedCount: 18,
    grossAmount: 1080000,
    status: 'PAID',
  },
  {
    period: '2026-05',
    completedCount: 12,
    grossAmount: 720000,
    status: 'PAID',
  },
  {
    period: '2026-04',
    completedCount: 9,
    grossAmount: 540000,
    status: 'PENDING',
  },
];

/**
 * GET /mentor/live-mentoring/open-status — 오픈 현황(read-only).
 * 오픈은 하나만 가능하므로 현재 오픈된 단일 건을 표시한다.
 */
export const OPEN_STATUS_ROWS: OpenStatusRow[] = [
  {
    categories: categoriesFor(mySeed),
    durations: durationsFor(mySeed),
    price: getLowestPrice(durationsFor(mySeed)),
    ...periodFor(mySeed),
    status: 'OPEN',
    reservationCount: 10,
  },
];
