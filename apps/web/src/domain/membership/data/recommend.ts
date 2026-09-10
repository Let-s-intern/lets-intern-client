// 시안 2 — "마케팅은 하고 싶은데, 그 다음이 막막한 분들".
// 번호가 매겨진 고민 카드 3장. 랜딩 초반에서 방문자가 자기 상황을 찾게 하는 자리다.

export interface RecommendCard {
  /** 카드 좌상단 번호 배지 (01·02·03) */
  no: string;
  title: string;
  desc: string;
}

export const RECOMMEND = {
  eyebrow: 'WHERE DO I START?',
  titleLines: ['마케팅은 하고 싶은데,', '그 다음이 막막한 분들'],
  sub: '관심 있는 공고는 계속 올라오는데 포트폴리오가 부족하다는 이유로 저장만 하고 있지는 않나요?',
  cards: [
    {
      no: '01',
      title: '뭐부터 해야 할지 순서를 모르겠어요',
      desc: '경험정리, 이력서, 자소서, 포트폴리오… 해야 할 것은 많은데, 무엇부터 시작해야 할지 모르겠어요.',
    },
    {
      no: '02',
      title: '경험은 있는데 포트폴리오로 안 엮여요',
      desc: '인턴도 했고 대외활동도 했는데, 막상 포트폴리오로 만들려니 뭘 어떻게 넣어야 할지 막막해요.',
    },
    {
      no: '03',
      title: '어떤 마케터가 될지 아직 못 정했어요',
      desc: '그로스, 퍼포먼스, 콘텐츠, 브랜드… 세부 직무마다 필요한 경험이 다른데 그 기준을 모르겠어요.',
    },
  ] satisfies RecommendCard[],
} as const;
