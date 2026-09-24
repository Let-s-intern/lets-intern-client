// 멤버 전용 제휴 서비스 혜택 섹션 데이터(산타토익·슈퍼인턴·뷰인터).
// CTA는 기존 BenefitModal 의 동일 id 모달을 재사용한다.

export interface PartnerCard {
  /** BenefitModal 모달 키와 동일 */
  id: 'santatoeic' | 'superintern' | 'viewinter';
  logo: string;
  logoAlt: string;
  /** 이미지 로고 대신 텍스트 로고를 쓸 때(흰색 PNG라 안 보이는 경우 등) */
  logoText?: { pre: string; accent: string };
  tone: 'green' | 'lavender' | 'blue';
  /** 로고 하단 태그 */
  tag: string;
  title: string;
  desc: string;
  /** 혜택 칩 2개 */
  chips: string[];
  cta: string;
  ctaSub: string;
}

export const PARTNER_CARDS: PartnerCard[] = [
  {
    id: 'santatoeic',
    logo: '/images/membership/partner-santa.png',
    logoAlt: '산타토익',
    tone: 'green',
    tag: '멤버 할인·무료체험',
    title: '산타토익 이용권 혜택',
    desc: 'AI 튜터가 실력을 진단해 최소 학습으로 목표 점수까지 이끄는 산타토익을, 멤버십 가입자에게 이용권 할인 또는 무료 체험권으로 제공해요. 공채에 필요한 어학 점수를 시즌 안에 끝내세요.',
    chips: ['멤버 전원 이용권 할인', '또는 무료 체험권 제공'],
    cta: '혜택 자세히 보기 →',
    ctaSub: 'AI 토익 학습 앱',
  },
  {
    id: 'superintern',
    logo: '/images/membership/partner-superintern.png',
    logoAlt: '슈퍼인턴',
    tone: 'lavender',
    tag: '채용 연계 혜택',
    title: '슈퍼인턴 채용 연계 혜택',
    desc: 'AI 기반 채용 매칭 서비스 슈퍼인턴에서, 멤버십 가입자에게 채용 연계와 역량 진단 혜택을 드려요. 준비한 만큼 더 빨리 기회로 이어집니다.',
    chips: ['ⓐ 인재 우선 검토', 'ⓑ AI 진단 리포트 크레딧'],
    cta: '혜택 자세히 보기 →',
    ctaSub: 'AI 채용 매칭',
  },
  {
    id: 'viewinter',
    logo: '/images/membership/partner-viewinter.png',
    logoAlt: '뷰인터 AI',
    tone: 'blue',
    tag: '멤버 전원 제공',
    title: '뷰인터 AI 면접 이용권',
    desc: '현대·LG에너지솔루션·YG 등 대기업이 실제 채용에 쓰는 AI 면접 솔루션 뷰인터를, 멤버십 구매자 전원에게 면접 이용권으로 드려요. 실전과 같은 환경에서 미리 연습하세요.',
    chips: [
      '베이직·스탠다드 대화형 3 + 일반형 3일권',
      '프리미엄 대화형 5 + 일반형 5일권',
    ],
    cta: '이용권 자세히 보기 →',
    ctaSub: '1일권 정가 9,900원 상당',
  },
];
