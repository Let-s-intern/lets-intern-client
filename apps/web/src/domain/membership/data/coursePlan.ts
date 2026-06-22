// 하반기 공채 13주 합격 플랜 — 매트릭스(카테고리×STEP) + 월별 13주 타임라인의 단일 데이터 출처.
// 두 뷰(CoursePlanMatrix / CoursePlanTimeline)와 범례가 이 한 파일을 공유한다.
//
// 콘텐츠 원문은 시안(렛츠커리어 하반기 멤버십_수정본) 그대로다. 오타 없이 입력한다.

/** 매트릭스 가로축. STEP01~05. */
export type StepId = 'step01' | 'step02' | 'step03' | 'step04' | 'step05';

/** 매트릭스 세로축 카테고리. 6종. */
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
 * - challenge-deep: 챌린지 심화 (대기업 특화 등 가장 강조)
 */
export type Owner = 'self' | 'free' | 'challenge' | 'challenge-deep';

/** 준비 흐름의 큰 구간 — STEP01–02 준비 / STEP03–05 실전. */
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
  /** 카테고리 부제 (모바일 카드 분해 시 보조 라벨) */
  hint: string;
}

export interface MatrixCell {
  step: StepId;
  category: CategoryId;
  /** 해당 셀의 과업 제목 */
  title: string;
  /** 보조 설명 */
  desc: string;
  /** 수행 주체 */
  owner: Owner;
}

export interface WeekItem {
  /** 1~13 연속. 12·13 은 묶음 카드라 week=12, weekEnd=13 으로 표기. */
  week: number;
  /** 묶음 카드의 끝 주차(없으면 단일 주차) */
  weekEnd?: number;
  /** 소속 월 */
  month: 'JUL' | 'AUG' | 'SEP';
  /** 주차 핵심 과업명 */
  title: string;
  /** 보조 설명 */
  desc: string;
  /** 챌린지 주차 여부 (월 액센트 배지 노출) */
  isChallenge: boolean;
}

export interface MonthGroup {
  month: 'JUL' | 'AUG' | 'SEP';
  /** 월 성격 타이틀 */
  title: string;
  /** 월 서브 카피 */
  sub: string;
  /** 영문 배지 라벨 */
  badge: string;
  /** 액센트색 (월 래퍼 --m-accent) */
  accent: string;
  /** 배지 배경/글자색 */
  badgeBg: string;
  badgeFg: string;
}

/** 수행 주체 범례 (라벨 + 한 줄 의미). 매트릭스·타임라인·범례가 공유. */
export interface OwnerLegend {
  owner: Owner;
  label: string;
  hint: string;
}

export const OWNER_LEGEND: OwnerLegend[] = [
  { owner: 'challenge', label: '챌린지', hint: '멤버십이 함께하는 구간' },
  {
    owner: 'challenge-deep',
    label: '챌린지 · 심화',
    hint: '대기업 특화 등 집중 코스',
  },
  { owner: 'free', label: '무료 자료', hint: '무료 워크북·가이드 제공' },
  { owner: 'self', label: '직접', hint: '스스로 준비하는 구간' },
];

export const STEPS: Step[] = [
  { id: 'step01', no: '01', label: '방향 설정', phase: 'prep' },
  { id: 'step02', no: '02', label: '기초 다지기', phase: 'prep' },
  { id: 'step03', no: '03', label: '서류 완성', phase: 'live' },
  { id: 'step04', no: '04', label: '시험·실전', phase: 'live' },
  { id: 'step05', no: '05', label: '면접·최종', phase: 'live' },
];

export const CATEGORIES: Category[] = [
  { id: 'industry', label: '산업·기업 분석', hint: '방향을 잡는 리서치' },
  { id: 'qualification', label: '기본 자격', hint: '영어·증명서' },
  { id: 'experience', label: '경험 정리', hint: '모든 서류의 재료' },
  { id: 'document', label: '서류 작성', hint: '이력서·자소서' },
  { id: 'aptitude', label: '인적성', hint: '적성·역량검사' },
  { id: 'interview', label: '면접 실전', hint: '말하기' },
];

