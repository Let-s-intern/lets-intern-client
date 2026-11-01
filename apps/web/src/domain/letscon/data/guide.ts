export const LETSCON_REFUND_STEPS = [
  {
    when: '신청 시',
    title: '보증금 결제',
    body: '15,000원 결제 후 현장 좌석 확정',
  },
  {
    when: '11/15 일요일',
    title: '현장 체크인',
    body: '행사 당일 방문해 참석 확인',
  },
  {
    when: '11/16 월요일',
    title: '전액 환급',
    body: '체크인 확인 후 보증금 순차 환불',
  },
];

interface GuideRow {
  label: string;
  mobileLabel?: string;
  lines: string[];
  hasMapLink?: boolean;
}

export const LETSCON_GUIDE_ROWS: GuideRow[] = [
  {
    label: '일정',
    lines: [
      '11/14(토) 19:00~22:10 온라인',
      '11/15(일) 14:30~18:45 오프라인 + 온라인',
    ],
  },
  {
    label: '장소',
    lines: ['성동청년창업이룸센터', '서울특별시 성동구 왕십리로 137'],
    hasMapLink: true,
  },
  {
    label: '온라인만',
    lines: ['무료. 4개 세션 생중계 링크를 행사 당일 보내드립니다.'],
  },
  {
    label: '온라인 + 오프라인',
    lines: [
      '무료(보증금 15,000원) · 11/15 현장 두 세션 + 11/14 온라인 시청 포함 · 선착순 60명',
    ],
  },
  {
    label: '신청 마감',
    lines: [
      '온라인만 : 11/15(일) 16:30',
      '온라인 + 오프라인 : 11/12(목) 23:59 (선착순 60명 마감 시 조기 종료)',
    ],
  },
  {
    label: '환급',
    lines: [
      '11/15 당일 현장에서 1회 체크인하면, 다음 날(11/16) 보증금이 전액 순차 환불됩니다.',
    ],
  },
  {
    label: '오프라인 참여 노쇼',
    mobileLabel: '오프라인 노쇼',
    lines: ['체크인 기록이 없으면 보증금은 환급되지 않습니다.'],
  },
];

export const LETSCON_NEXT_STEPS = [
  {
    tag: '01 · 렛츠콘',
    title: '취준의 방향 찾기',
    body: '현직자의 커리어 이야기와 채용 관점으로, 지금 필요한 경험을 발견해요.',
  },
  {
    tag: '02 · 11월 올인원 패스',
    title: '준비를 행동으로 옮기기',
    body: '직무 특화 챌린지를 통해 서류를 준비하고, 실제 채용 지원으로 연결해요.',
  },
  {
    tag: '03 · 다음 공채',
    title: '쌓은 경험으로 다시 도전',
    body: '지원 과정에서 찾은 개선점과 새로운 경험을 바탕으로 2027년 상반기를 준비해요.',
  },
];
