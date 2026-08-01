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

/**
 * 진행시간(분). 가격을 결정하는 유일한 변수.
 * 백엔드 `LiveMentoringDuration` enum(`MINUTES_30(30)`, `MINUTES_60(60)`) 기준 — 50이 아니라 60이다.
 */
export type LiveMentoringDuration = 30 | 60;

export const LIVE_MENTORING_CATEGORIES: readonly LiveMentoringCategory[] = [
  'PERSONAL_STATEMENT',
  'RESUME',
  'PORTFOLIO',
] as const;

export const LIVE_MENTORING_DURATIONS: readonly LiveMentoringDuration[] = [
  30, 60,
] as const;

/**
 * 상품 상태 — 백엔드 `LiveMentoringStatus`.
 * 편집 가능한 상태는 `DRAFT`·`REJECTED` 이고, 공개 노출은 `APPROVED` 뿐이다.
 */
export type LiveMentoringStatus =
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'INACTIVE';

/** 모자이크 블러 기본값(중간 정도). 슬라이더 범위 0~20 기준. */
export const DEFAULT_MOSAIC_BLUR = 10;

/**
 * 진행시간 → 고정 가격. 멘토가 입력하지 않으며 카테고리·등급 등 다른 변수는 없다.
 * 30분 = 35,000원 / 60분 = 60,000원 (운영팀 소관, 이번엔 고정).
 */
export const PRICE_BY_DURATION: Record<LiveMentoringDuration, number> = {
  30: 35000,
  60: 60000,
};

/** 진행시간에 해당하는 고정 가격을 반환한다. */
export function getPriceByDuration(durationMin: LiveMentoringDuration): number {
  return PRICE_BY_DURATION[durationMin];
}

/**
 * 여러 진행시간이 선택된 경우 웹에는 **가장 낮은 금액**을 노출한다.
 * (30분 35,000 < 60분 60,000 이므로 사실상 최소 진행시간의 가격)
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

/** 노출 토글이 있는 섹션의 공통 골격 (시안 3·4·5). */
interface SectionWithVisible {
  visible: boolean;
  title: string;
  subtitle: string;
}

/**
 * 상세 페이지 템플릿 — 시안 10개 섹션 중 멘토가 편집하는 1~5번 + 고정 섹션.
 * 6·9·10(플랜·다른 멘토·모집개요)은 오픈 설정·목록 API 에서 파생되므로 담지 않는다.
 */
export interface LiveMentoringTemplate {
  category: LiveMentoringCategory;

  // --- 멘토 편집 영역 (시안 0~5) ---
  /** 시안 0 · 히어로 불릿 */
  hero: { bullets: string[] };
  /** 시안 1 · 멘토 소개 */
  intro: {
    passedCount: number | null;
    profileImage: string | null;
    affiliation: string;
    careerLines: string[];
    oneLiner: string;
  };
  /** 시안 2 · 멘토링 유형 */
  mentoringTypes: {
    title: string;
    subtitle: string;
    items: {
      typeName: string;
      title: string;
      description: string;
      tags: string[];
    }[];
  };
  /** 시안 3 · 취업 성공 전략 */
  strategy: SectionWithVisible & {
    points: { image: string | null; title: string; description: string }[];
  };
  /** 시안 4 · 이렇게 도와드려요(영상) */
  video: SectionWithVisible & { videoUrl: string | null; caption: string };
  /** 시안 5 · 결과 사례(Before/After) */
  results: SectionWithVisible & {
    cases: {
      beforeImage: string | null;
      afterImage: string | null;
      beforeCaption: string;
      afterCaption: string;
    }[];
  };

