import type { ChallengeType } from '@/schema';

// 혜택 섹션의 가이드북 블록(시안 7-1)과 렛츠런 스터디 블록(시안 7-4) 데이터.
//
// GUIDEBOOK_ITEMS 와 STUDY_DETAIL_URL 은 ui/BenefitModal.tsx 에 있던 상수를 그대로 옮긴 것이다.
// 모달은 제휴 혜택 섹션(PartnerBenefitsSection)에서 아직 쓰이므로 여기서 import 해 간다.

/** 렛츠런 스터디 상세페이지(lets run 4주 스터디 3기) */
export const STUDY_DETAIL_URL =
  'https://www.letscareer.co.kr/program/challenge/288/lets-run-4주-스터디-3기';

export interface GuidebookItem {
  label: string;
  /** public/images/membership/ 하위 파일명 */
  src: string;
  /**
   * 가이드북인지 챌린지인지. URL 에서 눈치로 알아내지 않고 명시한다 —
   * 카드 하단 문구("가이드북/챌린지 자세히 보기")가 이 값을 따라간다.
   */
  kind: 'guidebook' | 'challenge';
  /**
   * 챌린지 카드만 갖는다. 어드민에 등록된 최신 기수 썸네일을 타입별로 가져오는 키다
   * (`lib/useChallengeThumbnails`). 없으면 `src` 정적 파일로 되돌아간다.
   */
  challengeType?: ChallengeType;
  url: string;
}

// 시안 11 — 취준 필수 자료 7종.
//
// 시안의 카드 제목 4개가 썸네일과 어긋나 있었다(썸네일은 "이력서 완성 가이드북" 인데
// 제목은 "포트폴리오 2주 완성 챌린지" 등). 제목을 그대로 쓰면 "포트폴리오 완성
// 가이드북" 이 세 번 나오는 반면, 썸네일 7장은 서로 겹치지 않고 "7종" 과도 맞는다.
// 그래서 **썸네일 기준**으로 제목을 맞췄다(LC-3294 결정).
//
// 7종 중 5종은 가이드북(`/program/guidebook/{id}`)이고, <b>대기업 자소서·인적성 2종은
// 가이드북이 아니라 챌린지다.</b> 그 둘은 대응하는 가이드북 자료가 없는데 시안에는
// 카드가 있어서, 처음에 이름을 "가이드북" 으로 붙이고 링크를 주제가 비슷한 다른
// 가이드북(각각 5·9번)으로 걸어 두었다. 5·9는 자기소개서·면접 가이드북이라 이미
// 다른 카드가 쓰고 있던 주소였고, 눌러도 404 가 아니라 "그럴싸한 다른 문서" 가 열려서
// 오래 눈에 띄지 않았다. 이름을 "챌린지" 로 바로잡고 링크를 실제 챌린지로 돌린다.
//
// 챌린지 2종은 기수 ID 를 박지 않고 `/challenge/{type}/latest` 로 보낸다. 기수는 계속
// 새로 열리므로 ID 를 적어 두면 다음 기수에 낡는다. 이 경로는 모집중인 B2C 챌린지를
// 먼저 찾고, 없으면 노출된 가장 최근 기수로 보낸다(`useLatestChallengeRedirect`).
// 챌린지 10종 섹션(challengeModalItems.ts)도 같은 경로를 쓴다.
//
// 절대 URL 이 아니라 앱 내부 상대경로인 것도 의도다. 절대 URL 은 dev·로컬에서도
// 프로덕션 도메인으로 나가버린다(GUIDEBOOK_CARD 주석과 같은 이유).
export const GUIDEBOOK_ITEMS: GuidebookItem[] = [
  {
    label: '기필코 경험정리 가이드북',
    kind: 'guidebook',
    src: 'guide-experience.png',
    url: 'https://www.letscareer.co.kr/program/guidebook/7',
  },
  {
    label: '이력서 완성 가이드북',
    kind: 'guidebook',
    src: 'guide-resume.png',
    url: 'https://www.letscareer.co.kr/program/guidebook/6',
  },
  {
    label: '자기소개서 완성 가이드북',
    kind: 'guidebook',
    src: 'guide-coverletter.png',
    url: 'https://www.letscareer.co.kr/program/guidebook/5',
  },
  {
    // 가이드북 아님. 2026-09-10 기준 대기업 자기소개서 완성 챌린지 13기(389)로 간다.
    label: '대기업 자소서 완성 챌린지',
    kind: 'challenge',
    challengeType: 'PERSONAL_STATEMENT_LARGE_CORP',
    src: 'challenge-major-coverletter.jpg',
    url: '/challenge/personal-statement-large-corp/latest',
  },
  {
    label: '포트폴리오 완성 가이드북',
    kind: 'guidebook',
    src: 'guide-portfolio.png',
    url: 'https://www.letscareer.co.kr/program/guidebook/2',
  },
  {
    // 가이드북 아님. 2026-09-10 기준 인적성 검사 수리/추리 뽀개기 3기(373)로 간다.
    // 인적성 전용 타입이 없어 ETC 를 쓴다. `/challenge/aptitude/latest` 라우트도 같은
    // 타입으로 최신 기수를 찾으므로 링크와 썸네일이 항상 같은 기수를 가리킨다.
    // 인적성이 아닌 ETC 챌린지가 생기면 둘 다 그쪽으로 끌려간다 — 그때는 전용 타입이 필요하다.
    label: '인적성 수리/추리 뽀개기 챌린지',
    kind: 'challenge',
    challengeType: 'ETC',
    src: 'challenge-aptitude.webp',
    url: '/challenge/aptitude/latest',
  },
  {
    label: '면접 준비 끝장 가이드북',
    kind: 'guidebook',
    src: 'guide-interview.png',
    url: 'https://www.letscareer.co.kr/program/guidebook/9',
  },
];

