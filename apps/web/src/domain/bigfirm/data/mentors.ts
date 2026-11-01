// letscareer.co.kr/live-mentoring/{id} 상세페이지에 공개된 정보만 사용 (2026-10-29 수집).
// org·role은 상세페이지의 소속/경력 표기 그대로(role은 직급이 아니라 직무), tags는 렛츠커리어 챌린지 핵심 멘토 표기만.
// 순서: 누적 멘토링(letscareer.co.kr/mentors/{id}의 피드백 멘티 수, 2026-10-30) 많은 순.

// 다른 태그와 색을 달리해 강조하는 태그
export const CHALLENGE_TAG = '대기업 챌린지 핵심 멘토';
/** 태그가 많은 카드용 축약 표기 (같은 색) */
export const CHALLENGE_SHORT_TAG = '대기업 챌린지 멘토';
export const PORTFOLIO_TAG = '포트폴리오 챌린지 핵심 멘토';
export const MARKETING_TAG = '마케팅 챌린지 핵심 멘토';
export const PM_TAG = 'PM 챌린지 핵심 멘토';
export const LIVE_TAG = '1:1 LIVE 핵심 멘토';
export const SEMINAR_TAG = '세미나';

export type CompanyGroup = 'top100' | 'nklcb';

export type Mentor = {
  id: number;
  name: string;
  /** 아바타 원 안의 짧은 직무 표기 */
  badge: string;
  color: string;
  org: string;
  role: string;
  tags: string[];
  /** 현직 연차 (사용자 제공, 2026-10-30) */
  years?: number;
  quote: string;
  /** 공채 탈락자에게 줄 수 있는 가치 한 줄 (상세페이지 내용 기반). 없으면 quote로 대체 */
  focus?: string;
  group: CompanyGroup;
};

export const MENTORS: Mentor[] = [
  {
    id: 13276,
    name: '제이미',
    badge: 'IT',
    color: '#4d55f5',
    org: 'CJ그룹',
    role: '개발자',
    tags: [CHALLENGE_SHORT_TAG, SEMINAR_TAG],
    years: 10,
    quote:
      '서류부터 면접까지 막히는 지점을 AI 시대 채용 기준에 맞춰 현실적으로 짚어 드릴게요.',
    focus:
      '서류 1곳 빼고 다 떨어졌던 자소서를,\n대기업 8곳을 합격한 자소서로\n바꾼 비결을 알려드려요',
    group: 'top100',
  },
  {
    id: 5895,
    name: '트로이',
    badge: 'PM',
    color: '#c0571f',
    org: '카카오 그룹',
    role: 'Product Manager',
    tags: [PM_TAG, SEMINAR_TAG],
    years: 1,
    quote: '현직 PM의 시선으로 포트폴리오와 취업 전략을 실전처럼 점검해드려요.',
    focus:
      'JD에 내 경험을 하나씩 대입해, 포트폴리오에서 막히는 부분부터 찾아드려요',
    group: 'nklcb',
  },
  {
    id: 3928,
    name: '나비',
    badge: '영업',
    color: '#2d8a5f',
    org: '반도체 대기업',
    role: '영업마케팅',
    tags: [CHALLENGE_TAG, SEMINAR_TAG],
    years: 3,
    quote:
      '같은 경험이더라도 무엇을 강조하느냐에 따라 전혀 다른 자소서가 될 수 있어요.',
    focus:
      '같은 경험도 무엇을 강조하느냐에 따라 달라져요. 직무에 맞는 강점과 컨셉을\n다시 잡아드려요',
    group: 'top100',
  },
  {
    id: 5357,
    name: '매튜',
    badge: '전략',
    color: '#0a8fc4',
    org: '현대차그룹 주요 계열사',
    role: '전략기획',
    tags: [CHALLENGE_TAG],
    years: 3,
    quote: '특정 직무에 한정하지 않고 문과 직무 전반의 취업 준비를 함께합니다.',
    focus:
      '문항 의도와 직무 요구에 맞는지,\n소재 선택부터 답변 구조까지 다시 점검해드려요',
    group: 'top100',
  },
  {
    id: 3929,
    name: '리아',
    badge: '전략',
    color: '#f2694b',
    org: '모빌리티 제조업 대기업',
    role: '전략기획',
    tags: [CHALLENGE_TAG],
    years: 6,
    quote: '같은 소재로 AI를 활용해도 잘 읽히는 자소서는 따로 있습니다.',
    focus:
      '같은 소재여도 잘 읽히는 자소서는\n따로 있어요. 두괄식 구조로\n끝까지 읽히게 다듬어드려요',
    group: 'top100',
  },
  {
    id: 1235,
    name: '널',
    badge: '개발',
    color: '#5a6478',
    org: 'SI 대기업',
    role: '풀스택 개발',
    tags: [PORTFOLIO_TAG],
    years: 1,
    quote: '내 경험을 읽기 쉽게, 듣기 쉽게 전달하는 방법을 함께 고민해봐요.',
    focus:
      '프로젝트는 많은데 서류에서\n안 보였다면, 수치와 근거로 어필하는\n정리법을 알려드려요',
    group: 'top100',
  },
  {
    id: 16385,
    name: '호이',
    badge: '마케팅',
    color: '#d1407a',
    org: '네카라쿠배',
    role: '마케터',
    tags: [MARKETING_TAG],
    years: 3,
    quote:
      '중고신입으로 대기업에 합격하기까지 겪은 시행착오를 아낌없이 나눌게요.',
    focus:
      '6개 회사를 거치며 겪은 시행착오로,\n다음 지원 방향을 함께 잡아드려요',
    group: 'nklcb',
  },
  {
    id: 14758,
    name: '바다',
    badge: 'AI',
    color: '#7a52e0',
    org: '현대 계열사',
    role: 'AI 데이터 분석가',
    tags: [PORTFOLIO_TAG],
    years: 4,
    quote: '대기업 AI 개발자로 취업을 꿈꾸는 모든 분들께 도움이 되고 싶습니다.',
    focus: '실무자 입장에서 매력적인 AI 개발자 지원자는 누구인지 알려드려요',
    group: 'top100',
  },
  {
    id: 18644,
    name: 'Jino',
    badge: '데이터',
    color: '#1f7f8c',
    org: '쿠팡',
    role: '데이터 분석',
    tags: [LIVE_TAG, SEMINAR_TAG],
    years: 3,
    quote:
      'PM에서 데이터·AI로 넓혀 온 실무 경험으로 직무 선택과 이력서·포트폴리오 방향을 잡아드려요.',
    focus:
      '2026 하반기 토스·CJ올리브영·뤼튼\n서류 합격 사례로,\n내 경험 정리 방향을 잡아드려요',
    group: 'nklcb',
  },
];

export const COMPANY_TABS: { key: 'all' | CompanyGroup; label: string }[] = [
  { key: 'all', label: '전체 보기' },
  { key: 'top100', label: '100대 기업' },
  { key: 'nklcb', label: '네카라쿠배' },
];
