// 시안 9 — 플레이북 대시보드 (PASS BENEFIT 01).
//
// **동작하는 도구가 아니라 홍보용 목업이다.** 탭·입력창·버튼처럼 보이는 요소에 동작을
// 붙이지 않는다 — 누르면 아무 일도 일어나지 않는 버튼은 사용자를 속인다. 화면에는
// 클릭할 수 없는 상태로 그린다.
//
// 실제 도구를 만들기로 하면 이 파일과 대응 섹션을 지우고 별도 프로젝트로 다룬다.

import { WEEK_PLANS } from './coursePlan';

export interface LeaderboardEntry {
  rank: number;
  nickname: string;
  goal: string;
  /** 완료 미션 수 */
  done: number;
  /** 전체 미션 수 */
  total: number;
}

export interface RecommendedPosting {
  tag: string;
  company: string;
  roles: string;
}

// ---------------------------------------------------------------------------
// 개편 시안 10 — 세 덩어리 (PRD 4.10)
// 1. WITH LET'S CAREER  혜택 4카드 + STEP 01~05 → GOAL 세로 흐름
// 2. PLAYBOOK STRUCTURE 브라우저 목업 (탭 3개 · WEEK 04 체크리스트 5줄)
// 3. OUTPUT             WEEK 01~10 산출물 지그재그 타임라인
// ---------------------------------------------------------------------------

export interface PlaybookBenefit {
  icon: string;
  title: string;
  desc: string;
}

export interface PlaybookFlowStep {
  /** 'STEP 01' … 'GOAL' */
  no: string;
  label: string;
}

/** 1. WITH LET'S CAREER — 플레이북을 렛츠커리어 프로그램으로 실행하는 흐름 */
export const PLAYBOOK_WITH = {
  anchorId: 'playbook-with',
  eyebrow: "WITH LET'S CAREER",
  titleLines: ['플레이북의 렛츠커리어 프로그램에 참여하며,', '함께 취준하세요'],
  subLead: '10주 플레이북에서 계획을 확인하고,',
  subTail: '마케팅 올인원 패스에 포함된 프로그램으로 ',
  subStrong: '실제로 실행합니다.',
  benefits: [
    {
      icon: '✍️',
      title: '챌린지',
      desc: '미션을 따라 필요한 결과물 완성',
    },
    {
      icon: '🎥',
      title: '현직자 Live 세미나',
      desc: '직무 · 산업 · 서류 · 면접에 필요한 현직자 인사이트 습득',
    },
    {
      icon: '📚',
      title: '가이드북 · VOD',
      desc: '혼자 준비할 때 필요한 정보와 방법 보완',
    },
    {
      icon: '👤',
      title: '현직자 1:1 멘토링',
      desc: '내 경험과 결과물이 실제 지원 가능한 수준인지 검증',
    },
  ] satisfies PlaybookBenefit[],
  /** 마지막 칸(GOAL)만 남색으로 채워진다. 번호가 아니라 순서상 마지막이라는 뜻이다 */
  flow: [
    { no: 'STEP 01', label: '10주 플레이북에서 이번 주 계획 확인' },
    { no: 'STEP 02', label: '필요한 챌린지 · 자료 · 세미나 활용' },
    { no: 'STEP 03', label: '매주 결과물 완성' },
    { no: 'STEP 04', label: '현직자 검증' },
    { no: 'STEP 05', label: '실제 지원 · 면접' },
    { no: 'GOAL', label: '마케터 취뽀 🎉' },
  ] satisfies PlaybookFlowStep[],
} as const;

export interface PlaybookChecklistRow {
  label: string;
  /** 줄 오른쪽 태그. 매트릭스 배지와 이름이 같지만 '제출' 은 여기에만 있다 */
  tag: string;
  done: boolean;
}

/**
 * 2. PLAYBOOK STRUCTURE — 브라우저 목업.
 *
 * 주차 제목은 `WEEK_PLANS` 에서 가져온다. 여기 다시 적으면 주차 계획이 바뀔 때
 * 목업만 옛 제목으로 남는다.
 */
