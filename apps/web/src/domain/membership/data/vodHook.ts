// VOD 무료 제공 훅 섹션 카피. (시안: 하반기 멤버십 LP (2) — Image #9)
// TODO(open-issue §6-2): 카피/썸네일/가격이 실제 프로그램 데이터인지 확정되면 API 연동 검토.

import { VOD_DETAIL_URL, VOD_JASOSEO_URL } from './links';

export const VOD_HOOK = {
  eyebrow: '지금 신청하는 분들을 위한 특별 혜택',
  titleTop: '지금 하반기 멤버십을 신청하면',
  // 강조 라인 — {highlight} 부분("무료")만 별도 강조 처리
  titleBottomLead: '현직자 공채 준비 VOD를 ',
  titleBottomHighlight: '무료',
  titleBottomTail: '로 드려요',

  // VOD 카드 — 가로 2개 배치(세로형 카드). 왼쪽: 자소서 작성법 / 오른쪽: 하반기 공채.
  cards: [
    {
      badge: '🎁 멤버십 신청 시 무료 제공',
      title:
        '[렛츠 VOD] 대기업 서류 합격률 2배 높이는 필살기 경험과 마스터 자소서 작성법',
      meta: ['🎬 동영상 1개 · 1시간', '👤 대기업 공채 준비생 추천'],
      bullets: [
        '공채 시즌, 많은 기업에 빠르게 지원하는 방법',
        '마스터 자기소개서의 핵심이 되는 필살기 경험 찾는 방법',
        '하나의 경험으로 완성하는 마스터 자기소개서 작성법',
        '삼성전자, 현대카드, LG유플러스, S-OIL 합격 자소서 공개',
      ],
      priceOriginal: '정가 29,000원',
      priceFree: '무료',
      cta: 'VOD 확인하기 →',
      thumbnailImage: '/images/membership/vod-jasoseo.png',
      thumbnailAlt:
        "[LET'S CAREER LIVE CLASS] 대기업 서류 합격률 2배 높이는 필살기 경험과 마스터 자소서 작성법 — BGF 리테일 현직자가 알려주는 하반기 공채 합격 전략",
      detailUrl: VOD_JASOSEO_URL,
    },
    {
      badge: '🎁 멤버십 신청 시 무료 제공',
      title: '[렛츠 VOD] 대기업 하반기 공채 준비는 지금부터',
      meta: ['🎬 동영상 1개 · 1시간 42분', '👤 대기업 공채 준비생 추천'],
      bullets: [
        '하반기 공채의 현실과 채용 트렌드',
        '13주 공채 준비 로드맵',
        '단계별 준비 전략과 실제 합격 사례',
        '하반기 공채를 준비할 때 꼭 알아야 할 핵심 포인트',
      ],
      priceOriginal: '정가 29,000원',
      priceFree: '무료',
      cta: 'VOD 확인하기 →',
      thumbnailImage: '/images/membership/vod-live-class.png',
      thumbnailAlt:
        "[LET'S CAREER LIVE CLASS] 대기업 하반기 공채 준비는 지금부터 — 삼성·CJ 계열사 최종합격 현직자 멘토",
      detailUrl: VOD_DETAIL_URL,
    },
  ],

  footnoteLead: '하반기 멤버십을 신청하는 순간, ',
  footnoteStrong: '이 현직자 클래스 다시보기를 결제 없이 바로',
  footnoteTail: ' 들으실 수 있어요.',
  footnoteSub: '멤버십 안에는 하반기 공채 준비 콘텐츠가 모두 담겨 있어요.',

  // VOD 섹션 바로 아래 풀폭 블루 프로모 띠 (시안: VOD 섹션 직후)
  promoStrip:
    '하반기 멤버십 신청하시면, 현직자 공채 준비 VOD를 ✨무료✨로 제공해 드려요!',
} as const;
