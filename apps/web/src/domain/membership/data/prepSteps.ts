// 준비 단계 카드 7장 — 시안 4-0.png(접힘) · 4-1 펼치기.png(펼침).
//
// 시안 두 장이 서로 다르게 적힌 곳이 있다. 아이브로우(`PARTICIPANT STORIES` /
// `FROM PARTICIPANTS`), STEP 03 제목(`지원 가능한 결과물 만들기` / `지원 가능한 서류
// 만들기`), STEP 01·02 의 할 일 끝말(`만들기·적어보기` / `작성`), GOAL 의 할 일 두 줄이
// 그렇다. **PRD 4.4 와 같은 쪽인 `4-1 펼치기.png` 를 따랐다.**
// 다만 `CHECKPOINT` 는 4-1 만 `CHECK POINT` 로 띄어 써서, PRD 와 4-0 쪽을 따랐다.
//
// **펼침 안의 링크는 새로 짓지 않는다 (PRD 7절 E).** 챌린지는 `challengeModalItems.ts`
// 에서 타입으로 끌어오고, 아직 상세 링크가 없는 LIVE 클리닉·멘토링은 같은 랜딩 안의
// 기존 섹션 앵커를 가리킨다.

import type { ChallengeType } from '@/schema';

import { CHALLENGE_ITEMS } from './challengeModalItems';
import type { CheckupAreaId } from './checkup';

export type PrepStepKind = 'step' | 'checkpoint' | 'goal';

export interface PrepStepProgram {
  /** 탭 라벨. 프로그램이 하나면 화면에 탭을 그리지 않는다 */
  tabLabel: string;
  /** 프로그램 이름. 썸네일 대체 텍스트로도 쓴다 */
  title: string;
  /** `public/images/membership/` 하위 파일명. 없으면 재생 표시 자리로 그린다 */
  src?: string;
  url: string;
}

export interface PrepStepExpand {
  /** 펼침 토글에 적히는 문구 */
  toggleLabel: string;
  /** CHECKPOINT 의 `ONLY PASS` 배지 */
  badge?: string;
  programs: readonly PrepStepProgram[];
  ctaLabel: string;
}

export interface PrepStep {
  id: string;
  kind: PrepStepKind;
  /** 화면에 그대로 찍히는 라벨 (STEP 01 · CHECKPOINT · GOAL) */
  label: string;
  title: string;
  /** 할 일 2줄 */
  todos: readonly [string, string];
  /**
   * 진단 결과가 이 카드를 고르는 기준.
   *
   * **영역 하나에 카드 하나다.** 둘 이상이 같은 영역을 가리키면 "여기부터 시작" 배지가
   * 두 장에 붙어 시작점이 사라진다. 그래서 STEP 04·CHECKPOINT·GOAL 에는 영역이 없다 —
   * 시작점은 늘 처음 막힌 4영역 중 하나다.
   */
  areaId?: CheckupAreaId;
  expand?: PrepStepExpand;
}

/** 기존 챌린지 카드 데이터에서 링크와 썸네일을 그대로 가져온다 */
function challengeProgram(
  tabLabel: string,
  challengeType: ChallengeType,
): PrepStepProgram {
  const item = CHALLENGE_ITEMS.find((it) => it.challengeType === challengeType);
  if (!item) throw new Error(`챌린지 카드를 찾을 수 없다: ${challengeType}`);

  return { tabLabel, title: item.label, src: item.src, url: item.url };
}

export const PREP_STEPS = {
  eyebrow: 'FROM PARTICIPANTS',
  titleLines: ['마케터 취뽀까지,', '지금부터 이 순서대로 준비해 보세요!'],
  sub: '진단 결과를 바탕으로 지금 필요한 단계부터 하나씩 완성해보세요.',
  /** 결과 카드의 "준비 단계 확인하기" 가 가리키는 앵커 */
  anchorId: 'prep-steps',
  /** 진단 결과가 가리키는 카드에만 붙는다 */
  resultBadge: '진단 결과, 여기부터 시작',
} as const;