/** 큰 구간 메타. STEP01–02 준비 / STEP03–05 실전. */
export const PHASES: { id: Phase; label: string; range: string }[] = [
  { id: 'prep', label: '준비 단계', range: 'JUL–AUG' },
  { id: 'live', label: '실전 단계', range: 'AUG–SEP' },
];

// 매트릭스 셀 — 6 카테고리 × STEP01~05. 서류 작성 STEP03 은 2셀(이력서 + 대기업 자소서).
// 입력 순서는 카테고리별 STEP01→05. document 만 step03 에 2개 셀을 갖는다.
export const MATRIX_CELLS: MatrixCell[] = [
  // 1. 산업·기업 분석
  {
    step: 'step01',
    category: 'industry',
    owner: 'self',
    title: '산업 분석',
    desc: '관심 산업 2~3개 시장·이슈·밸류체인',
  },
  {
    step: 'step02',
    category: 'industry',
    owner: 'self',
    title: '기업 분석',
    desc: '사업·인재상·JD → 1·2지망 구분',
  },
  {
    step: 'step03',
    category: 'industry',
    owner: 'free',
    title: '채용 캘린더',
    desc: '공채 일정 가이드로 마감일 정리',
  },
  {
    step: 'step04',
    category: 'industry',
    owner: 'self',
    title: '기업 이슈 업데이트',
    desc: '최신 뉴스·IR 체크',
  },
  {
    step: 'step05',
    category: 'industry',
    owner: 'self',
    title: '면접 기업 심화',
    desc: '직무·인재상 기반 질문 예측',
  },
  // 2. 기본 자격 — 영어·증명서
  {
    step: 'step01',
    category: 'qualification',
    owner: 'self',
    title: '영어 성적 점검',
    desc: '유효기간 확인·즉시 접수',
  },
  {
    step: 'step02',
    category: 'qualification',
    owner: 'self',
    title: '성적표·졸업증명서',
    desc: '영문본 포함 미리 발급',
  },
  {
    step: 'step03',
    category: 'qualification',
    owner: 'self',
    title: '어학·자격 취합',
    desc: '지원서 첨부 파일 정리',
  },
  {
    step: 'step04',
    category: 'qualification',
    owner: 'self',
    title: '우대 요건 확인',
    desc: '기업별 가산점·자격 요건',
  },
  {
    step: 'step05',
    category: 'qualification',
    owner: 'self',
    title: '제출 서류 최종본',
    desc: '면접 지참 서류 스캔·정리',
  },
  // 3. 경험 정리 — 모든 서류의 재료
  {
    step: 'step01',
    category: 'experience',
    owner: 'free',
    title: '경험 브레인스토밍',
    desc: '무료 경험정리 워크북으로 소재 모으기',
  },
  {
    step: 'step02',
    category: 'experience',
    owner: 'challenge',
    title: '경험정리 챌린지',
    desc: '경험 전수조사 → STAR 구조로 정리',
  },
  {
    step: 'step03',
    category: 'experience',
    owner: 'self',
    title: '직무 역량 매칭',
    desc: '경험 ↔ 직무 키워드 연결',
  },
  {
    step: 'step04',
    category: 'experience',
    owner: 'self',
    title: '핵심 역량 3가지',
    desc: '자소서·면접 공통 메시지 추출',
  },
  {
    step: 'step05',
    category: 'experience',
    owner: 'self',
    title: '면접 소재화',
    desc: 'STAR 경험을 답변으로 변환',
  },
  // 4. 서류 작성 — 이력서·자소서 (STEP03 에 2셀)
  {
    step: 'step01',
    category: 'document',
    owner: 'free',
    title: '합격 자소서 가이드북',
    desc: '구조·문항 감 잡기',
  },
  {
    step: 'step02',
    category: 'document',
    owner: 'free',
    title: '이력서·경력기술서 템플릿',
    desc: '양식 미리 준비',
  },
  {
    step: 'step03',
    category: 'document',
    owner: 'challenge',
    title: '이력서 챌린지',
    desc: '직무 맞춤 이력서·경력기술서 1주 완성',
  },
  {
    step: 'step03',
    category: 'document',
    owner: 'challenge-deep',
    title: '대기업 특화 자기소개서 챌린지',
    desc: '기업별 문항을 합격 구조로 첨삭',
  },
  {
    step: 'step04',
    category: 'document',
    owner: 'self',
    title: '기업별 커스터마이징',
    desc: '지원서 맞춤 수정·제출',
  },
  {
    step: 'step05',
    category: 'document',
    owner: 'self',
    title: '자소서 기반 질문 예측',
    desc: '제출 자소서에서 면접 질문 뽑기',
  },
  // 5. 인적성 — 적성·역량검사
  {
    step: 'step01',
    category: 'aptitude',
    owner: 'free',
    title: '인적성 유형 안내',
    desc: '기업별 검사 종류 파악',
  },
  {
    step: 'step02',
    category: 'aptitude',
    owner: 'self',
    title: '기초 문제풀이',
    desc: '언어·수리·추리 감 잡기',
  },
  {
    step: 'step03',
    category: 'aptitude',
    owner: 'self',
    title: '잡다 게임 연습',
    desc: '역량검사 게임 유형 익히기',
  },
  {
    step: 'step04',
    category: 'aptitude',
    owner: 'challenge',
    title: '인적성 대비 챌린지',
    desc: '약점 진단 → 실전 모의고사 반복',
  },
  {
    step: 'step05',
    category: 'aptitude',
    owner: 'self',
    title: '시험 직전 점검',
    desc: '오답 복습·컨디션 관리',
  },
  // 6. 면접 실전 — 말하기
  {
    step: 'step01',
    category: 'interview',
    owner: 'free',
    title: '면접 기본 가이드',
    desc: '면접 유형·평가 포인트',
  },
  {
    step: 'step02',
    category: 'interview',
    owner: 'self',
    title: '1분 자기소개 초안',
    desc: '기본 스크립트 작성',
  },
  {
    step: 'step03',
    category: 'interview',
    owner: 'self',
    title: '직무 PR 정리',
    desc: '강점·경험 연결',
  },
  {
    step: 'step04',
    category: 'interview',
    owner: 'self',
    title: '예상 질문 리스트업',
    desc: '기업·직무별 정리',
  },
  {
    step: 'step05',
    category: 'interview',
    owner: 'challenge',
    title: '면접 준비 챌린지',
    desc: '모의면접·녹화 피드백, 1분 자기소개·직무 PR',
  },
];

