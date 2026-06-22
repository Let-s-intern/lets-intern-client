// 하반기 공채 13주 합격 플랜 — 매트릭스(단계×카테고리) + 월별 13주 타임라인의 단일 데이터 출처.
// 두 뷰(CoursePlanMatrix / CoursePlanTimeline)가 이 한 파일을 공유한다.
//
// 콘텐츠 원문은 PRD §9-5 확정 전이라 일부 셀/주차는 placeholder('곧 업데이트')로 둔다.
// 단, 매트릭스 차원(5단계×6카테고리)과 13주(WEEK 01~13) 구조는 완전하게 채운다.

/** 준비 단계 (매트릭스 가로축). STEP01~05. */
export type StepId = 'step01' | 'step02' | 'step03' | 'step04' | 'step05';

/** 준비 카테고리 (매트릭스 세로축). 6종. */
export type CategoryId =
  | 'industry'
  | 'qualification'
  | 'experience'
  | 'document'
  | 'aptitude'
  | 'interview';

/**
 * 수행 주체 라벨.
 * - self: 본인이 직접 (멤버십이 메우지 않는 구간)
 * - free: 무료 자료(워크북·가이드)
 * - challenge: 챌린지 = 멤버십이 함께하는 구간 (가치 증명의 핵심)
 */
export type Owner = 'self' | 'free' | 'challenge';

/** 준비 흐름의 큰 구간 — JUL–AUG 준비 / AUG–SEP 실전. */
export type Phase = 'prep' | 'live';

export interface Step {
  id: StepId;
  /** 표시 번호 (STEP 01 …) */
  no: string;
  /** 단계명 (방향 설정 …) */
  label: string;
  /** 이 단계가 속한 큰 구간 */
  phase: Phase;
}

export interface Category {
  id: CategoryId;
  label: string;
}

export interface MatrixCell {
  step: StepId;
  category: CategoryId;
  /** 해당 셀의 과업. 미확정이면 빈 문자열 → 뷰에서 placeholder 처리. */
  task: string;
  /** 수행 주체. 과업이 미확정이면 owner는 생략. */
  owner?: Owner;
}

export interface WeekItem {
  /** 1~13 연속 */
  week: number;
  /** 소속 월 */
  month: 'JUL' | 'AUG' | 'SEP';
  /** 주차 핵심 과업명 */
  title: string;
  /** 보조 설명 (미확정이면 빈 문자열) */
  desc: string;
  /** 이 주차의 주된 수행 주체(타임라인 색 강조용) */
  owner?: Owner;
}

export interface MonthGroup {
  month: 'JUL' | 'AUG' | 'SEP';
  /** 월 성격 라벨 (기반 다지기 / 서류 / 실전) */
  trait: string;
}

/** 수행 주체 범례 (라벨 + 색 토큰 키). 매트릭스·타임라인·범례가 공유. */
export interface OwnerLegend {
  owner: Owner;
  label: string;
  /** "이 주체가 무엇을 의미하는지" 한 줄 설명 (범례 보조 문구) */
  hint: string;
}

export const OWNER_LEGEND: OwnerLegend[] = [
  { owner: 'self', label: '직접', hint: '스스로 준비하는 구간' },
  { owner: 'free', label: '무료 자료', hint: '무료 워크북·가이드 제공' },
  {
    owner: 'challenge',
    label: '챌린지',
    hint: '멤버십이 함께하는 구간',
  },
];

export const STEPS: Step[] = [
  { id: 'step01', no: '01', label: '방향 설정', phase: 'prep' },
  { id: 'step02', no: '02', label: '기초 다지기', phase: 'prep' },
  { id: 'step03', no: '03', label: '서류 완성', phase: 'prep' },
  { id: 'step04', no: '04', label: '시험·실전', phase: 'live' },
  { id: 'step05', no: '05', label: '면접·최종', phase: 'live' },
];

export const CATEGORIES: Category[] = [
  { id: 'industry', label: '산업·기업 분석' },
  { id: 'qualification', label: '기본 자격' },
  { id: 'experience', label: '경험 정리' },
  { id: 'document', label: '서류 작성' },
  { id: 'aptitude', label: '인적성' },
  { id: 'interview', label: '면접 실전' },
];

/** 큰 구간 메타 (라벨 + 색 강조). */
export const PHASES: { id: Phase; label: string; range: string }[] = [
  { id: 'prep', label: '준비 단계', range: 'JUL–AUG' },
  { id: 'live', label: '실전 단계', range: 'AUG–SEP' },
];

