// 멤버십 구성(Solution) 섹션 — 허브 앤 스포크 다이어그램 데이터.
// 위성 6종이 중앙 허브(멤버십)로 수렴해 "여러 개를 하나로 통합"을 표현한다.

/** 위성 아이콘 식별자 (lucide-react 매핑 키) */
export type SolutionSatelliteIcon =
  | 'flag'
  | 'bookOpen'
  | 'users'
  | 'monitorPlay'
  | 'handshake'
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
    { label: '챌린지', hint: '경험정리·이력서·자소서·면접', icon: 'flag' },
    { label: '가이드북', hint: '이력서, 자소서 등 6종', icon: 'bookOpen' },
    { label: '렛츠런 스터디', hint: '함께 완주하는 동료', icon: 'users' },
    { label: 'VOD', hint: '현직자 세미나 20종 모음집', icon: 'monitorPlay' },
    {
      label: '외부 제휴 서비스',
      hint: '산타토익, 뷰인터, 슈피인턴',
      icon: 'handshake',
    },
    {
      label: '13주 플레이북',
      hint: '하반기 공채 주차별 합격 플랜',
      icon: 'route',
    },
  ] satisfies SolutionSatellite[],
} as const;
