// 멤버십 혜택 섹션의 "챌린지 1회 무료 참여" 카드 데이터.
//
// 모든 항목은 `/challenge/{slug}/latest` 자동 리다이렉트를 사용한다(앱 내부 상대 경로).
// 해당 타입의 최신 모집중(없으면 최신 노출) 챌린지 상세로 자동 이동하므로, 새 회차가
// 열려도 이 파일을 수정할 필요가 없다. 챌린지 id 를 직접 박으면 안 된다.
// (라우트: apps/web/src/app/(user)/challenge/{slug}/latest/page.tsx → useLatestChallengeRedirect)
//
// 노출 문구(label · desc · badges)는 전부 정적이다. 시안 7-2 / 7-3 에서 그대로 옮겼다.

import type { ChallengeType } from '@/schema';

/** 카드가 놓이는 블록. core = 시안 7-2 세로 리스트, job = 시안 7-3 3열 그리드 */
export type ChallengeBenefitGroup = 'core' | 'job';

export interface ChallengeModalItem {
  label: string;
  /** public/images/membership/ 하위 파일명 */
  src: string;
  url: string;
  /** 시안의 카드 설명. job 그룹은 시안에 설명 영역이 없어 렌더하지 않는다 */
  desc: string;
  badges: string[];
  group: ChallengeBenefitGroup;
  /** 썸네일을 API 조회로 전환할 때 사용할 조회 키 (결정 9) */
  challengeType: ChallengeType;
}

/** 모든 카드에 동일하게 붙는 배지 2종 */
const DEFAULT_BADGES = ['베이직 무료 참여', '플랜 업그레이드 시 차액 결제'];

