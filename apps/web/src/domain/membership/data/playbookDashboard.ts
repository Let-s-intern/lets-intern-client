// 시안 9 — 플레이북 대시보드 (PASS BENEFIT 01).
//
// **동작하는 도구가 아니라 홍보용 목업이다.** 탭·입력창·버튼처럼 보이는 요소에 동작을
// 붙이지 않는다 — 누르면 아무 일도 일어나지 않는 버튼은 사용자를 속인다. 화면에는
// 클릭할 수 없는 상태로 그린다.
//
// 실제 도구를 만들기로 하면 이 파일과 대응 섹션을 지우고 별도 프로젝트로 다룬다.

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
