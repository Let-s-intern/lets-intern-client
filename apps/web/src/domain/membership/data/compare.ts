// 비교(Compare) 섹션 — "공채 n번째 탈락자 vs 공채 단기간 합격자".
// 준비 안 한 사람(loser) vs 7월부터 준비한 합격자(winner)를 카드 2장으로 대비한다.
// 세미나 카드(SeminarSessionCard)의 위계 문법을 차용: winner=브랜드 강조, loser=톤다운.

export interface ComparePanel {
  /** 시각 위계 구분 — winner(강조) vs loser(톤다운) */
  kind: 'loser' | 'winner';
  /** 카드 그라데이션 헤더에 들어가는 제목 */
  heading: string;
  /** 체크 항목 — 각 유형의 준비 모습 3가지 */
  items: string[];
}

export const COMPARE = {
  badge: '왜 지금 시작해야 할까',
  /** 타이틀 3토막 — lead vs hi(강조) */
  titleLead: '공채 n번째 탈락자',
  titleVs: 'vs',
  titleHi: '공채 단기간 합격자',
  loser: {
    kind: 'loser',
    heading: '공채 n번째 탈락자',
    items: [
      '미루고 미루다 공고 뜨면 급하게 지원서 작성',
      '뭐부터 준비할지 몰라 하나도 제대로 못 챙김',
      '탈락 경험은 있지만 뭐가 부족한지 몰라 또 똑같이 준비',
    ],
  },
  winner: {
    kind: 'winner',
    heading: '7월부터 준비한 합격자',
    items: [
      '7월부터 플랜에 맞춰 철저하게 대비',
      '현직자 피드백과 무수한 연습으로 서류·면접 퀄리티 향상',
      '합격자 예시 참고해 미리 지원서 완성',
    ],
  },
} as const satisfies {
  badge: string;
  titleLead: string;
  titleVs: string;
  titleHi: string;
  loser: ComparePanel;
  winner: ComparePanel;
};