export const PREP_STEP_CARDS: readonly PrepStep[] = [
  {
    id: 'step-01',
    kind: 'step',
    label: 'STEP 01',
    title: '지원할 직무와 기준 정하기',
    todos: ['관심 직무의 채용공고·필요역량 분석', '마케팅 지원 서류 초안 작성'],
    areaId: 'direction',
    expand: {
      toggleLabel: '혼자하기 어렵다면?',
      programs: [challengeProgram('마케팅', 'MARKETING')],
      ctaLabel: '챌린지로 함께하기',
    },
  },
  {
    id: 'step-02',
    kind: 'step',
    label: 'STEP 02',
    title: '내 경험에서 쓸 재료 찾기',
    todos: [
      '지금까지의 경험 빠짐없이 작성',
      '직무와 연결할 경험·인사이트 찾기',
    ],
    areaId: 'experience',
    expand: {
      toggleLabel: '혼자하기 어렵다면?',
      programs: [challengeProgram('경험정리', 'EXPERIENCE_SUMMARY')],
      ctaLabel: '챌린지로 함께하기',
    },
  },
  {
    id: 'checkpoint',
    kind: 'checkpoint',
    label: 'CHECKPOINT',
    title: '지원서 초안으로 경험 점검하기',
    todos: [
      '내 경험 수준을 객관적으로 점검',
      '지원할 마케팅 직무, 지원 범위 결정',
    ],
    expand: {
      toggleLabel: '전문가 점검으로 취뽀를 앞당기고 싶다면?',
      badge: 'ONLY PASS',
      programs: [
        {
          tabLabel: 'LIVE 클리닉',
          title: '쥬디 멘토 경험정리 LIVE 클리닉',
          // 상세 링크가 아직 없다. 같은 랜딩의 LIVE 클리닉 섹션으로 내려보낸다.
          url: '#special-live',
        },
      ],
      ctaLabel: 'LIVE 클리닉 자세히 보기',
    },
  },
  {
    id: 'step-03',
    kind: 'step',
    label: 'STEP 03',
    title: '지원 가능한 서류 만들기',
    todos: [
      '이력서·자소서·포트폴리오 초안 완성',
      '채용공고에 맞게 핵심 경험 다듬기',
    ],
    areaId: 'document',
    expand: {
      toggleLabel: '혼자하기 어렵다면?',
      programs: [
        challengeProgram('이력서', 'CAREER_START'),
        challengeProgram('자소서', 'PERSONAL_STATEMENT'),
        challengeProgram('포폴', 'PORTFOLIO'),
      ],
      ctaLabel: '선택한 챌린지 함께하기',
    },
  },
  {
    id: 'step-04',
    kind: 'step',
    label: 'STEP 04',
    title: '지원 서류 수준 점검하기',
    todos: [
      '채용 기준과 내 결과물 비교하기',
      '강점과 부족한 부분·보완 순서 정하기',
    ],
    expand: {
      toggleLabel: '혼자하기 어렵다면?',
      programs: [
        {
          tabLabel: '1:1 멘토링',
          title: '1:1 Live 멘토링 · 커피챗',
          src: 'mentoring-coupon.webp',
          // 멘토링도 상세 링크가 없다. 같은 랜딩의 쿠폰 섹션으로 내려보낸다.
          url: '#mentoring-coupon',
        },
      ],
      ctaLabel: '현직자에게 점검받기',
    },
  },
  {
    id: 'step-05',
    kind: 'step',
    label: 'STEP 05',
    title: '지원 및 면접 준비 하기',
    todos: ['경험 기반 예상 질문 제작하기', '질문에 따른 답변 세트 준비하기'],
    areaId: 'apply',
    expand: {
      toggleLabel: '혼자하기 어렵다면?',
      programs: [challengeProgram('면접', 'MEETING_PREPARATION')],
      ctaLabel: '챌린지로 함께하기',
    },
  },
  {
    id: 'goal',
    kind: 'goal',
    label: 'GOAL',
    title: '마케터 취뽀하기 🎉',
    todos: ['직무에 맞는 지원 서류 완성', '실제 지원 → 면접 → 최종 합격'],
  },
];

/** 진단 결과가 가리키는 카드. 없으면 undefined */
export function findPrepStepByArea(
  areaId: CheckupAreaId | null,
): PrepStep | undefined {
  if (!areaId) return undefined;
  return PREP_STEP_CARDS.find((step) => step.areaId === areaId);
}
