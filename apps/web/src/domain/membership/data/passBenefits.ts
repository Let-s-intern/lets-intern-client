// 시안 6 — "패스 하나로 마케팅 취준 전 과정을 준비하세요" (PASS BENEFITS).
//
// 카드 7장. 시안 1 히어로 하단은 6칸인데 여기는 7칸이다 — 히어로가 쥬디 클리닉과
// LIVE 세미나를 한 칸에 묶었기 때문이고, 시안이 그렇게 그려져 있어 그대로 둔다.
//
// `anchor` 는 "자세히 보기" 가 스크롤할 대상 섹션 id 다. 랜딩 안에서 해당 혜택을 자세히
// 다루는 섹션으로 내려보낸다 — 외부 링크로 내보내면 랜딩을 이탈한다.

export interface PassBenefitCard {
  title: string;
  body: string[];
  /** 스크롤 대상 섹션 id */
  anchor: string;
  /** 강조 카드(연한 주황 배경) 여부 */
  accent?: boolean;
  /** 그리드에서 두 칸을 차지할지 */
  wide?: boolean;
}

export const PASS_BENEFITS = {
  eyebrow: 'PASS BENEFITS',
  title: '패스 하나로 마케팅 취준 전 과정을 준비하세요',
  sub: '진단 결과에 따라 10주 합격 플레이북을 활용해 나의 단계에 맞는 프로그램에 참여하세요',
  cards: [
    {
      title: '10주 합격 플레이북',
      body: [
        '실제로 실행할 수 있는 준비 플랜이에요.',
        '직무 가이드 · 리더보드 · 채용공고를 한번에 이용 하세요.',
      ],
      anchor: 'course-plan',
      accent: true,
    },
    {
      title: '렛츠커리어 챌린지 10종',
      body: [
        '경험정리, 이력서, 자소서, 포트폴리오, 면접까지 필요한 과정부터 참여 하세요.',
      ],
      anchor: 'challenges',
    },
    {
      title: '합격 가이드북 7종',
      body: [
        '자기소개서부터 면접까지 취업에 필요한 준비를 내 속도에 맞춰 진행할 수 있어요.',
      ],
      anchor: 'guidebooks',
    },
    {
      title: '마케팅 현직자 VOD 3종',
      body: ['직무별 실무 이야기와 채용 기준을 통해 준비 방향을 구체화 해요.'],
      anchor: 'vod',
      wide: true,
    },
    {
      title: '1:1 커피챗 멘토링 50% 쿠폰 2장',
      body: [
        '현직자와 1:1 멘토링으로 준비 우선순위를 정하고, 방향을 바로잡을 수 있어요.',
      ],
      anchor: 'mentoring-coupon',
      wide: true,
    },
    {
      title: '쥬디의 경험 진단 · 포폴 클리닉',
      body: [
        '경험 정리와 포트폴리오 구성에 대한 피드백을 받아 보완점을 빠르게 채우세요.',
      ],
      anchor: 'special-live',
      accent: true,
      wide: true,
    },
    {
      title: '특별 LIVE 세미나 2종',
      body: [
        '현직자와 함께하는 실무 세션으로 준비 방향을 바로 확인할 수 있어요.',
      ],
      anchor: 'special-live',
      wide: true,
    },
  ] satisfies PassBenefitCard[],
} as const;
