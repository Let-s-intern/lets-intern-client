// 시안 3 — "마케팅 채용은 많지만 나에게 맞는 기회는 따로 있습니다" (WHY NOW).
//
// 좌측 공고 목록은 **실시간 연동이 아니다.** 시안 각주에 "직무 이해를 돕기 위해 실제 채용
// 시장을 바탕으로 재구성한 예시" 라고 적혀 있고, 화면에도 그 각주를 그대로 노출한다.
// 실제 공고처럼 보이되 지원할 수 없는 목록이라, 각주를 빼면 사용자를 속이게 된다.
//
// 기업명을 특정하지 않고 업종으로만 적는 것도 같은 이유다. 로고와 사명을 넣으면
// 그 회사가 지금 뽑는다는 뜻이 되어 버린다.

export interface JobPostingExample {
  /** 기업 로고. public/images/membership/ 하위 파일명 */
  logo: string;
  /** 업종 (기업명 대신) */
  industry: string;
  /** 직무명 */
  role: string;
  /** 직무를 이루는 업무 3가지 */
  tasks: string;
  /** 인턴 · 신입 · 경력직 */
  level: string;
}

export const JOB_MARKET = {
  eyebrow: 'WHY NOW',
  listTitle: '지금 모집 중인 마케팅 직무',
  /** 시안 3 의 585건. 실측이 아니라 시장 규모를 보여 주는 예시 수치다 */
  listCount: '585건',
  listCaption: '채용공고 예시',
  footnote:
    '* 직무 이해를 돕기 위해 실제 채용 시장을 바탕으로 재구성한 예시입니다.',
  postings: [
    {
      logo: 'job-logo-tech.png',
      industry: '전자 테크 기업',
      role: 'B2B 기술 마케팅 담당자',
      tasks: '마케팅 전략 · 시장 조사 · 세일즈 콘텐츠',
      level: '인턴',
    },
    {
      logo: 'job-logo-beauty.png',
      industry: '뷰티 브랜드',
      role: '브랜드 마케팅 인턴',
      tasks: '브랜드 전략 · 캠페인 기획 · 트렌드 분석',
      level: '신입',
    },
    {
      logo: 'job-logo-fnb.png',
      industry: '식품·F&B 기업',
      role: '퍼포먼스 마케터',
      tasks: '광고 운영 · 데이터 분석 · 성과 개선',
      level: '경력직',
    },
    {
      logo: 'job-logo-platform.png',
      industry: '플랫폼 스타트업',
      role: '콘텐츠 마케팅 매니저',
      tasks: 'SNS 콘텐츠 · 카피라이팅 · 채널 운영',
      level: '인턴',
    },
    {
      logo: 'job-logo-commerce.png',
      industry: '글로벌 커머스',
      role: '글로벌 인플루언서 마케팅',
      tasks: '크리에이터 협업 · 글로벌 캠페인 · SNS',
      level: '인턴',
    },
    {
      logo: 'job-logo-lifestyle.png',
      industry: '라이프스타일 기업',
      role: '그로스 마케팅 인턴',
      tasks: '고객 여정 · 실험 설계 · 핵심 지표 관리',
      level: '인턴',
    },
  ] satisfies JobPostingExample[],
  /** 우측 카피 2블록 */
  copies: [
    {
      titleLines: ['마케팅 채용은 많지만', '나에게 맞는 기회는 따로 있습니다'],
      highlight: null,
      body: [
        '같은 ‘마케팅’이어도 공고마다 요구하는 경험과 역량은 다릅니다.',
        '무작정 지원서를 늘리기 전에, 지금 내 준비 수준부터 정확히 인지해야 합니다.',
      ],
    },
    {
      titleLines: [
        '중요한 건, 더 준비하는 것이 아니라',
        '무엇이 부족한지 먼저 아는 것입니다',
      ],
      /** 두 번째 줄만 포인트 컬러 */
      highlight: '무엇이 부족한지 먼저 아는 것입니다',
      body: [
        '준비가 부족하다는 생각에 경험과 스펙부터 계속 쌓을 필요는 없습니다.',
        '지금 가진 경험을 지원 서류로 꺼내봐야 공고가 원하는 기준과 내 현재 수준의 차이가 보입니다.',
      ],
    },
  ],
} as const;
