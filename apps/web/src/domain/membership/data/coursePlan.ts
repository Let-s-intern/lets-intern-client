// 하반기 공채 13주 합격 플랜 — 매트릭스(카테고리×STEP) + 월별 13주 타임라인의 단일 데이터 출처.
// 두 뷰(CoursePlanMatrix / CoursePlanTimeline)와 범례가 이 한 파일을 공유한다.
//
// 콘텐츠 원문은 시안(렛츠커리어 하반기 멤버십_수정본) 그대로다. 오타 없이 입력한다.

/** 매트릭스 가로축. STEP01~05. */
export type StepId = 'step01' | 'step02' | 'step03' | 'step04' | 'step05';

/** 매트릭스 세로축 카테고리. 6종. */
export type CategoryId =
  | 'job'
  | 'experience'
  | 'resume'
  | 'portfolio'
  | 'data'
  | 'interview'
  | 'live';

/**
 * 수행 주체 라벨.
 * - self: 본인이 직접 (멤버십이 메우지 않는 구간)
 * - free: 무료 자료(워크북·가이드)
 * - challenge: 챌린지 = 멤버십이 함께하는 구간 (가치 증명의 핵심)
 * - challenge-deep: 챌린지 심화 (대기업 특화 등 가장 강조)
 */
export type Owner = 'self' | 'free' | 'challenge' | 'challenge-deep';

/**
 * 셀 분류 배지 — 직접 준비 단계도 렛츠커리어가 무엇으로 돕는지 한눈에 보여준다.
 * - free: 무료 자료(워크북·가이드)
 * - template: 템플릿 제공
 * - checklist: 체크리스트 제공
 * - challenge: 멤버십에 포함되는 챌린지
 */
export type CourseTag =
  | 'free'
  | 'template'
  | 'checklist'
  | 'vod'
  | 'challenge'
  | 'live'
  | 'mentoring';

// 시안 8 범례 그대로. 앞 네 개(가이드북·템플릿·체크리스트·VOD)는 패스에 포함된 자료이고,
// 뒤 세 개(챌린지·라이브 세미나·1:1 멘토링)는 렛츠커리어가 직접 함께하는 단계다.
export const COURSE_TAG_LABEL: Record<CourseTag, string> = {
  free: '가이드북',
  template: '템플릿',
  checklist: '체크리스트',
  vod: 'VOD',
  challenge: '챌린지',
  live: '라이브 세미나',
  mentoring: '1:1 멘토링',
};

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
  /** 주차·날짜 (시안 8 의 STEP 헤더 아래 줄) */
  range: string;
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
  /**
   * 일정(날짜·요일·시각). `desc` 에 이어 붙여 "연사 · 10.8 목 20:00" 으로 렌더된다.
   *
   * 한 문자열로 두면 좁은 셀에서 "10.8 목" / "20:00" 처럼 갈린다. 별도 필드로 두고
   * `.cpm-cell-when` 이 nowrap 으로 묶는다 — 날짜와 시각이 떨어지면 다른 날 일정처럼
   * 읽힌다. 셀 폭 142px 에 이 텍스트는 78px 이라 넘칠 여유가 충분하다.
   */
  when?: string;
  /** 수행 주체 (셀 색 결정) */
  owner: Owner;
  /** 분류 배지 (렛츠커리어 제공 형태) */
  tag: CourseTag;
}

export interface WeekItem {
  /** 1~13 연속. 12·13 은 묶음 카드라 week=12, weekEnd=13 으로 표기. */
  week: number;
  /** 묶음 카드의 끝 주차(없으면 단일 주차) */
  weekEnd?: number;
  /** 소속 월 */
  month: 'SEP' | 'OCT' | 'NOV';
  /** 주차 핵심 과업명 */
  title: string;
  /** 보조 설명 */
  desc: string;
  /** 챌린지 주차 여부 (월 액센트 배지 노출) */
  isChallenge: boolean;
}

