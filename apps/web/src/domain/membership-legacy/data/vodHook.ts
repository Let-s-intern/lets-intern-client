// VOD 무료 제공 훅 섹션 카피. (시안: 하반기 멤버십 LP (2) — Image #9)
//
// 용어 — 2026-08-28 요청으로 배지를 "멤버십 신청 시" → "패스 신청 시 녹화본" 으로 바꿨고, 제목도
// 요청에 첨부된 참고이미지 문구("지금 공채 준비 올패스를 신청하면")에 맞췄다. 아래 footnote·
// promoStrip 은 그 이미지에서도 "하반기 멤버십" 이라 그대로 뒀다 — 페이지 전체 용어 정리는 별건이다.
//
// 카드 제목의 "[렛츠 VOD]"·"[렛츠 세미나]" 접두사도 같은 요청으로 뺐다. 상품 종류를 제목에 달지
// 않고 배지("녹화본")로 알린다.
//
// TODO(open-issue §6-2): 카피/썸네일/가격이 실제 프로그램 데이터인지 확정되면 API 연동 검토.

import {
  LIVE_HR_CHECKLIST_URL,
  LIVE_TREND_TOTAL_URL,
  VOD_DETAIL_URL,
  VOD_JASOSEO_URL,
} from './links';

export const VOD_HOOK = {
  eyebrow: '지금 신청하는 분들을 위한 특별 혜택',
  titleTop: '지금 공채 준비 올패스를 신청하면',
  // 강조 라인 — {highlight} 부분("무료")만 별도 강조 처리
  titleBottomLead: '현직자 공채 준비 VOD를 ',
  titleBottomHighlight: '무료',
  titleBottomTail: '로 드려요',

  // VOD 카드 — 순서는 2026-08-28 요청서 순서를 따른다.
  //
  // 뒤의 두 개는 아직 VOD 상품이 없어 LIVE 프로그램 페이지를 가리킨다. 그래도 정가는 네 장 모두
  // 29,000원으로 통일한다(2026-08-28 요청). 렛츠커리어는 무료 라이브를 먼저 열고 다시보기를
  // 29,000원 VOD 로 파는 구조라 전환되면 같은 값이 된다.
  cards: [
    {
      badge: '🎁 패스 신청 시 녹화본 무료 제공',
      title: '대기업 서류 합격률 2배 높이는 필살기 경험과 마스터 자소서 작성법',
      meta: ['🎬 동영상 1개 · 1시간', '👤 대기업 공채 준비생 추천'],
      bullets: [
        '공채 시즌, 많은 기업에 빠르게 지원하는 방법',
        '마스터 자기소개서의 핵심이 되는 필살기 경험 찾기',
        '하나의 경험으로 완성하는 마스터 자기소개서',
      ],
      priceOriginal: '정가 29,000원',
      priceFree: '무료',
      cta: '자세히 보기 →',
      thumbnailImage: '/images/membership/vod-jasoseo.png',
      thumbnailAlt:
        "[LET'S CAREER LIVE CLASS] 대기업 서류 합격률 2배 높이는 필살기 경험과 마스터 자소서 작성법 — BGF 리테일 현직자가 알려주는 하반기 공채 합격 전략",
      detailUrl: VOD_JASOSEO_URL,
    },
    {
      badge: '🎁 패스 신청 시 녹화본 무료 제공',
      title: '대기업 하반기 공채 준비는 지금부터',
      meta: ['🎬 동영상 1개 · 1시간 42분', '👤 대기업 공채 준비생 추천'],
      bullets: [
        '하반기 공채의 현실과 채용 트렌드',
        '13주 공채 준비 로드맵',
        '단계별 준비 전략과 실제 합격 사례',
        '하반기 공채를 준비할 때 꼭 알아야 할 핵심 포인트',
      ],
      priceOriginal: '정가 29,000원',
      priceFree: '무료',
      cta: '자세히 보기 →',
      thumbnailImage: '/images/membership/vod-live-class.png',
      thumbnailAlt:
        "[LET'S CAREER LIVE CLASS] 대기업 하반기 공채 준비는 지금부터 — 삼성·CJ 계열사 최종합격 현직자 멘토",
      detailUrl: VOD_DETAIL_URL,
    },
    {
      badge: '🎁 패스 신청 시 녹화본 무료 제공',
      title: '대기업 현직 HR과 완성하는 하반기 공채 자소서 체크리스트',
      meta: ['🎬 동영상 1개 · 1시간', '👤 대기업 공채 준비생 추천'],
      bullets: [
        '채용 담당자가 자소서에서 가장 먼저 보는 것',
        '실제 합격 자소서에서 발견한 공통점',
        '공채 지원 전 마지막 자소서 체크리스트',
      ],
      priceOriginal: '정가 29,000원',
      priceFree: '무료',
      cta: '자세히 보기 →',
      thumbnailImage: '/images/membership/vod-hr-checklist.webp',
      thumbnailAlt:
        "[LET'S CAREER LIVE CLASS] 대기업 현직 HR과 완성하는 하반기 공채 자소서 체크리스트 — 한국타이어앤테크놀로지 현직 HR 멘토",
      detailUrl: LIVE_HR_CHECKLIST_URL,
    },
    {
      badge: '🎁 패스 신청 시 녹화본 무료 제공',
      title: '공채 시작! 2026 하반기 공채 취뽀 전략 총정리',
      meta: ['🎬 동영상 1개 · 2시간', '👤 대기업 공채 준비생 추천'],
      bullets: [
        '2026년 하반기 취업 시장 핵심 트렌드',
        '상황별로 완성하는 9~11월 공채 준비 루틴',
        '합격 가능성을 높이는 자기소개서 작성법',
      ],
      priceOriginal: '정가 29,000원',
      priceFree: '무료',
      cta: '자세히 보기 →',
      thumbnailImage: '/images/membership/vod-trend-total.webp',
      thumbnailAlt:
        "[LET'S CAREER LIVE CLASS] 공채 시작! 2026 하반기 공채 취뽀 전략 총정리 — 렛츠커리어 CEO 쥬디",
      detailUrl: LIVE_TREND_TOTAL_URL,
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
