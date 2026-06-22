// 멤버십 구성(Solution) 섹션 — 허브 앤 스포크 다이어그램 데이터.
// 위성 6종이 중앙 허브(멤버십)로 수렴해 "여러 개를 하나로 통합"을 표현한다.

export interface SolutionSatellite {
  /** 위성 라벨 (구성 요소명) */
  label: string;
  /** 한 줄 보조 설명 */
  hint: string;
}

export const SOLUTION = {
  badge: '멤버십 구성',
  titleLines: [
    '따로 준비하면 비싸고 복잡한 공채 준비,',
    '렛츠커리어가 하나로 묶었어요',
  ],
  /** 중앙 허브 카피 */
  hubTitle: '렛츠커리어 하반기 멤버십',
  hubSub: '7 · 8 · 9월 3개월 올인원',
  /** 허브로 수렴하는 위성 6종 */
  satellites: [
    { label: '챌린지', hint: '경험정리·이력서·자소서·면접' },
    { label: '가이드북', hint: '합격 자소서·이력서 템플릿' },
    { label: '스터디', hint: '함께 완주하는 동료' },
    { label: 'VOD', hint: '직무·취업 인사이트 강의' },
    { label: '현직자 멘토링', hint: '실무자 1:1 피드백' },
    { label: '외부 제휴 서비스', hint: '제휴 혜택으로 비용 절감' },
  ] satisfies SolutionSatellite[],
} as const;
