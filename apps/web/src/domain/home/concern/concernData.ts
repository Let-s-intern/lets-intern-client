import { SHOW_LIVE_MENTORING_NAV } from '@/domain/live-mentoring/constants';

/**
 * 고민 패널의 카드 하나 = 취준 여정 카테고리 하나 (domain/career-journey/journeyNav.ts 의 slug).
 * 이동은 메뉴와 같다: 어드민이 지정한 바로 갈 상품이 있으면 상세, 없으면 카테고리 랜딩
 */
export interface ConcernAction {
  title: string;
  quote: string;
  meta: string;
  cta: string;
  slug: string;
  /** 카테고리 랜딩이 아닌 곳으로 갈 때만. 없으면 slug 로 이동처를 정한다 */
  href?: string;
}

export interface Concern {
  id: string;
  label: string;
  headline: string;
  keywords: string;
  panelTitle: string;
  panelDescription: string;
  actions: ConcernAction[];
  /** true 면 actions 를 칩으로 하나씩 고른다 (직무 특화) */
  chips?: boolean;
  /** 칩으로 고른 카드 옆에 늘 함께 두는 카드 */
  fixedAction?: ConcernAction;
}

/** 직무 특화·면접 패널이 함께 쓰는 1:1 LIVE 멘토링 카드. 멘토링 출시 전에는 두지 않는다 */
const LIVE_MENTORING_ACTION: ConcernAction | undefined = SHOW_LIVE_MENTORING_NAV
  ? {
      title: '1:1 LIVE 멘토링',
      quote: '"현직자에게 직접 물어보고 싶어요"',
      meta: '현직자 1:1 LIVE 멘토링 · 30분/60분',
      cta: 'LIVE 멘토링 시작하기',
      slug: 'live-mentoring',
      href: '/live-mentoring',
    }
  : undefined;

export const CONCERNS: Concern[] = [
  {
    id: 'experience',
    label: '경험정리',
    headline: '경험이 정리가\n안 돼요',
    keywords: '경험 정리 · 역량 키워드',
    panelTitle: '경험정리, 뭐부터 해야할까요?',
    panelDescription: '서류를 쓰기 전, 내 경험을 역량 키워드로 먼저 정리해요.',
    actions: [
      {
        title: '경험정리',
        quote: '"뭘 했는지는 아는데, 뭐라고 써야 할지 모르겠어요"',
        meta: '경험정리 챌린지 · 경험정리 가이드북 · 무료 템플릿',
        cta: '경험정리 준비 시작하기',
        slug: 'experience',
      },
    ],
  },
  {
    id: 'document',
    label: '서류 작성',
    headline: '서류를 어떻게\n써야 할지 모르겠어요',
    keywords: '이력서 · 자소서 · 포트폴리오',
    panelTitle: '어떤 서류를 준비하고 있나요?',
    panelDescription: '지원 서류 3종 중 지금 준비할 서류를 선택해보세요.',
    actions: [
      {
        title: '이력서',
        quote: '"경험 나열만 하고 있어요"',
        meta: '이력서 완성 챌린지 · VOD · 1:1 첨삭 LIVE',
        cta: '이력서 준비 시작하기',
        slug: 'resume',
      },
      {
        title: '자기소개서',
        quote: '"지원동기가 매번 뻔해요"',
        meta: '자소서 10일 완성 챌린지 · 가이드북',
        cta: '자기소개서 준비 시작하기',
        slug: 'personal-statement',
      },
      {
        title: '포트폴리오',
        quote: '"뭘 넣고 뭘 빼야 할지 모르겠어요"',
        meta: '포트폴리오 챌린지 · 직무별 예시',
        cta: '포트폴리오 준비 시작하기',
        slug: 'portfolio',
      },
    ],
  },
  {
    id: 'large-corp',
    label: '대기업',
    headline: '대기업 공채가\n처음이에요',
    keywords: '대기업 자소서 · 인적성',
    panelTitle: '대기업 취업, 무엇부터 준비해야 할까요?',
    panelDescription: '자소서부터 인적성까지, 필요한 준비를 시작해보세요.',
    actions: [
      {
        title: '대기업 자기소개서',
        quote: '"기업마다 다른 자소서 문항이 막막해요"',
        meta: '대기업 자소서 챌린지 · 현직자 멘토링',
        cta: '대기업 자소서 준비하기',
        slug: 'large-corp',
      },
      {
        title: '인적성',
        quote: '"서류 붙고 나니 인적성이 걱정돼요"',
        meta: '인적성 챌린지 · 기출 자료 · 현직자 멘토링',
        cta: '인적성 준비하기',
        slug: 'aptitude',
      },
    ],
  },
  {
    id: 'interview',
    label: '면접',
    headline: '면접만 가면\n떨어져요',
    keywords: '예상 질문 · 답변 준비',
    panelTitle: '면접, 어떻게 준비해야 할까요?',
    panelDescription: '답변 준비부터 실전 연습까지 차근차근 시작해보세요.',
    actions: [
      {
        title: '면접',
        quote: '"1분 자기소개부터 막혀요"',
        meta: '면접 LIVE 클래스 · 모의면접 · 면접 VOD',
        cta: '면접 준비 시작하기',
        slug: 'interview',
      },
    ],
    fixedAction: LIVE_MENTORING_ACTION,
  },
  {
    id: 'job',
    label: '직무 특화',
    headline: '직무에 맞춰\n준비하고 싶어요',
    keywords: 'HR · 마케팅 · PM/PO',
    panelTitle: '어떤 직무를 준비하고 있나요?',
    panelDescription: '관심 있는 직무를 선택해 관련 준비를 살펴보세요.',
    actions: [
      {
        title: 'HR',
        quote: '"인사 직무가 정확히 뭘 하는지 궁금해요"',
        meta: 'HR 직무 서류 완성 올인원 챌린지',
        cta: 'HR 직무 준비 시작하기',
        slug: 'hr',
      },
      {
        title: '마케팅',
        quote: '"마케팅 경험을 어떻게 보여줄까요?"',
        meta: '마케팅 서류 완성 올인원 챌린지',
        cta: '마케팅 직무 준비 시작하기',
        slug: 'marketing',
      },
      {
        title: 'PM/PO',
        quote: '"기획 직무 포트폴리오가 막막해요"',
        meta: 'PM/서비스기획 서류 완성 챌린지',
        cta: 'PM/PO 직무 준비 시작하기',
        slug: 'pm',
      },
    ],
    chips: true,
    fixedAction: LIVE_MENTORING_ACTION,
  },
];
