// 시안 12 — 현직자 VOD (PASS BENEFIT 04, MARKETER INSIGHTS).
//
// 시안 제목은 "VOD 3종" 인데 카드는 2장만 그려져 있다. 없는 세 번째를 지어내지 않고
// 시안에 있는 2장만 넣는다 — 화면에 가짜 강의가 뜨는 쪽이 훨씬 나쁘다.
// 세 번째 강의 정보를 받으면 여기에 추가한다.

/**
 * 세미나 1 상세 — [무료] 1~3년차, 지금 하는 마케터 업무가 '물경력'이 되지 않으려면.
 *
 * 두 번째 세미나는 아직 공개 전이라 주소가 없다. `url` 을 비워 두면 카드에서 "자세히
 * 보기" 버튼이 사라진다 — 보낼 곳이 정해지기 전까지는 그게 맞다. 공개되면 여기 상수를
 * 하나 더 두고 그 카드의 `url` 에 넣으면 버튼이 다시 나온다.
 */
const SEMINAR_MULGYEONGRYEOK_URL =
  "https://www.letscareer.co.kr/program/live/107/-%5B%F0%9F%8E%81%EB%AC%B4%EB%A3%8C%5D-1~3%EB%85%84%EC%B0%A8%2C-%EC%A7%80%EA%B8%88-%ED%95%98%EB%8A%94-%EB%A7%88%EC%BC%80%ED%84%B0-%EC%97%85%EB%AC%B4%EA%B0%80-'%EB%AC%BC%EA%B2%BD%EB%A0%A5'%EC%9D%B4-%EB%90%98%EC%A7%80-%EC%95%8A%EC%9C%BC%EB%A0%A4%EB%A9%B4";

export interface MarketerVodCard {
  /**
   * 배너 이미지. 제목·배지·연사 소개가 이미 그림 안에 들어 있다.
   * public/images/membership/ 하위 파일명.
   */
  banner: string;
  /** 이미지 안 문구를 문장으로 옮긴 것. 이름표 수준으로 줄이지 말 것 */
  bannerAlt: string;
  title: string;
  bullets: string[];
  /** 정가 (취소선) */
  regularPrice: number;
  /**
   * 상세페이지 주소. <b>없으면 "자세히 보기" 버튼을 렌더하지 않는다.</b>
   * 공개 전인 세미나를 목록 같은 엉뚱한 곳으로 보내는 것보다 버튼이 없는 편이 낫다 —
   * 눌러서 원하던 게 없는 화면에 도착하면 그 자리에서 이탈한다.
   */
  url?: string;
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
      banner: 'vod-seminar-1.png',
      bannerAlt:
        "렛츠커리어 라이브 클래스 무료 세미나. 1~3년차, 지금 하는 마케터 업무가 '물경력'이 되지 않으려면. 뷰티 회사 CEO가 말하는 뽑고 싶은 지원자의 경험과 성과.",
      title: "뷰티 브랜드 CEO가 직접 알려주는 '뽑히는 지원자의 관점'",
      bullets: [
        '채용 결정권자가 직접 알려주는 산업 분석법',
        '브랜드와 시장을 바라보는 실무자의 관점',
        '뽑고 싶은 지원자가 갖춰야 할 산업 이해도와 역량',
      ],
      regularPrice: 29000,
      url: SEMINAR_MULGYEONGRYEOK_URL,
    },
    {
      banner: 'vod-seminar-2.png',
      bannerAlt:
        '렛츠커리어 라이브 클래스 무료 세미나. 영상 PD에서 대학내일 AE로, 어떻게 가능했을까? 실제 취준에서 활용한 캐릭터 설정부터 경험 연결, 서류·면접 노하우까지.',
      title: '대학내일 AE 현직자',
      bullets: [
        '영상 PD 경험을 활용한 AE 직무 전환 전략',
        '현직자가 알려주는 AE의 실제 업무와 필요 역량',
        '변화하는 시대에 마케터가 갖춰야 할 핵심 역량',
      ],
      regularPrice: 29000,
      // 아직 공개 전이라 주소가 없다 — 버튼이 렌더되지 않는다.
    },
  ] satisfies MarketerVodCard[],
} as const;