export const PLAYBOOK_STRUCTURE = {
  anchorId: 'playbook-dashboard',
  eyebrow: 'PLAYBOOK STRUCTURE',
  titleLines: [
    '헤매지 않고 완주하도록,',
    '직무 가이드 · 리더보드 · 채용공고까지 준비했어요',
  ],
  sub: '마케팅 10주 합격 플레이북 하나로! 준비부터 지원까지 흩어지지 않도록, 매주 필요한 정보와 진행 상황을 한곳에서 관리하세요.',
  addressBar: 'letscareer.co.kr / 10주 마케팅 취준 플레이북 🔒',
  /** 첫 번째 탭이 열려 있는 상태로 그린다 */
  tabs: [
    { icon: '📅', label: '10주 취준 계획' },
    { icon: '💼', label: '마케팅 채용공고 모음' },
    { icon: '🏆', label: '패스 참여자 리더보드' },
  ],
  /** 목업이 펼쳐 보이는 주차. WEEK_PLANS 의 4주차다 */
  weekNo: 4,
  weekTitle: WEEK_PLANS.a[3].title,
  weekDesc: '매주 무엇을 해야 하는지, 무엇을 만들어야 하는지를 한눈에 확인합니다.',
  checklist: [
    { label: '관심 산업 3개 리서치 노트 정리', tag: '가이드북', done: true },
    { label: '지원 가능 기업 20곳 롱리스트 만들기', tag: '템플릿', done: true },
    {
      label: '기업별 채용 전형 · 마감일 캘린더에 옮기기',
      tag: '체크리스트',
      done: false,
    },
    {
      label: "현직자 세미나 '마케터 세부 직무 톺아보기' 시청",
      tag: 'VOD',
      done: false,
    },
    {
      label: '이번 주 산출물 업로드 — 지원 기업 20곳 리스트',
      tag: '제출',
      done: false,
    },
  ] satisfies PlaybookChecklistRow[],
} as const;

export interface PlaybookWeekOutput {
  /** 1~10 */
  week: number;
  title: string;
  desc: string;
}

/**
 * 시안 10 의 산출물 문구가 주차 데이터와 다른 주차만 덮어쓴다.
 * 나머지는 `WEEK_PLANS.a[].output` 을 그대로 쓴다 — 주차 산출물을 두 벌로 적으면
 * 계획이 바뀔 때 한쪽만 고쳐진다. 어긋난 곳은 시안을 따랐다 (task 4.3).
 */
const OUTPUT_TITLE_FROM_DESIGN: Record<number, string> = {
  // 주차 데이터: '서류 변형본 3세트'
  5: 'JD 맞춤 서류 변형본 3세트',
  // 주차 데이터: '케이스 분석 리포트 1건'
  6: '마케팅 케이스 분석 리포트',
  // 주차 데이터: '콘텐츠 4~6개 + 성과 기록'
  7: '사이드 프로젝트 결과물 + 성과 기록',
  // 주차 데이터: '지원 10곳 + 탈락 복기 노트'
  10: '실제 10곳 지원 + 지원 결과 복기',
};

/** 산출물 한 줄 설명. 시안 10 에만 있는 문구라 주차 데이터에는 대응이 없다 */
const OUTPUT_DESCS: Record<number, string> = {
  1: '지금까지의 모든 경험을 펼쳐놓고, 지원할 직무를 2개로 좁힙니다.',
  2: '정리한 경험을 서류 언어로 옮기는 첫 산출물.',
  3: '마케팅 직무의 사실상 필수 서류를 완성합니다.',
  4: '산업 · 기업 리서치를 거쳐 실제 지원할 타깃을 확정합니다.',
  5: '같은 경험도 공고에 맞춰 다르게 보이도록 변형합니다.',
  6: '광고 집행 경험이 없어도 지표를 읽고 해석하는 훈련.',
  7: '부족한 실무 경험을 직접 만들어 포트폴리오에 추가합니다.',
  8: '과제 전형 · 사전 인터뷰에 대비한 실전 결과물.',
  9: '내 경험을 논리적으로 설명하는 연습을 기록으로 남깁니다.',
  10: '실행하고, 결과를 분석해 다음 지원을 개선합니다.',
};