  // --- 편집 불가 ---
  /** 시안 8 · 후기 노출 제어 */
  reviews: { visible: boolean; selectedReviewIds: number[] };
  /*
   * 시안 7(진행 프로세스)·10(FAQ)은 계약에 없다.
   * 운영 확정 문구라 웹 상세 페이지에 하드코딩한다 — 목도 내려주지 않는다.
   */
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

/** 멘토가 참여 중인 챌린지 (공개 상세 하단 노출용) */
export interface LiveMentorChallenge {
  challengeId: number;
  title: string;
  thumbnail: string | null;
}

/** 멘토 상세 (상세 페이지 렌더용, +reviews) (PRD §4.3) */
export interface LiveMentorDetail {
  mentorId: number;
  /** 상품명 — 히어로 제목. */
  title: string;
  categories: LiveMentoringCategory[];
  durations: LiveMentoringDuration[];
  /** 진행시간별 판매가 — 히어로 플랜 옵션이 이 값을 그대로 쓴다. */
  durationPrices: { duration: LiveMentoringDuration; price: number }[];
  /** 여러 진행시간을 열었을 때의 최저가(대표 표시용). */
  price: number;
  rating: number;
  reviewCount: number;
  feedbackStartDate: string;
  feedbackEndDate: string;
  profile: LiveMentorProfile;
  template: LiveMentoringTemplate;
  reviews: LiveMentoringReview[];
  /** 이 멘토가 참여 중인 챌린지. */
  challenges: LiveMentorChallenge[];
}

/**
 * 오픈 설정 화면에서 보여주는 경력 1건 — 백엔드 `UserCareerVo` 형태를 그대로 따른다.
 * 공개 상세 페이지용 `LiveMentoringCareer`(company/position/period/visible)와는 다른 타입이다:
 * 이 필드들은 프로필(UserCareer) 도메인이 소유하며 오픈 설정 화면은 참조만 한다 — 수정 불가.
 */
export interface LiveMentoringSettingsCareer {
  id: number;
  company: string | null;
  field: string | null;
  job: string | null;
  position: string | null;
  department: string | null;
  employmentType: string | null;
  /** YearMonth 형식, 예: "2020-01" */
  startDate: string | null;
  endDate: string | null;
  isAddedByAdmin: boolean;
  /**
   * 대표 경력 여부. 멘토당 최대 1건만 true 이며, 한 번도 지정하지 않았으면 전부 false 다.
   * 이 경력이 공개 리스트 멘토 카드에 노출된다
   * (지정: `PATCH /user-career/my/{careerId}/representative`).
   */
  isRepresentative: boolean;
}

/**
 * 상품 설정 — 백엔드 `GetLiveMentoringSettingsResponseDto`.
 *
 * `상품 1 : 개설 N` 분리 이후 이 응답은 **상품 정보만** 담는다.
 * 개설에 딸린 값(오픈 여부·진행시간·피드백 기간)은 개설 이력(`OpeningHistoryItem`)에 있다.
 * `nickname/profileImage/introduction/careers`는 프로필 도메인에서 참조만 해오는 읽기 전용 필드 —
 * 이 오픈 설정 화면에서 수정할 수 없다(수정은 프로필 페이지에서).
 */
export interface LiveMentoringSettings {
  /** 상품 식별자. 상품을 한 번도 저장하지 않았으면 null. */
  liveMentoringId: number | null;
  nickname: string | null;
  profileImage: string | null;
  introduction: string | null;
  careers: LiveMentoringSettingsCareer[];
  /** 1대1 멘토링 타이틀(상품명). 상품을 한 번도 저장하지 않았으면 null. */
  title: string | null;
  /** 상품 상태. 상품이 없어도 서버가 `DRAFT` 로 채워 주므로 null 이 아니다. */
  status: LiveMentoringStatus;
  categories: LiveMentoringCategory[];
}

/** 정산 현황 행 — 기간별 합계 (PRD §4.6, read-only) */
export interface SettlementRow {
  period: string;
  completedCount: number;
  grossAmount: number;
  status: 'PENDING' | 'PAID';
}

/** 개별 정산 내역 — 완료된 멘토링 건별 (read-only) */
export interface SettlementItem {
  settlementId: number;
  date: string;
  menteeName: string;
  category: LiveMentoringCategory;
  durationMin: LiveMentoringDuration;
  amount: number;
  status: 'PENDING' | 'PAID';
}

/** 오픈 현황 행 (PRD §4.7, read-only). 오픈은 하나만 가능. */
export interface OpenStatusRow {
  title: string;
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

/** 카테고리별 대표 챌린지 제목(공개 상세 하단 "참여 중인 챌린지"용 목). */
const CHALLENGE_TITLE_BY_CATEGORY: Record<LiveMentoringCategory, string> = {
  PERSONAL_STATEMENT: '자기소개서 완성 챌린지',
  RESUME: '이력서 완성 챌린지',
  PORTFOLIO: '포트폴리오 완성 챌린지',
};

/** 시드가 참여 중인 챌린지(다중 타입이면 각 타입별 대표 챌린지). */
function challengesFor(seed: MentorSeed): LiveMentorChallenge[] {
  return categoriesFor(seed).map((category, i) => ({
    challengeId: seed.mentorId * 10 + i,
    title: CHALLENGE_TITLE_BY_CATEGORY[category],
    thumbnail: null,
  }));
}

/**
 * 멘토 시드 — 12명 이상(size=9 기준 2페이지 이상), 카테고리·30/60분·평점(0~5)·
 * 후기 수 분포를 다양화. 모자이크/프로필 비노출 케이스도 섞는다.
 */
const MENTOR_SEEDS: MentorSeed[] = [
  {
    mentorId: 1,
    nickname: '자소서장인',
    headline: '네이버 · 서비스 기획',
    mentoringPoints: '두괄식 구조와 경험 소재 발굴 위주로 봅니다.',
    category: 'PERSONAL_STATEMENT',
    durationMin: 60,
    // 다중 타입·진행시간 오픈 예시 → 웹에는 최저가(30분 35,000원)로 노출.
    categories: ['PERSONAL_STATEMENT', 'RESUME'],
    durations: [30, 60],
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
    headline: '카카오 · 백엔드 개발',
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
    headline: '토스 · 프로덕트 디자이너',
    mentoringPoints: '프로젝트 서사와 문제-해결 흐름을 강화합니다.',
    category: 'PORTFOLIO',
    durationMin: 60,
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
    headline: '시리즈B 스타트업 · PM',
    mentoringPoints: '경험을 임팩트 중심으로 재구성합니다.',
    category: 'RESUME',
    durationMin: 60,
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
    headline: '쿠팡 · UX 리드',
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
    headline: '컨설팅 · 커리어 코치',
    mentoringPoints: '지원 전략과 자소서 방향을 함께 잡습니다.',
    category: 'PERSONAL_STATEMENT',
    durationMin: 60,
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
    headline: '배민 · 프론트엔드',
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
    durationMin: 60,
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
    headline: '라인 · 데이터 분석',
    mentoringPoints: '분석 프로젝트를 성과 스토리로 재구성합니다.',
    category: 'RESUME',
    durationMin: 60,
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
    headline: '공기업 · 인사',
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
    headline: '당근 · 프로덕트 디자이너',
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
    headline: '삼성 · HRD',
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
    headline: '무신사 · 서비스 기획',
    mentoringPoints: '경험을 문항 의도에 맞게 배치합니다.',
    category: 'PERSONAL_STATEMENT',
    durationMin: 60,
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
  '60분이 짧게 느껴질 만큼 알찬 피드백이었어요.',
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
/** 시안 2 · 카테고리별 멘토링 유형 카드 기본값. 멘토가 연 타입 수만큼 만든다. */
const MENTORING_TYPE_DEFAULTS: Record<
  LiveMentoringCategory,
  LiveMentoringTemplate['mentoringTypes']['items'][number]
> = {
  PERSONAL_STATEMENT: {
    typeName: '자기소개서 피드백',
    title: '지원 직무에 맞게\n자기소개서를 다듬고 싶다면',
    description:
      '문항 의도에 맞는 답변 방향, 경험 구조화,\n설득력 있는 표현까지 함께 점검할 수 있어요.',
    tags: ['문항 분석', '경험 정리', '표현 개선'],
  },
  RESUME: {
    typeName: '이력서 피드백',
    title: '내 경험이 강점으로 보이도록\n이력서를 정리하고 싶다면',
    description:
      '실무자 관점에서 경험과 역량이 더 잘 보이도록\n이력서 구성을 점검할 수 있어요.',
    tags: ['경험 정리', '역량 강조', '실무자 피드백'],
  },
  PORTFOLIO: {
    typeName: '포트폴리오 피드백',
    title: '포트폴리오에서 핵심 역량이\n잘 드러나는지 점검받고 싶다면',
    description:
      '프로젝트의 핵심 역할과 문제 해결 과정이 잘 드러나도록\n포트폴리오 구성을 점검할 수 있어요.',
    tags: ['구성 점검', '역량 강조', '프로젝트 정리'],
  },
};

/**
 * 상품명(1:1 멘토링 타이틀).
 * 목록 카드·상세 히어로가 **같은 문자열**을 써야 하므로 한 곳에서 만든다.
 * (`headline` 은 "네이버 · 서비스 기획 7년" 같은 경력 한 줄이라 상품명이 아니다.)
 */
export function mentoringTitleFor(seed: Pick<MentorSeed, 'nickname'>): string {
  return `${seed.nickname}의 1:1 멘토링`;
}

/**
 * 결과 사례(Before/After) 자리 이미지.
 * 시드+슬롯으로 seed 를 고정해 새로고침해도 같은 그림이 나오게 한다.
 */
function resultImage(seed: MentorSeed, slot: string): string {
  return `https://picsum.photos/seed/lm-${seed.mentorId}-${slot}/640/420`;
}

/** 시드의 경력 배열 → 시안 1의 자유 텍스트 줄. */
function careerLinesFor(seed: MentorSeed): string[] {
  return seed.careers
    .filter((career) => career.visible)
    .map(
      (career) => `${career.company} | ${career.position} (${career.period})`,
    );
}

function templateFor(seed: MentorSeed): LiveMentoringTemplate {
  const hasImage = seed.hasImage;
  return {
    category: seed.category,

    hero: {
      bullets: [
        '이력서, 자기소개서, 포트폴리오 피드백 및 첨삭',
        '다양한 커리어 고민에 대한 자유로운 QNA',
        '사이드 프로젝트 기획, 진행, 성과 만드는 방법',
      ],
    },

    intro: {
      // 짝수 mentorId 는 합격자 수 미입력 상태를 만들어 헤드라인 폴백을 확인할 수 있게 한다.
      passedCount: seed.mentorId % 2 === 1 ? 30 + seed.mentorId * 7 : null,
      profileImage: imageFor(seed),
      affiliation: seed.careers[0]
        ? `${seed.careers[0].company} | ${seed.careers[0].position}`
        : '',
      careerLines: careerLinesFor(seed),
      oneLiner: seed.introduction,
    },

    mentoringTypes: {
      title: `${seed.nickname} 멘토에게 이런 도움을 받을 수 있어요`,
      subtitle:
        '현재 고민에 맞는 멘토링 유형을 살펴보고, 필요한 도움을 받아보세요.',
      items: categoriesFor(seed).map(
        (category) => MENTORING_TYPE_DEFAULTS[category],
      ),
    },

    strategy: {
      // 이미지 없는 시드는 섹션을 꺼둬 "노출 안 하면 완전히 제외" 동작을 확인할 수 있게 한다.
      visible: hasImage,
      title: `${seed.nickname} 멘토만의 취업 성공 전략`,
      subtitle: '멘토링을 통해 다 알려드립니다.',
      points: [1, 2, 3].map((n) => ({
        image: hasImage
          ? `${PROFILE_IMAGE_BASE}/${200 + seed.mentorId}?v=${n}`
          : null,
        title: '2026년 취업 시장 핵심 키워드 5가지',
        description:
          '3,000개 이상의 이력서/포트폴리오/자소서를 피드백하여 쌓은 경험, 채용공고 분석을 통해 얻은 인사이트, 현직자 멘토의 최신 합격자들과의 만남을 통해 발견한 키워드를 알려드립니다.',
      })),
    },

    video: {
      visible: hasImage,
      title: `${seed.nickname} 멘토는 이렇게 도와드려요`,
      subtitle: '1:1 LIVE 멘토링, 영상으로 미리 확인하세요!',
      videoUrl: hasImage ? 'https://www.youtube.com/embed/dQw4w9WgXcQ' : null,
      caption: '라이브로 주고 받는 맞춤형 피드백으로, 서류 완성도 UP!',
    },

    results: {
      visible: true,
      title: `혼자 해결하기 어려웠던 부분을, ${seed.nickname} 멘토와 함께 완성해요`,
      subtitle: '결과 사례',
      cases: [
        {
          beforeImage: resultImage(seed, 'before-1'),
          afterImage: resultImage(seed, 'after-1'),
          beforeCaption: '누구나 쓸 수 있는 추상적인 지원동기',
          afterCaption: 'A사의 가치 기술과 관련된 경험 연결',
        },
        {
          beforeImage: resultImage(seed, 'before-2'),
          afterImage: resultImage(seed, 'after-2'),
          beforeCaption: '직무 경험을 구구절절 나열하는 방식',
          afterCaption: '직무 키워드 선정 후, 관련된 경험 구체화',
        },
      ],
    },

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
        title: mentoringTitleFor(seed),
        categories: categoriesFor(seed),
        durations: durationsFor(seed),
        durationPrices: durationsFor(seed).map((duration) => ({
          duration,
          price: getPriceByDuration(duration),
        })),
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
        challenges: challengesFor(seed),
      } satisfies LiveMentorDetail,
    ]),
  );

// ─────────────────────────────────────────────────────────────
// 멘토 마이페이지 목 — "나"(mentorId 1) 기준 (PRD §5 S3-a/b/c/d)
// ─────────────────────────────────────────────────────────────

/** 로그인 멘토로 간주하는 시드 mentorId */
const MY_MENTOR_ID = 1;

/**
 * 상품 식별자는 멘토 식별자와 겹치지 않도록 100 을 더해 만든다.
 * `상품 1 : 개설 N` 분리로 `mentorId`·`liveMentoringId`·`openingId` 세 값이 공존하게 됐고,
 * 값이 겹쳐 있으면 잘못된 id 를 넘기는 회귀가 목에서 드러나지 않는다.
 */
const LIVE_MENTORING_ID_OFFSET = 100;

/** "나"(mySeed)의 상품 식별자. */
export const MY_LIVE_MENTORING_ID = LIVE_MENTORING_ID_OFFSET + MY_MENTOR_ID;

const mySeed = MENTOR_SEEDS[0];

/** "나"(mySeed)의 경력을 오픈 설정 화면의 읽기 전용 `UserCareerVo` 형태로 변환한 목값. */
const MY_SETTINGS_CAREERS: LiveMentoringSettingsCareer[] = [
  {
    id: 1,
    company: '네이버',
    field: '서비스 기획',
    job: '기획',
    position: '서비스 기획',
    department: null,
    employmentType: '정규직',
    startDate: '2019-03',
    endDate: null,
    isAddedByAdmin: false,
    isRepresentative: true,
  },
  {
    id: 2,
    company: '라인',
    field: '서비스 기획',
    job: '기획',
    position: '기획 인턴',
    department: null,
    employmentType: '전환형 인턴',
    startDate: '2018-01',
    endDate: '2019-02',
    isAddedByAdmin: false,
    isRepresentative: false,
  },
];

/**
 * GET /mentor/live-mentoring/settings — 상품 설정 기본값.
 *
 * 기본 상태를 `DRAFT` 로 둬 오픈 설정·상세 설정을 편집 가능한 상태로 띄운다.
 * 개설 이력(`OPENING_HISTORY_ROWS`)에 활성 개설을 두지 않은 것도 같은 이유다 —
 * 서버 `LiveMentoring.startEditing()` 이 활성 개설이 있으면 `DRAFT` 로 되돌리지 못하게 막으므로
 * `DRAFT` + 활성 개설은 실서버가 만들 수 없는 조합이다.
 */
export const LIVE_MENTORING_SETTINGS: LiveMentoringSettings = {
  liveMentoringId: MY_LIVE_MENTORING_ID,
  nickname: mySeed.nickname,
  profileImage: imageFor(mySeed),
  introduction: mySeed.introduction,
  careers: MY_SETTINGS_CAREERS,
  title: '자소서 실전 첨삭 멘토링',
  status: 'DRAFT',
  /** 서버 `@Size(min = 1, max = 1)` 이라 상품 타입은 항상 1개다. */
  categories: [mySeed.category],
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
 * 오픈은 하나만 가능하므로 현재 OPEN 은 1건이며, 나머지는 과거 오픈 내역(CLOSED)이다.
 */
export const OPEN_STATUS_ROWS: OpenStatusRow[] = [
  {
    title: '자소서 실전 첨삭 멘토링',
    categories: categoriesFor(mySeed),
    durations: durationsFor(mySeed),
    price: getLowestPrice(durationsFor(mySeed)),
    ...periodFor(mySeed),
    status: 'OPEN',
    reservationCount: 10,
  },
  // 과거 오픈 내역
  {
    title: '자소서 첨삭 멘토링',
    categories: ['PERSONAL_STATEMENT'],
    durations: [60],
    price: getLowestPrice([60]),
    feedbackStartDate: '2026-06-10',
    feedbackEndDate: '2026-06-23',
    status: 'CLOSED',
    reservationCount: 12,
  },
  {
    title: '이력서 클리닉',
    categories: ['RESUME'],
    durations: [30, 60],
    price: getLowestPrice([30, 60]),
    feedbackStartDate: '2026-05-12',
    feedbackEndDate: '2026-05-25',
    status: 'CLOSED',
    reservationCount: 8,
  },
];

/** GET /mentor/live-mentoring/settlement — 개별 정산 내역(완료 건별, read-only). */
export const SETTLEMENT_ITEMS: SettlementItem[] = [
  {
    settlementId: 1,
    date: '2026-06-28',
    menteeName: '김**',
    category: 'PERSONAL_STATEMENT',
    durationMin: 60,
    amount: 60000,
    status: 'PAID',
  },
  {
    settlementId: 2,
    date: '2026-06-21',
    menteeName: '이**',
    category: 'RESUME',
    durationMin: 30,
    amount: 35000,
    status: 'PAID',
  },
  {
    settlementId: 3,
    date: '2026-06-14',
    menteeName: '박**',
    category: 'PERSONAL_STATEMENT',
    durationMin: 30,
    amount: 35000,
    status: 'PAID',
  },
  {
    settlementId: 4,
    date: '2026-04-30',
    menteeName: '최**',
    category: 'PORTFOLIO',
    durationMin: 60,
    amount: 60000,
    status: 'PENDING',
  },
];