export interface MonthGroup {
  month: 'SEP' | 'OCT' | 'NOV';
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

export const STEPS: Step[] = [
  {
    id: 'step01',
    no: '01',
    label: '방향 설정',
    phase: 'prep',
    range: '1주차 · 9.21~9.27',
  },
  {
    id: 'step02',
    no: '02',
    label: '서류 3종 완성',
    phase: 'prep',
    range: '2~3주차 · 9.28~10.11',
  },
  {
    id: 'step03',
    no: '03',
    label: '타깃 좁히기',
    phase: 'live',
    range: '4~5주차 · 10.12~10.25',
  },
  {
    id: 'step04',
    no: '04',
    label: '역량 보강',
    phase: 'live',
    range: '6~7주차 · 10.26~11.8',
  },
  {
    id: 'step05',
    no: '05',
    label: '전형·지원',
    phase: 'live',
    range: '8~10주차 · 11.9~11.29',
  },
];

export const CATEGORIES: Category[] = [
  { id: 'job', label: '직무·산업 이해', hint: '어떤 마케터가 될지' },
  { id: 'experience', label: '경험 정리·보강', hint: '모든 서류의 재료' },
  { id: 'resume', label: '이력서·자소서', hint: '서류의 뼈대' },
  { id: 'portfolio', label: '포트폴리오', hint: '마케팅의 필수 관문' },
  { id: 'data', label: '데이터·AI 역량', hint: '가장 비어 있는 영역' },
  { id: 'interview', label: '면접·지원 실행', hint: '결과를 내는 구간' },
  { id: 'live', label: '라이브 세미나', hint: '현직자에게 직접 듣기' },
];

/** 큰 구간 메타. STEP01–02 준비 / STEP03–05 실전. */
export const PHASES: { id: Phase; label: string; range: string }[] = [
  { id: 'prep', label: '준비 단계', range: 'SEP–OCT' },
  { id: 'live', label: '실전 단계', range: 'OCT–NOV' },
];

// 매트릭스 셀 — 6 카테고리 × STEP01~05. 서류 작성 STEP03 은 2셀(이력서 + 대기업 자소서).
// 입력 순서는 카테고리별 STEP01→05. document 만 step03 에 2개 셀을 갖는다.
// 매트릭스 셀 — 시안 8 (카테고리 7 × STEP 5).
// 셀이 없는 칸은 시안에도 비어 있다. 억지로 채우지 않는다 — 빈 칸이 "이 단계에는 이
// 영역을 건드리지 않는다" 는 정보다.
export const MATRIX_CELLS: MatrixCell[] = [
  // 1. 직무·산업 이해
  {
    step: 'step01',
    category: 'job',
    owner: 'free',
    tag: 'free',
    title: '세부 직무 6종 훑기',
    desc: '그로스·퍼포먼스·콘텐츠·바이럴·인플루언서·브랜드',
  },
  {
    step: 'step02',
    category: 'job',
    owner: 'free',
    tag: 'vod',
    title: '현직자 직무 세미나 VOD',
    desc: '하는 일과 보는 숫자 비교하기',
  },
  {
    step: 'step03',
    category: 'job',
    owner: 'free',
    tag: 'free',
    title: '관심 산업 2~3개 좁히기',
    desc: '시장·주요 브랜드·최근 캠페인',
  },
  {
    step: 'step04',
    category: 'job',
    owner: 'free',
    tag: 'vod',
    title: '인하우스 vs 대행사',
    desc: '첫 커리어로 어디가 나은지 판단',
  },
  {
    step: 'step05',
    category: 'job',
    owner: 'self',
    tag: 'template',
    title: '면접용 기업 심화',
    desc: '최근 캠페인에 내 의견 붙이기',
  },

  // 2. 경험 정리·보강
  {
    step: 'step01',
    category: 'experience',
    owner: 'free',
    tag: 'checklist',
    title: '경험 진단 체크리스트',
    desc: '지금 경험이 어느 직무에 닿는지',
  },
  {
    step: 'step02',
    category: 'experience',
    owner: 'challenge',
    tag: 'challenge',
    title: '경험을 STAR로 정리',
    desc: '챌린지 미션으로 소재 구조화',
  },
  {
    step: 'step03',
    category: 'experience',
    owner: 'self',
    tag: 'template',
    title: '경험 ↔ JD 키워드 매칭',
    desc: '공고 언어로 바꿔 쓰기',
  },
  {
    step: 'step04',
    category: 'experience',
    owner: 'free',
    tag: 'free',
    title: '사이드 프로젝트 설계',
    desc: '직무별로 뭘 해야 티가 나는지',
  },
  {
    step: 'step05',
    category: 'experience',
    owner: 'self',
    tag: 'template',
    title: '면접 소재화',
    desc: 'STAR 경험을 90초 답변으로',
  },

  // 3. 이력서·자소서
  {
    step: 'step01',
    category: 'resume',
    owner: 'free',
    tag: 'free',
    title: '합격 자소서 가이드북',
    desc: '구조·문항 감 잡기',
  },
  {
    step: 'step02',
    category: 'resume',
    owner: 'challenge',
    tag: 'challenge',
    title: '마케팅 챌린지',
    desc: '이력서·자소서 초안 완성',
  },
  {
    step: 'step03',
    category: 'resume',
    owner: 'self',
    tag: 'template',
    title: 'JD별 서류 변형',
    desc: '공고 3개 맞춤 3세트',
  },
  {
    step: 'step04',
    category: 'resume',
    owner: 'free',
    tag: 'free',
    title: '지원동기 40분 워크플로우',
    desc: '막히는 문항 빠르게 뚫기',
  },
  {
    step: 'step05',
    category: 'resume',
    owner: 'self',
    tag: 'template',
    title: '서류 기반 질문 예측',
    desc: '내가 쓴 문장에서 나올 질문',
  },

  // 4. 포트폴리오
  {
    step: 'step01',
    category: 'portfolio',
    owner: 'free',
    tag: 'free',
    title: '포폴 기본 구조',
    desc: '무엇을 담고 무엇을 뺄지',
  },
  {
    step: 'step02',
    category: 'portfolio',
    owner: 'challenge',
    tag: 'challenge',
    title: '마케팅 챌린지',
    desc: '포트폴리오 초안 1본 완성',
  },
  {
    step: 'step03',
    category: 'portfolio',
    owner: 'self',
    tag: 'template',
    title: 'JD별 포폴 변형',
    desc: '지원 직무에 맞춰 첫 장 바꾸기',
  },
  {
    step: 'step04',
    category: 'portfolio',
    owner: 'free',
    tag: 'free',
    title: 'SNS·사이드 프로젝트로 채우기',
    desc: '콘텐츠 4~6개 발행하고 기록',
  },
  {
    step: 'step05',
    category: 'portfolio',
    owner: 'free',
    tag: 'checklist',
    title: '제출본 최종 점검',
    desc: '파일명·용량·링크 권한 확인',
  },

  // 5. 데이터·AI 역량
  {
    step: 'step01',
    category: 'data',
    owner: 'free',
    tag: 'free',
    title: '마케터의 툴 지도',
    desc: 'GA4·메타·피그마·캡컷·노션',
  },
  {
    step: 'step02',
    category: 'data',
    owner: 'free',
    tag: 'vod',
    title: 'CMO·CPO의 필수 역량 강의',
    desc: '뽑는 사람이 보는 기준',
  },
  {
    step: 'step03',
    category: 'data',
    owner: 'free',
    tag: 'free',
    title: '집행 경험 없이 퍼포먼스 지원하기',
    desc: '경험이 없어도 쓸 수 있는 것',
  },
  {
    step: 'step04',
    category: 'data',
    owner: 'free',
    tag: 'vod',
    title: '광고 지표 기준선',
    desc: 'CTR·CVR·CPA·ROAS 어느 정도가 평타인가',
  },
  {
    step: 'step05',
    category: 'data',
    owner: 'free',
    tag: 'free',
    title: 'AI 활용 경험 쓰는 법',
    desc: '툴 나열은 감점이 되는 이유',
  },

  // 6. 면접·지원 실행
  {
    step: 'step01',
    category: 'interview',
    owner: 'free',
    tag: 'free',
    title: '면접 기본 가이드',
    desc: '면접 유형과 평가 포인트',
  },
  {
    step: 'step02',
    category: 'interview',
    owner: 'self',
    tag: 'template',
    title: '1분 자기소개 초안',
    desc: '기본 스크립트 작성',
  },
  {
    step: 'step03',
    category: 'interview',
    owner: 'free',
    tag: 'free',
    title: '채용공고 채널 지도',
    desc: '원티드·링크드인·자사 ATS·오픈채팅',
  },
  {
    step: 'step04',
    category: 'interview',
    owner: 'free',
    tag: 'free',
    title: '과제 전형·사전 인터뷰 대비',
    desc: '숏폼 기획·콘텐츠 제작 모의 과제',
  },
  {
    step: 'step05',
    category: 'interview',
    owner: 'challenge',
    tag: 'challenge',
    title: '면접 준비 챌린지',
    desc: '모의면접·녹화 피드백',
  },
  {
    step: 'step05',
    category: 'interview',
    owner: 'challenge-deep',
    tag: 'mentoring',
    title: '현직 마케터 커피챗',
    desc: '답변 점검과 지원 복기',
  },

  // 7. 라이브 세미나 — 현직자에게 직접 듣는 자리
  {
    step: 'step01',
    category: 'live',
    owner: 'challenge',
    tag: 'live',
    title: '마케터 세부 직무 톺아보기',
    desc: '놀유니버스 CRM 마케터',
    when: '9.20 일 11:00',
  },
  {
    step: 'step01',
    category: 'live',
    owner: 'challenge',
    tag: 'live',
    title: 'AE가 가져야 할 역량과 포폴 작성법',
    desc: '대학내일 AE',
    when: '9.22 화 20:00',
  },
  {
    step: 'step02',
    category: 'live',
    owner: 'challenge',
    tag: 'live',
    title: '마케팅의 기본',
    desc: '클래스101 콘텐츠 마케터',
    when: '9.28 월 20:00',
  },
  {
    step: 'step02',
    category: 'live',
    owner: 'challenge',
    tag: 'live',
    title: '마케팅 커리어 방향 설정법',
    desc: 'CJ 계열사 마케터',
    when: '10.1 목 20:00',
  },
  {
    step: 'step02',
    category: 'live',
    owner: 'challenge',
    tag: 'live',
    title: '사이드 프로젝트로 그로스 사이클 경험하기',
    desc: '네이버 계열사 마케터',
    when: '10.8 목 20:00',
  },
  {
    step: 'step03',
    category: 'live',
    owner: 'challenge',
    tag: 'live',
    title: 'AI 주제로 6개월 만에 팔로워 6,000명 만든 방법',
    desc: '팔로워 6,000명 계정 운영자',
    when: '10.22 목 20:00',
  },
  {
    step: 'step04',
    category: 'live',
    owner: 'challenge',
    tag: 'live',
    title: '혼자서도 할 수 있는 메타 광고로 경험 쌓기',
    desc: '위그로스 CEO',
    when: '10.29 목 20:00',
  },
  {
    step: 'step05',
    category: 'live',
    owner: 'challenge',
    tag: 'live',
    title: '마케팅 포트폴리오 A to Z 끝장',
    desc: '렛츠커리어 쥬디 멘토',
    when: '11.10 화 20:00',
  },
  {
    step: 'step05',
    category: 'live',
    owner: 'challenge',
    tag: 'live',
    title: '포트폴리오 놓고 실제로 묻는 질문 — 실무 면접 시연',
    desc: '현직 마케터',
    when: '11.19 목 20:00',
  },
  {
    step: 'step05',
    category: 'live',
    owner: 'challenge',
    tag: 'live',
    title: '인턴·계약직·정규직 오퍼, 무엇을 보고 고르나',
    desc: '현직 마케터',
    when: '11.26 목 20:00',
  },
];

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
    month: 'SEP',
    title: '기반 다지기',
    sub: '리서치로 방향 잡고, 시간 걸리는 서류 먼저',
    badge: 'RESEARCH',
    accent: '#1f97b0',
    badgeBg: '#e3f5f8',
    badgeFg: '#1c8597',
  },
  {
    month: 'OCT',
    title: '콘텐츠 쌓기',
    sub: '경험정리 → 이력서·자소서 챌린지로',
    badge: 'BUILD',
    accent: '#ef8a1c',
    badgeBg: '#fdeedb',
    badgeFg: '#c46f10',
  },
  {
    month: 'NOV',
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
  // SEP
  {
    week: 1,
    month: 'SEP',
    title: '산업 분석',
    desc: '관심 산업 2~3개 시장 규모·성장성·최신 이슈·밸류체인 정리',
    isChallenge: false,
  },
  {
    week: 2,
    month: 'SEP',
    title: '기업 분석',
    desc: '목표 기업 사업영역·인재상·직무(JD) 분석 → 1·2지망 구분',
    isChallenge: false,
  },
  {
    week: 3,
    month: 'SEP',
    title: '영어 자격증 점검',
    desc: '유효기간 확인, 부족하면 바로 접수 (점수 2~3주 소요)',
    isChallenge: false,
  },
  {
    week: 4,
    month: 'SEP',
    title: '성적표·졸업증명서',
    desc: '영문본 포함 미리 발급 — 서류는 항상 미리!',
    isChallenge: false,
  },
  // OCT
  {
    week: 5,
    month: 'OCT',
    title: '경험정리 챌린지 ①',
    desc: '경험 전수조사 → STAR 구조로 정리 시작',
    isChallenge: true,
  },
  {
    week: 6,
    month: 'OCT',
    title: '경험정리 챌린지 ② + 인적성 진단',
    desc: '역량 매칭 완료 / 인적성 모의 1회로 약점 파악',
    isChallenge: true,
  },
  {
    week: 7,
    month: 'OCT',
    title: '이력서 챌린지',
    desc: '직무 맞춤 이력서·경력기술서 완성',
    isChallenge: true,
  },
  {
    week: 8,
    month: 'OCT',
    title: '대기업 특화 자소서 챌린지',
    desc: '공통·기업별 문항 합격 구조로 작성·첨삭',
    isChallenge: true,
  },
  // NOV
  {
    week: 9,
    month: 'NOV',
    title: '서류 접수 + 잡다 게임 ①',
    desc: '자소서 최종 완성·지원 시작 / 역량검사 게임 유형 익히기',
    isChallenge: false,
  },
  {
    week: 10,
    month: 'NOV',
    title: '인적성 대비 챌린지 + 게임 ②',
    desc: '실전 모의고사 반복 / 게임 연습 마무리',
    isChallenge: true,
  },
  {
    week: 11,
    month: 'NOV',
    title: '인적성 마무리 + 면접 챌린지 ①',
    desc: '인적성 최종 점검 / 1분 자기소개·직무 PR 스크립트',
    isChallenge: true,
  },
  {
    week: 12,
    weekEnd: 13,
    month: 'NOV',
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

/** 섹션 헤더 — 시안 6-0.png */
export const COURSE_PLAN_HEADER = {
  badge: 'PASS BENEFIT 01 · 10-WEEK MARKETING CAREER PLAYBOOK',
  /** 제목 — 의도된 줄바꿈 단위 (시안 8) */
  titleLines: ['마케팅 10주 합격 플레이북 대로만 따라오세요'],
  /** titleLines 안에서 강조할 어절 */
  titleHighlights: ['10주 합격 플레이북'],
  subLines: [
    '내 상황을 고르면 10주 계획이 바뀝니다. 무엇을 직접 만들고, 어디서 렛츠커리어가 함께하는지 정리했어요.',
  ],
} as const;

/** 플레이북 본문 도입부 + 매트릭스 캡션 — 시안 6-1.png */
export const COURSE_PLAN_BODY = {
  titleLines: ['마케팅 10주 합격 플레이북 대로만 따라오세요'],
  sub: '내 상황을 고르면 10주 계획이 바뀝니다. 무엇을 직접 만들고, 어디서 렛츠커리어가 함께하는지 정리했어요.',
  /** 매트릭스 바로 위 문구 (시안 8) */
  matrixTitle:
    '첫 3주는 마케팅 서류 완성 올인원 챌린지 10기(9/19~10/9)로 서류 3종을 만들고, 이후 7주는 부족한 경험을 채우며 실제로 지원합니다.',
  matrixSub: '10주 동안 현직자 라이브 세미나 10회가 함께 열려요.',
  /** 매트릭스 아래 마무리 (시안 8 하단) */
  matrixFootnote:
    '구매자에게는 주차별 미션과 체크리스트가 담긴 마케팅 10주 합격 플레이북 풀버전을 드려요.',
} as const;

/**
 * 시안 8 상단의 유형 선택 (TYPE A/B).
 *
 * 시안은 고르면 10주 계획이 바뀐다고 말하지만, 유형별로 다른 매트릭스를 받은 적이 없다.
 * 없는 데이터를 지어내면 고른 사람이 같은 표를 보고 속았다고 느낀다. 그래서 지금은
 * **표시만 하고 표를 바꾸지 않는다.** 유형별 계획을 받으면 여기에 매트릭스를 나눠 붙인다.
 */
export const COURSE_PLAN_TYPES = [
  {
    id: 'a',
    label: 'TYPE A',
    title: '마케팅 취준, 이제 막 시작했어요',
    desc: '직무 탐색과 경험 진단부터 필요한 분',
  },
  {
    id: 'b',
    label: 'TYPE B',
    title: '마케팅 유관 경험 6개월~1년이에요',
    desc: '가진 경험을 무기로 만들 분',
  },
] as const;

// 매트릭스 아래 — 구매자가 실제로 받는 플레이북 화면. 앱을 위에서 아래로 훑는 20초 루프다.
//
// 원본은 37MB GIF 였다. GIF 로 두면 랜딩 무게를 감당할 수 없어(이 레포의 기존 GIF 자산은
// 최대 83MB 다) 애니메이션 WebP 로 바꿨다 — 2.29MB, 94% 감소.
//
// 인코딩 값: 600px 폭, 13.3fps(원본 20fps 에서 3프레임 중 2장), 프레임 지연 75ms,
// 품질 65. 재생 길이는 원본과 같은 20.25초다. 품질을 더 내리면 용량이 눈에 띄게 줄지만
// PRD 7-3 이 글자 있는 이미지에 60 이하를 금지한다 — 이 화면은 글자가 본체다.
// 파일을 다시 받으면 같은 값으로 다시 인코딩한다.

/** 플레이북 앱 화면 (애니메이션 WebP) */
export const PLAYBOOK_SHOT_SRC = '/images/membership/playbook-app.webp';

/**
 * 실측 크기. 표시 폭 300px 의 @2x 다 — 시안에서 매트릭스(1080px) 대비 27.65% 로 잰 값이다.
 * next/image 를 쓰지 않으므로 <img> 에 직접 넣어 CLS 를 막는다.
 */
export const PLAYBOOK_SHOT_SIZE = { width: 600, height: 1070 } as const;

/** 화면 안 문구를 문장으로 옮긴 것. 이름표 수준으로 줄이지 말 것 */
export const PLAYBOOK_SHOT_ALT =
  '플레이북 화면을 위에서 아래로 훑는 영상. 플레이북·공채자료·리더보드·채용 관리 네 개 탭이 있고, 나의 13주 진행률이 32개 항목 중 몇 개를 마쳤는지 보여준다. 내 취업 방향 정하기에서 희망 산업과 직무, 희망 회사 3곳, 나의 포부를 입력하고, 채용 관리에서 지원 기업과 서류 단계·마감 기한을 등록한다. 13주 합격 플랜은 STEP 01 방향 설정부터 STEP 05 면접·최종까지 주차별 할 일을 체크리스트로 펼쳐 보여준다.';

/** 화면 아래 마무리 문구 — 의도된 줄바꿈 단위 */
export const PLAYBOOK_CAPTION_LINES = [
  '무엇을 준비할지 고민하는 시간은 줄이고,',
  '합격에 필요한 준비에만 집중하세요.',
] as const;

export const COURSE_PLAN_VIEWS = {
  matrix: { id: 'matrix', label: '플레이북으로 보기' },
  timeline: { id: 'timeline', label: '주 단위로 보기' },
} as const;

export type CoursePlanViewId = keyof typeof COURSE_PLAN_VIEWS;