/** 혜택 섹션의 단일 카드 (가이드북 · 스터디) */
export interface BenefitHighlightCard {
  title: string;
  desc: string;
  badges: string[];
  /** public/images/membership/ 하위 파일명 */
  src: string;
  url: string;
  imgAlt: string;
}

// 시안 7-1. 카드 하나로 가이드북 전종을 소개한다(표지 6권 일러스트).
//
// 링크는 개별 가이드북 상세가 아니라 가이드북 목록으로 보낸다 — 카드가 "6종"을 소개하므로
// 한 권만 열어주면 나머지를 못 찾는다. 앱 내부 상대경로라 dev·로컬에서도 그대로 동작한다
// (GUIDEBOOK_ITEMS 의 절대 URL 은 프로덕션 도메인으로 나가버린다).
export const GUIDEBOOK_LIST_URL = '/program?type=GUIDEBOOK';

export const GUIDEBOOK_CARD: BenefitHighlightCard = {
  title: '가이드북',
  desc: '경험정리부터 자기소개서, 면접까지 취업에 필요한 준비를 내 속도에 맞춰 진행할 수 있어요.',
  badges: ['11/30까지 열람 가능'],
  src: 'guidebook-set.webp',
  url: GUIDEBOOK_LIST_URL,
  imgAlt: '취업 준비 핵심 단계 가이드북 6종 표지',
};

// 시안 7-4
export const STUDY_CARD: BenefitHighlightCard = {
  title: '렛츠런 스터디',
  desc: '운영진의 초집중 케어와 함께 매주 목표를 세우고 인증하는 온라인 스터디에 3개월간 무료로 참여해보세요. 같은 목표를 가진 사람들과 꾸준한 준비 루틴을 만들어요.',
  badges: ['무료 참여', '페이백 불가'],
  src: 'study-banner.png',
  url: STUDY_DETAIL_URL,
  imgAlt: '렛츠런 스터디 배너',
};