/**
 * (step, category) → 해당 셀 배열 조회 맵.
 * 대부분 1개지만 document/step03 은 2개라 배열로 보관한다(뷰에서 O(1) 룩업).
 */
export const MATRIX_CELL_MAP = MATRIX_CELLS.reduce<Map<string, MatrixCell[]>>(
  (map, cell) => {
    const key = matrixCellKey(cell.step, cell.category);
    const list = map.get(key);
    if (list) {
      list.push(cell);
    } else {
      map.set(key, [cell]);
    }
    return map;
  },
  new Map(),
);

export function matrixCellKey(step: StepId, category: CategoryId): string {
  return `${step}:${category}`;
}

export const MONTH_GROUPS: MonthGroup[] = [
  {
    month: 'JUL',
    title: '기반 다지기',
    sub: '리서치로 방향 잡고, 시간 걸리는 서류 먼저',
    badge: 'RESEARCH',
    accent: '#1f97b0',
    badgeBg: '#e3f5f8',
    badgeFg: '#1c8597',
  },
  {
    month: 'AUG',
    title: '콘텐츠 쌓기',
    sub: '경험정리 → 이력서·자소서 챌린지로',
    badge: 'BUILD',
    accent: '#ef8a1c',
    badgeBg: '#fdeedb',
    badgeFg: '#c46f10',
  },
  {
    month: 'SEP',
    title: '실전 대비',
    sub: '지원 → 인적성·게임 → 면접까지',
    badge: 'GAME TIME',
    accent: '#e0604a',
    badgeBg: '#fde3de',
    badgeFg: '#cf4631',
  },
];

