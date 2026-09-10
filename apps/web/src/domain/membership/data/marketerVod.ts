// 시안 12 — 현직자 VOD (PASS BENEFIT 04, MARKETER INSIGHTS).
//
// 시안 제목은 "VOD 3종" 인데 카드는 2장만 그려져 있다. 없는 세 번째를 지어내지 않고
// 시안에 있는 2장만 넣는다 — 화면에 가짜 강의가 뜨는 쪽이 훨씬 나쁘다.
// 세 번째 강의 정보를 받으면 여기에 추가한다.

export interface MarketerVodCard {
  /** 카드 상단 배너 문구 */
  bannerTitleLines: string[];
  bannerSub: string;
  /** 배너 배경 (tailwind 클래스) */
  bannerClass: string;
  /** 배너 우측 배지 */
  bannerBadge: string;
  title: string;
  bullets: string[];
  /** 정가 (취소선) */
  regularPrice: number;
  url: string;
}

export const MARKETER_VOD = {
  badge: 'PASS BENEFIT 04',
  eyebrow: 'MARKETER INSIGHTS',
  title: '현직자가 직접 알려주는 마케팅 취업 전략 VOD 3종',
  sub: '현직자가 직접 들려주는 산업 이야기와 직무 경험을 통해 기업이 원하는 관점과 포트폴리오·면접 전략을 익힐 수 있어요.',
  footnote:
    '패스 참여자는 현직자 클래스 다시보기를 결제 없이 바로 들으실 수 있어요.',
  cards: [
    {
      bannerTitleLines: [
        '1~3년차, 지금 하는 마케터 업무가',
        "'물경력'이 되지 않으려면",
      ],
      bannerSub: '뷰티 회사 CEO가 말하는 뽑고 싶은 지원자의 경험과 성과',
      bannerClass: 'bg-[#29B6F6]',
      bannerBadge: '무료 세미나',
      title: "뷰티 브랜드 CEO가 직접 알려주는 '뽑히는 지원자의 관점'",
      bullets: [
        '채용 결정권자가 직접 알려주는 산업 분석법',
        '브랜드와 시장을 바라보는 실무자의 관점',
        '뽑고 싶은 지원자가 갖춰야 할 산업 이해도와 역량',
      ],
      regularPrice: 29000,
      url: '/program/vod',
    },
    {
      bannerTitleLines: ['영상 PD에서 대학내일 AE로,', '어떻게 가능했을까?'],
      bannerSub:
        '실제 취준에서 활용한 캐릭터 설정부터 경험 연결, 서류·면접 노하우까지',
      bannerClass: 'bg-[#F5333F]',
      bannerBadge: '무료 세미나',
      title: '대학내일 AE 현직자',
      bullets: [
        '영상 PD 경험을 활용한 AE 직무 전환 전략',
        '현직자가 알려주는 AE의 실제 업무와 필요 역량',
        '변화하는 시대에 마케터가 갖춰야 할 핵심 역량',
      ],
      regularPrice: 29000,
      url: '/program/vod',
    },
  ] satisfies MarketerVodCard[],
} as const;
