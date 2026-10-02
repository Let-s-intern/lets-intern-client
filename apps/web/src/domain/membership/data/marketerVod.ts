// 개편 시안 6-3 — 현직자 VOD (PASS BENEFIT 03, MARKETER INSIGHTS).
//
// 네 강의 모두 상세 주소를 받아 카드 4장이 전부 버튼을 갖는다.
// 순서는 시안과 같다: 물경력 → 라라스윗 포트폴리오 → 대학내일 AE → 쥬디 멘토.

/** 세미나 상세 주소 — 라이브 클래스 상세페이지 */
const SEMINAR_URL = {
  /** [무료] 1~3년차, 지금 하는 마케터 업무가 '물경력'이 되지 않으려면 */
  mulgyeongryeok:
    "https://www.letscareer.co.kr/program/live/107/-%5B%F0%9F%8E%81%EB%AC%B4%EB%A3%8C%5D-1~3%EB%85%84%EC%B0%A8%2C-%EC%A7%80%EA%B8%88-%ED%95%98%EB%8A%94-%EB%A7%88%EC%BC%80%ED%84%B0-%EC%97%85%EB%AC%B4%EA%B0%80-'%EB%AC%BC%EA%B2%BD%EB%A0%A5'%EC%9D%B4-%EB%90%98%EC%A7%80-%EC%95%8A%EC%9C%BC%EB%A0%A4%EB%A9%B4",
  /** [무료] 마케팅 포트폴리오, 어떤 경험을 담아야 합격할까? */
  portfolio:
    'https://www.letscareer.co.kr/program/live/108/%5B%F0%9F%8E%81%EB%AC%B4%EB%A3%8C%5D-%EB%A7%88%EC%BC%80%ED%8C%85-%ED%8F%AC%ED%8A%B8%ED%8F%B4%EB%A6%AC%EC%98%A4%2C--%EC%96%B4%EB%96%A4-%EA%B2%BD%ED%97%98%EC%9D%84-%EB%8B%B4%EC%95%84%EC%95%BC-%ED%95%A9%EA%B2%A9%ED%95%A0%EA%B9%8C%3F',
  /** [무료] 영상 PD에서 대학내일 AE로, 어떻게 가능했을까? */
  ae: 'https://www.letscareer.co.kr/program/live/109/%5B%F0%9F%8E%81%EB%AC%B4%EB%A3%8C%5D-%EC%98%81%EC%83%81-pd%EC%97%90%EC%84%9C-%EB%8C%80%ED%95%99%EB%82%B4%EC%9D%BC-ae%EB%A1%9C%2C-%EC%96%B4%EB%96%BB%EA%B2%8C-%EA%B0%80%EB%8A%A5%ED%96%88%EC%9D%84%EA%B9%8C%3F',
  /** [무료] 마케팅 경험, 도대체 얼마나 있어야 합격할까? */
  experience:
    'https://www.letscareer.co.kr/program/live/110/%5B%F0%9F%8E%81%EB%AC%B4%EB%A3%8C%5D-%EB%A7%88%EC%BC%80%ED%8C%85-%EA%B2%BD%ED%97%98%2C-%EB%8F%84%EB%8C%80%EC%B2%B4-%EC%96%BC%EB%A7%88%EB%82%98-%EC%9E%88%EC%96%B4%EC%95%BC-%ED%95%A9%EA%B2%A9%ED%95%A0%EA%B9%8C%3F',
} as const;

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
  title: '현직자가 직접 알려주는 마케팅 취업 전략 VOD 4종',
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
      url: SEMINAR_URL.mulgyeongryeok,
    },
    {
      banner: 'vod-seminar-3.png',
      bannerAlt:
        '렛츠커리어 라이브 클래스 무료 세미나. 마케팅 포트폴리오, 어떤 경험을 담아야 합격할까? 라라스윗 합격자가 알려주는 그로스 마케팅 실무와 포트폴리오 작성법.',
      title: '라라스윗 그로스 마케터 2명이 공개하는 합격 포트폴리오·면접 전략',
      bullets: [
        '합격 포트폴리오 구성과 경험 정리법',
        '강점을 살리는 면접 답변 전략',
        '인턴에서 정규직으로 전환한 노하우',
      ],
      regularPrice: 29000,
      url: SEMINAR_URL.portfolio,
    },
    {
      banner: 'vod-seminar-2.png',
      bannerAlt:
        '렛츠커리어 라이브 클래스 무료 세미나. 영상 PD에서 대학내일 AE로, 어떻게 가능했을까? 실제 취준에서 활용한 캐릭터 설정부터 경험 연결, 서류·면접 노하우까지.',
      title: '대학내일 AE가 직접 알려주는 마케터 취뽀 로드맵',
      bullets: [
        '영상 PD 경험을 활용한 AE 직무 전환 전략',
        '현직자가 알려주는 AE의 실제 업무와 필요 역량',
        '변화하는 시대에 마케터가 갖춰야 할 핵심 역량',
      ],
      regularPrice: 29000,
      url: SEMINAR_URL.ae,
    },
    {
      banner: 'vod-seminar-4.png',
      bannerAlt:
        '렛츠커리어 라이브 클래스 무료 세미나. 마케팅 경험, 도대체 얼마나 있어야 합격할까? 현직자·인사담당자가 말하는 마케팅 합격 기준부터 경험 진단, 지금 당장 해야 할 준비까지.',
      title: '렛츠커리어 CEO 쥬디 멘토의 마케팅 경험 합격 기준',
      bullets: [
        '마케팅 취업에서 평가자가 보는 진짜 합격 기준',
        '내 경험이 합격 수준인지 직접 진단하는 법',
        '진단 결과에 따라 지금 당장 해야 할 준비',
      ],
      regularPrice: 29000,
      url: SEMINAR_URL.experience,
    },
  ] satisfies MarketerVodCard[],
} as const;