export const CHALLENGE_ITEMS: ChallengeModalItem[] = [
  {
    label: '기필코 경험정리 챌린지',
    src: 'challenge-experience.jpg',
    url: '/challenge/experience-summary/latest',
    desc: '쓸만한 경험이 없다고 느껴진다면, 먼저 해야 할 건 새로운 스펙을 만드는 게 아니라 이미 가진 경험을 직무 언어로 정리 해야 해요. 1주 동안 하루 30분씩으로 흩어진 활동을 정리하고, 자소서·면접에 바로 꺼내 쓸 수 있는 나만의 경험 데이터베이스를 완성하세요.',
    badges: DEFAULT_BADGES,
    group: 'core',
    challengeType: 'EXPERIENCE_SUMMARY',
  },
  {
    label: '이력서 1주 완성 챌린지',
    src: 'challenge-resume.png',
    url: '/challenge/resume/latest',
    desc: '이력서가 비어 보이는 이유는 경험이 없어서가 아니라, 있는 경험도 채용 언어로 바뀌지 않았기 때문이에요. 활동·프로젝트·역량을 이력서 항목에 맞게 정리하고, 채용담당자가 빠르게 이해하는 직무 FIT 이력서를 완성하세요.',
    badges: DEFAULT_BADGES,
    group: 'core',
    challengeType: 'CAREER_START',
  },
  {
    // 시안 7-2 의 이 카드 설명은 경험정리 카드와 동일한 문구가 들어가 있다(시안 작성 시 임시 문구로 보인다).
    // 지어내지 않고 시안 그대로 옮긴다. 문구 확정 시 이 항목만 교체하면 된다.
    label: '자기소개서 2주 완성 챌린지',
    src: 'challenge-coverletter.jpg',
    url: '/challenge/personal-statement/latest',
    desc: '쓸만한 경험이 없다고 느껴진다면, 먼저 해야 할 건 새로운 스펙을 만드는 게 아니라 이미 가진 경험을 직무 언어로 정리 해야 해요. 1주 동안 하루 30분씩으로 흩어진 활동을 정리하고, 자소서·면접에 바로 꺼내 쓸 수 있는 나만의 경험 데이터베이스를 완성하세요.',
    badges: DEFAULT_BADGES,
    group: 'core',
    challengeType: 'PERSONAL_STATEMENT',
  },
  {
    // 위와 같다 — 시안에 경험정리 카드와 동일한 문구가 들어가 있다.
    label: '대기업 공채 자소서 완성 챌린지',
    src: 'challenge-major-coverletter.jpg',
    url: '/challenge/personal-statement-large-corp/latest',
    desc: '쓸만한 경험이 없다고 느껴진다면, 먼저 해야 할 건 새로운 스펙을 만드는 게 아니라 이미 가진 경험을 직무 언어로 정리 해야 해요. 1주 동안 하루 30분씩으로 흩어진 활동을 정리하고, 자소서·면접에 바로 꺼내 쓸 수 있는 나만의 경험 데이터베이스를 완성하세요.',
    badges: DEFAULT_BADGES,
    group: 'core',
    challengeType: 'PERSONAL_STATEMENT_LARGE_CORP',
  },
  {
    label: '포트폴리오 2주 완성 챌린지',
    src: 'challenge-portfolio.jpg',
    url: '/challenge/portfolio/latest',
    desc: '포트폴리오가 막막하다면, 디자인보다 먼저 필요한 건 내 경험이 설득력 있게 보이는 흐름이에요. 경험 분석부터 목차 선정, 페이지 구성, 디자인 가이드, 최종 점검까지 1주 동안 따라가며 서류 제출에 바로 활용할 수 있는 마스터 포트폴리오를 완성하세요.',
    badges: DEFAULT_BADGES,
    group: 'core',
    challengeType: 'PORTFOLIO',
  },
  {
    label: '면접 준비 끝장 챌린지',
    src: 'challenge-interview.png',
    url: '/challenge/meeting-preparation/latest',
    desc: '면접은 답변을 외우는 시험이 아니라, 내 경험을 질문에 맞게 꺼내 말하는 연습이에요. 7일 동안 빈출 질문과 답변 전략, 실전 연습 템플릿을 따라가며 면접장에서 바로 꺼내 말할 수 있는 나만의 면접 답변 세트를 완성하세요.',
    badges: DEFAULT_BADGES,
    group: 'core',
    challengeType: 'MEETING_PREPARATION',
  },
  {
    // 시안에 면접 카드와 동일한 문구가 들어가 있다. 지어내지 않고 그대로 옮긴다.
    label: '인적성 검사 수리/추리 뽀개기 챌린지',
    src: 'challenge-aptitude.webp',
    url: '/challenge/aptitude/latest',
    desc: '면접은 답변을 외우는 시험이 아니라, 내 경험을 질문에 맞게 꺼내 말하는 연습이에요. 7일 동안 빈출 질문과 답변 전략, 실전 연습 템플릿을 따라가며 면접장에서 바로 꺼내 말할 수 있는 나만의 면접 답변 세트를 완성하세요.',
    badges: DEFAULT_BADGES,
    group: 'core',
    challengeType: 'ETC',
  },
  // 아래 3종은 시안 7-3 (직무별 챌린지). 설명 영역이 없어 desc 는 썸네일에 적힌 소개 문구를 쓴다.
  {
    label: '마케팅 서류 완성 올인원 챌린지',
    src: 'challenge-marketing.png',
    url: '/challenge/marketing/latest',
    desc: '마케팅 현직자 멘토와 함께 하는 서류 완성 올인원 챌린지',
    badges: DEFAULT_BADGES,
    group: 'job',
    challengeType: 'MARKETING',
  },
  {
    label: 'HR/인사 직무 챌린지',
    src: 'challenge-hr.png',
    url: '/challenge/hr/latest',
    desc: 'HR 현직자 멘토와 함께 하는 HR/인사 직무 챌린지',
    badges: DEFAULT_BADGES,
    group: 'job',
    challengeType: 'HR',
  },
  {
    label: 'PM/서비스기획 챌린지',
    src: 'challenge-pm.png',
    url: '/challenge/pm/latest',
    desc: '대기업, 스타트업, IT기업 현직자 멘토와 함께 하는 PM/서비스기획 챌린지',
    badges: DEFAULT_BADGES,
    group: 'job',
    challengeType: 'PM',
  },
];

/**
 * 카드 썸네일의 소스를 결정하는 단일 지점.
 *
 * 어드민에 등록된 썸네일이 있으면 그것을 쓰고, 없으면 `public/images/membership/` 정적
 * 파일로 되돌린다. 어드민 썸네일은 `lib/useChallengeThumbnails.ts` 가 타입별로 가져온다.
 *
 * 폴백을 두는 이유는 두 가지다 — 어드민이 썸네일을 안 넣은 챌린지가 있을 수 있고,
 * 조회가 끝나기 전에도 카드가 비어 보이면 안 된다.
 */
export function getChallengeThumbnailSrc(
  item: ChallengeModalItem,
  remote?: string,
): string {
  return remote || `/images/membership/${item.src}`;
}
