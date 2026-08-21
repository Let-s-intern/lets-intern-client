// 하반기 공채 로드맵 섹션 데이터. (시안 1.png)
// 트랙 선 위/아래로 카드가 번갈아 붙는 5노드 지그재그 타임라인.

/** 카드 우상단 아이콘 식별자 (lucide-react 매핑 키) */
export type RoadmapIcon =
  | 'fileText'
  | 'clipboardCheck'
  | 'messagesSquare'
  | 'userRoundCheck'
  | 'flag';

export interface RoadmapNode {
  /** 트랙 위 번호. null 이면 번호 대신 체크 아이콘을 그린다(마지막 노드) */
  step: number | null;
  /** 카드 좌상단 날짜 칩 문구 */
  dateChip: string;
  /** 카드 우상단 아이콘 키 */
  icon: RoadmapIcon;
  title: string;
  body: string;
  /** 트랙 선 기준 카드 위치 */
  side: 'above' | 'below';
}

export const ROADMAP = {
  badge: '2026 하반기 공채 로드맵',
  /** 의미가 끊기는 자리에서 자른다. 601px 이상에서는 한 줄로 붙는다(base.css 의 .brk) */
  titleLines: ['공채 일정에 맞춰,', '지금 필요한 준비를 이어가세요'],
  subLines: [
    '서류 접수부터 최종 면접까지,',
    '전형별로 필요한 준비를 놓치지 마세요',
  ],
  nodes: [
    {
      step: 1,
      dateChip: '8월~9월',
      icon: 'fileText',
      title: '서류 접수',
      body: '나만의 스토리로 이력서와 자소서를 탄탄하게 완성해요',
      side: 'above',
    },
    {
      step: 2,
      dateChip: '10월',
      icon: 'clipboardCheck',
      title: '역량·인적성 검사',
      body: '기업별 검사 유형을 미리 익히고 실전 감각을 끌어올려요',
      side: 'below',
    },
    {
      step: 3,
      dateChip: '10월~',
      icon: 'messagesSquare',
      title: '면접 대비 경험정리',
      body: '직무 경험과 예상 질문을 중심으로 디테일한 답변을 준비해요',
      side: 'above',
    },
    {
      step: 4,
      dateChip: '10월 말~12월',
      icon: 'userRoundCheck',
      title: '1차/2차 면접',
      body: '임원·인성 면접 기출에 맞춰 최종 합격 답변을 다듬어요',
      side: 'below',
    },
    {
      step: null,
      dateChip: '12월~',
      icon: 'flag',
      title: '최종 합격',
      body: '렛츠커리어와 함께 취뽀하고 설레는 마음으로 입사 준비하세요!',
      side: 'above',
    },
  ] as RoadmapNode[],
  /** 하단 마무리 문구. highlight 만 파란색으로 강조한다 */
  outro: {
    lead: '전형은 이어지니까, ',
    highlight: '준비도 끊기지 않게',
    subLines: [
      '올인원 패스로 하반기 공채 전형을',
      '단계별로 탄탄하게 대비해 보세요.',
    ],
  },
} as const;
