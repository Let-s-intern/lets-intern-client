// 멤버십 구성(Solution) 섹션 — 허브 앤 스포크 다이어그램 데이터.
// 위성 6종이 중앙 허브(올인원 패스)로 수렴해 "여러 개를 하나로 통합"을 표현한다.

/** 위성 아이콘 식별자 (lucide-react 매핑 키) */
export type SolutionSatelliteIcon =
  | 'flag'
  | 'bookOpen'
  | 'users'
  | 'monitorPlay'
  | 'mentoring'
  | 'route';

export interface SolutionSatellite {
  /** 위성 라벨 (구성 요소명) */
  label: string;
  /** 한 줄 보조 설명 */
  hint: string;
  /** 아이콘 키 */
  icon: SolutionSatelliteIcon;
}

export const SOLUTION = {
  badge: '공채 준비 올인원 패스 구성',
  titleLines: [
    '따로 준비하면 비싸고 복잡한 공채 준비를',
    '렛츠커리어가 하나로 묶었어요',
  ],
  /** titleLines 안에서 파란색으로 강조할 어절 */
  titleHighlight: '하나로',
  /** 중앙 허브 카피 (시안 2.png 은 2줄) */
  hubTitleLines: ['렛츠커리어', '공채 준비 올인원 패스'],
  hubSub: '9 · 10 · 11월 3개월 올인원',
  /** 다이어그램 하단 서브카피 */
  subLines: [
    '자소서·인적성·면접·스터디까지',
    '하반기 공채에 필요한 준비를 모두 준비했어요!',
  ],
  /**
   * 허브로 수렴하는 위성 6종.
   * 배치는 solution.css 의 nth-of-type 좌표에 묶여 있다 —
   * 홀수(1·3·5)가 좌측 열, 짝수(2·4·6)가 우측 열이므로 순서를 바꾸지 마라.
   */
  satellites: [
    {
      label: '챌린지',
      hint: '경험정리, 이력서, 자소서, 면접, 인적성 등',
      icon: 'flag',
    },
    { label: '가이드북', hint: '이력서, 자소서 등 6종', icon: 'bookOpen' },
    {
      label: '렛츠커리어 커뮤니티',
      hint: '함께 취뽀까지 완주하는 동료',
      icon: 'users',
    },
    { label: 'VOD', hint: '현직자 세미나 20종 모음집', icon: 'monitorPlay' },
    {
      label: '1:1 멘토링 할인권',
      hint: '현직자와의 개별 Q&A, 커피챗',
      icon: 'mentoring',
    },
    {
      label: '13주 플레이북',
      hint: '하반기 공채 주차별 합격 플랜',
      icon: 'route',
    },
  ] satisfies SolutionSatellite[],
} as const;
