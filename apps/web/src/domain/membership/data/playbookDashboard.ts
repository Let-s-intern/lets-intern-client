// 개편 시안 10 — 플레이북 실행 흐름과 대시보드 (PRD 4.10).
//
// **동작하는 도구가 아니라 홍보용 목업이다.** 탭·체크박스처럼 보이는 요소에 동작을
// 붙이지 않는다 — 누르면 아무 일도 일어나지 않는 버튼은 사용자를 속인다. 화면에는
// 클릭할 수 없는 상태로 그린다.
//
// 실제 도구를 만들기로 하면 이 파일과 대응 섹션을 지우고 별도 프로젝트로 다룬다.

import { WEEK_PLANS } from './coursePlan';

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

/** 탭과 본문을 짝짓는 열쇠. 순서가 아니라 이 값으로 맞춘다 */
export type PlaybookTabId = 'plan' | 'jobs' | 'leaderboard';

export interface PlaybookTab {
  id: PlaybookTabId;
  icon: string;
  label: string;
}

export interface PlaybookJobRow {
  /** 회사명은 가린다. 실제 공고가 아니라 화면 안의 예시다 */
  company: string;
  title: string;
  tags: readonly string[];
  /** 마감 배지 문구 */
  deadline: string;
  /**
   * 상시 채용이면 배지를 회색 테두리로 그린다.
   * 컴포넌트가 '상시' 라는 문구를 알고 비교하지 않도록 값으로 둔다.
   */
  alwaysOpen: boolean;
}

export interface PlaybookLeaderRow {
  rank: number;
  /** 닉네임도 가린다 */
  name: string;
  /** 'WEEK 0n 진행 중 · 산출물 n개' */
  status: string;
  /** 0~100. 진행률 막대 폭이자 오른쪽에 적히는 숫자다 */
  percent: number;
  /** 「나의 진행률」 줄. 딱 한 줄만 true 이고 그 줄만 강조한다 */
  isMe: boolean;
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
  /**
   * 첫 번째 탭이 열려 있는 상태로 시작한다.
   *
   * 7·8번 시안은 첫 탭이 「10주 취준 계획모음」이지만 6번 시안과 다르다.
   * 「10주 취준 계획」으로 통일한다 (PRD 5.1).
   */
  tabsLabel: '플레이북 화면 전환',
  tabs: [
    { id: 'plan', icon: '📅', label: '10주 취준 계획' },
    { id: 'jobs', icon: '💼', label: '마케팅 채용공고 모음' },
    { id: 'leaderboard', icon: '🏆', label: '패스 참여자 리더보드' },
  ] satisfies PlaybookTab[],
  /** 목업이 펼쳐 보이는 주차. WEEK_PLANS 의 4주차다 */
  weekNo: 4,
  weekTitle: WEEK_PLANS.a[3].title,
  weekDesc:
    '매주 무엇을 해야 하는지, 무엇을 만들어야 하는지를 한눈에 확인합니다.',
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

  /**
   * 탭 2 — 마케팅 채용공고 모음 (시안 7).
   * 실제 채용 API 를 붙이지 않는다. 화면 안의 예시다 (PRD 5.3).
   */
  jobs: {
    title: '이번 주 마케팅 채용공고',
    desc: '여러 채용 사이트를 돌아다니지 않아도, 지원할 마케팅 공고를 플레이북 안에서 확인합니다.',
    rows: [
      {
        company: 'OO 커머스',
        title: '그로스 마케터 (신입/인턴)',
        tags: ['그로스', '데이터', '서울'],
        deadline: 'D-3',
        alwaysOpen: false,
      },
      {
        company: '△△ 뷰티 브랜드',
        title: '콘텐츠 마케터 (신입)',
        tags: ['콘텐츠', 'SNS', '포트폴리오 필수'],
        deadline: 'D-7',
        alwaysOpen: false,
      },
      {
        company: '□□ 에이전시',
        title: '퍼포먼스 마케팅 AE (인턴)',
        tags: ['퍼포먼스', '광고 운용'],
        deadline: 'D-14',
        alwaysOpen: false,
      },
      {
        company: '◇◇ 플랫폼',
        title: '브랜드 마케터 (체험형 인턴)',
        tags: ['브랜드', '캠페인', '전환 가능'],
        deadline: '상시',
        alwaysOpen: true,
      },
    ] satisfies PlaybookJobRow[],
  },

  /**
   * 탭 3 — 패스 참여자 리더보드 (시안 8).
   * 실제 진행률을 조회하지 않는다. 화면 안의 예시다 (PRD 5.4).
   */
  leaderboard: {
    title: '10주 플레이북 진행률 리더보드',
    desc: '함께 패스에 참여하는 사람들의 진행 상황을 확인하며 10주 동안 페이스를 유지합니다.',
    rows: [
      {
        rank: 1,
        name: '마케터지망생**',
        status: 'WEEK 06 진행 중 · 산출물 6개',
        percent: 92,
        isMe: false,
      },
      {
        rank: 2,
        name: '콘텐츠러비**',
        status: 'WEEK 05 진행 중 · 산출물 5개',
        percent: 81,
        isMe: false,
      },
      {
        rank: 3,
        name: '나의 진행률',
        status: 'WEEK 04 진행 중 · 산출물 3개',
        percent: 64,
        isMe: true,
      },
      {
        rank: 4,
        name: '그로스준비**',
        status: 'WEEK 04 진행 중 · 산출물 3개',
        percent: 58,
        isMe: false,
      },
      {
        rank: 5,
        name: '퍼포먼스입문**',
        status: 'WEEK 03 진행 중 · 산출물 2개',
        percent: 41,
        isMe: false,
      },
    ] satisfies PlaybookLeaderRow[],
  },
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