// 월별 13주 타임라인 — 시안 원문 그대로. 12·13 주는 하나의 묶음 카드.
export const WEEKS: WeekItem[] = [
  // JUL
  {
    week: 1,
    month: 'JUL',
    title: '산업 분석',
    desc: '관심 산업 2~3개 시장 규모·성장성·최신 이슈·밸류체인 정리',
    isChallenge: false,
  },
  {
    week: 2,
    month: 'JUL',
    title: '기업 분석',
    desc: '목표 기업 사업영역·인재상·직무(JD) 분석 → 1·2지망 구분',
    isChallenge: false,
  },
  {
    week: 3,
    month: 'JUL',
    title: '영어 자격증 점검',
    desc: '유효기간 확인, 부족하면 바로 접수 (점수 2~3주 소요)',
    isChallenge: false,
  },
  {
    week: 4,
    month: 'JUL',
    title: '성적표·졸업증명서',
    desc: '영문본 포함 미리 발급 — 서류는 항상 미리!',
    isChallenge: false,
  },
  // AUG
  {
    week: 5,
    month: 'AUG',
    title: '경험정리 챌린지 ①',
    desc: '경험 전수조사 → STAR 구조로 정리 시작',
    isChallenge: true,
  },
  {
    week: 6,
    month: 'AUG',
    title: '경험정리 챌린지 ② + 인적성 진단',
    desc: '역량 매칭 완료 / 인적성 모의 1회로 약점 파악',
    isChallenge: true,
  },
  {
    week: 7,
    month: 'AUG',
    title: '이력서 챌린지',
    desc: '직무 맞춤 이력서·경력기술서 완성',
    isChallenge: true,
  },
  {
    week: 8,
    month: 'AUG',
    title: '대기업 특화 자소서 챌린지',
    desc: '공통·기업별 문항 합격 구조로 작성·첨삭',
    isChallenge: true,
  },
  // SEP
  {
    week: 9,
    month: 'SEP',
    title: '서류 접수 + 잡다 게임 ①',
    desc: '자소서 최종 완성·지원 시작 / 역량검사 게임 유형 익히기',
    isChallenge: false,
  },
  {
    week: 10,
    month: 'SEP',
    title: '인적성 대비 챌린지 + 게임 ②',
    desc: '실전 모의고사 반복 / 게임 연습 마무리',
    isChallenge: true,
  },
  {
    week: 11,
    month: 'SEP',
    title: '인적성 마무리 + 면접 챌린지 ①',
    desc: '인적성 최종 점검 / 1분 자기소개·직무 PR 스크립트',
    isChallenge: true,
  },
  {
    week: 12,
    weekEnd: 13,
    month: 'SEP',
    title: '면접 준비 챌린지 ②',
    desc: '예상 질문 정리 → 모의면접 반복·녹화 피드백',
    isChallenge: true,
  },
];

/** 월별 다크 푸터 "한 줄 동선" 칩 시퀀스 (화살표로 연결). */
export const FLOW_LABEL = '한 줄 동선';
export const FLOW_CHIPS: string[] = [
  '산업·기업 분석',
  '자격 점검',
  '경험정리 챌린지',
  '이력서·자소서 챌린지',
  '인적성 챌린지',
  '면접 챌린지',
  '합격',
];

export const COURSE_PLAN_HEADER = {
  badge: '하반기 공채 13주 합격 플랜',
  title: '7월부터 9월까지, 하반기 공채 준비 플레이북을 확인해보세요',
  sub: '공채 준비 단계부터 실전까지 무엇을 직접 하고, 어디서 렛츠커리어가 함께하는지 한눈에 정리했어요. 렛츠커리어 하반기 멤버십 구매자 분들에게는 하반기 공채 준비 플레이북을 드립니다.',
} as const;

export const COURSE_PLAN_VIEWS = {
  matrix: { id: 'matrix', label: '전체 플랜' },
  timeline: { id: 'timeline', label: '월별 플랜' },
} as const;

export type CoursePlanViewId = keyof typeof COURSE_PLAN_VIEWS;