/** 3. OUTPUT — 10주 뒤에 손에 남는 것 */
export const PLAYBOOK_OUTPUT = {
  anchorId: 'playbook-output',
  eyebrow: 'OUTPUT',
  titleLead: '10주 후에는 ‘취준 열심히 했다’가 아니라',
  titleStrong: '실제 지원할 서류',
  titleTail: '가 남습니다.',
  /** 「챌린지 기간」 배지가 붙는 마지막 주차. 배지는 주차 번호로 정하고 데이터에 넣지 않는다 */
  challengeUntilWeek: 3,
  weeks: WEEK_PLANS.a.map((plan) => ({
    week: plan.week,
    title: OUTPUT_TITLE_FROM_DESIGN[plan.week] ?? plan.output,
    desc: OUTPUT_DESCS[plan.week],
  })) satisfies PlaybookWeekOutput[],
} as const;

export const PLAYBOOK_DASHBOARD = {
  badge: 'PASS BENEFIT 01',
  eyebrow: '10-WEEK MARKETING CAREER PLAYBOOK',
  titleLines: [
    '헤매지 않고 완주하도록,',
    '직무 가이드 · 리더보드 · 채용공고까지 준비했어요',
  ],
  sub: '마케팅 10주 합격 플레이북 하나로! 준비부터 지원까지 흩어지지 않도록, 매주 필요한 정보와 진행 상황을 한곳에서 관리하세요.',
  /** 목업 상단 탭. 세 번째가 활성 상태로 그려진다 */
  tabs: ['플레이북', '공채자료', '리더보드', '채용 관리'],
  activeTab: '리더보드',
  brand: { name: '렛츠커리어', product: '마케팅 올인원 패스' },
  startPanel: {
    title: '시작하기',
    desc: '이름·닉네임·번호를 입력하면',
    fields: ['이름 (실명)', '닉네임 (리더보드 공개)'],
    cta: '시작하기',
  },
  noticeCard: {
    tag: '일반',
    date: '2026-09-08',
    title: '대기업 자소서 가이드북',
    desc: '이번 주 플레이북 자료가 열렸어요.',
    checks: ['기업 및 직무 선정', '자소서 핵심 경험 정리', '직무 역량 기획'],
  },
  leaderboard: {
    title: '참여자 리더보드',
    desc: '같은 목표를 향해 함께 달리는 멤버들이에요. 오늘도 한 칸 더!',
    entries: [
      {
        rank: 1,
        nickname: '고등어',
        goal: '하반기 마케팅 신입 취업!',
        done: 22,
        total: 32,
      },
      {
        rank: 2,
        nickname: '콩',
        goal: '하반기 안에 마케팅 직무 최종합격!',
        done: 21,
        total: 32,
      },
      {
        rank: 3,
        nickname: '쑤',
        goal: '올해 안에 대기업 최종합격!',
        done: 21,
        total: 32,
      },
      { rank: 4, nickname: '마케터꿈나무', goal: '', done: 18, total: 32 },
    ] satisfies LeaderboardEntry[],
  },
  postings: {
    title: '렛츠커리어 추천 공고',
    items: [
      { tag: 'F&B', company: '사조대림', roles: '전략기획 · 영업 · 고객관리' },
      {
        tag: '제약·바이오',
        company: '동국제약',
        roles: '마케팅 · 상품기획 · 데이터',
      },
    ] satisfies RecommendedPosting[],
    footnote: '채용 관리에서 확인',
  },
  /** 하단 설명 3칸 */
  highlights: [
    {
      no: '01',
      title: '세부 직무 가이드',
      desc: '직무별 역량과 포트폴리오 예시 확인',
    },
    {
      no: '02',
      title: '참여자 리더보드',
      desc: '미션 달성률을 보며 내 진행 속도 점검',
    },
    {
      no: '03',
      title: '공고 확인과 지원 관리',
      desc: '추천 공고를 저장하고 지원 현황 관리',
    },
  ],
} as const;