// 매트릭스 셀 — 확정된 과업만 채우고 나머지는 placeholder(task='')로 둔다.
// 차원은 5×6 = 30셀 모두 존재해야 하므로, 헬퍼로 누락 셀을 빈 셀로 보충한다.
const DEFINED_CELLS: MatrixCell[] = [
  // STEP01 방향 설정
  {
    step: 'step01',
    category: 'industry',
    task: '산업 분석 · 기업 리서치',
    owner: 'challenge',
  },
  {
    step: 'step01',
    category: 'qualification',
    task: '영어 자격증 점검',
    owner: 'self',
  },
  {
    step: 'step01',
    category: 'experience',
    task: '커리어 방향 설정',
    owner: 'free',
  },
  // STEP02 기초 다지기
  {
    step: 'step02',
    category: 'qualification',
    task: '성적표 · 졸업증명 준비',
    owner: 'self',
  },
  {
    step: 'step02',
    category: 'experience',
    task: '경험 정리 챌린지',
    owner: 'challenge',
  },
  // STEP03 서류 완성
  {
    step: 'step03',
    category: 'document',
    task: '이력서 · 자기소개서 챌린지',
    owner: 'challenge',
  },
  {
    step: 'step03',
    category: 'industry',
    task: '지원 기업 직무 분석',
    owner: 'free',
  },
  // STEP04 시험·실전
  {
    step: 'step04',
    category: 'aptitude',
    task: '인적성 대비 챌린지',
    owner: 'challenge',
  },
  // STEP05 면접·최종
  {
    step: 'step05',
    category: 'interview',
    task: '면접 실전 챌린지',
    owner: 'challenge',
  },
];

/** placeholder 과업 카피 — 미확정 셀/주차 표시에 일관 사용. */
export const PLACEHOLDER_TASK = '곧 업데이트';

// 5×6 매트릭스 — DEFINED_CELLS 에 없는 (step,category) 조합은 빈 셀로 채워 차원을 보장.
export const MATRIX_CELLS: MatrixCell[] = STEPS.flatMap((step) =>
  CATEGORIES.map((category) => {
    const defined = DEFINED_CELLS.find(
      (cell) => cell.step === step.id && cell.category === category.id,
    );
    return defined ?? { step: step.id, category: category.id, task: '' };
  }),
);

/** (step, category) → MatrixCell 빠른 조회 맵 (뷰에서 O(1) 룩업). */
export const MATRIX_CELL_MAP = new Map<string, MatrixCell>(
  MATRIX_CELLS.map((cell) => [`${cell.step}:${cell.category}`, cell]),
);

export const matrixCellKey = (step: StepId, category: CategoryId): string =>
  `${step}:${category}`;

export const MONTH_GROUPS: MonthGroup[] = [
  { month: 'JUL', trait: '기반 다지기' },
  { month: 'AUG', trait: '서류 완성' },
  { month: 'SEP', trait: '실전·면접' },
];

// 13주 타임라인 — 확정 주차만 카피를 채우고 나머지는 placeholder.
// week 는 1~13 연속이어야 한다(테스트로 검증).
export const WEEKS: WeekItem[] = [
  {
    week: 1,
    month: 'JUL',
    title: '산업 분석',
    desc: '관심 산업 구조·트렌드 파악',
    owner: 'challenge',
  },
  {
    week: 2,
    month: 'JUL',
    title: '기업 분석',
    desc: '목표 기업 리스트업·리서치',
    owner: 'challenge',
  },
  {
    week: 3,
    month: 'JUL',
    title: '영어 자격증 점검',
    desc: '토익·오픽 등 보유 현황 정리',
    owner: 'self',
  },
  {
    week: 4,
    month: 'JUL',
    title: '성적표 · 졸업증명',
    desc: '제출 서류 사전 준비',
    owner: 'self',
  },
  {
    week: 5,
    month: 'AUG',
    title: '경험 정리',
    desc: '경험정리 챌린지로 소재 발굴',
    owner: 'challenge',
  },
  {
    week: 6,
    month: 'AUG',
    title: '이력서 작성',
    desc: '이력서 챌린지',
    owner: 'challenge',
  },
  {
    week: 7,
    month: 'AUG',
    title: '자기소개서 작성',
    desc: '자기소개서 챌린지',
    owner: 'challenge',
  },
  { week: 8, month: 'AUG', title: PLACEHOLDER_TASK, desc: '' },
  {
    week: 9,
    month: 'SEP',
    title: '인적성 대비',
    desc: '인적성 챌린지',
    owner: 'challenge',
  },
  { week: 10, month: 'SEP', title: PLACEHOLDER_TASK, desc: '' },
  {
    week: 11,
    month: 'SEP',
    title: '면접 준비',
    desc: '면접 실전 챌린지',
    owner: 'challenge',
  },
  { week: 12, month: 'SEP', title: PLACEHOLDER_TASK, desc: '' },
  { week: 13, month: 'SEP', title: PLACEHOLDER_TASK, desc: '' },
];

export const COURSE_PLAN_HEADER = {
  badge: '하반기 공채 13주 합격 플랜',
  title: '7월부터 9월까지, 하반기 공채 준비 플레이북을 확인해보세요',
  sub: '무엇을 직접 하고, 어디서 렛츠커리어가 함께하는지 한눈에. 구매자에게 플레이북을 제공합니다.',
} as const;

export const COURSE_PLAN_VIEWS = {
  matrix: { id: 'matrix', label: '전체 플랜' },
  timeline: { id: 'timeline', label: '월별 플랜' },
} as const;

export type CoursePlanViewId = keyof typeof COURSE_PLAN_VIEWS;
