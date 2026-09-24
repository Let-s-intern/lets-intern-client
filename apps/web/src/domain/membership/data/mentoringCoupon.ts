// 시안 14 — 1:1 커피챗·멘토링 50% 할인 쿠폰 (PASS BENEFIT 06, MENTORING COUPON).
//
// 기존 하반기 멤버십은 쿠폰 그래픽 이미지 한 장으로 그렸다. 시안 14 는 좌측 할인율 +
// 우측 현직자 예시 목록의 2열 구조라 데이터도 그 형태로 바꿨다.
//
// 현직자 목록은 **예시**다. 시안 각주에 "멘토 소속 및 직무는 운영 시점에 따라 변경될 수
// 있습니다" 라고 적혀 있고 화면에도 그대로 노출한다 — 특정 회사 현직자와의 멘토링을
// 약속하는 것으로 읽히면 안 된다.

export interface MentorExample {
  /** 아바타에 들어갈 두 글자 약어 (AE·CRM 등) */
  short: string;
  /** 아바타 배경색 */
  color: string;
  company: string;
  role: string;
}

export const MENTORING_COUPON = {
  badge: 'PASS BENEFIT 06',
  eyebrow: 'MENTORING COUPON',
  titleLines: ['내가 원하는 직무의 현직자에게', '직접 묻고 답을 찾으세요'],
  sub: '지원 직무 선택부터 이력서·포트폴리오 피드백까지, 1:1 커피챗·멘토링 할인 쿠폰 2회를 드립니다.',
  passOnly: 'PASS ONLY',
  rate: '50%',
  rateTitleLines: ['1:1 커피챗·현직자 멘토링', '할인 쿠폰 2회'],
  rateBody: [
    '혼자서끼리 추측하지 말고,',
    '내가 가고 싶은 직무의 현직자에게 확인하세요.',
  ],
  rateFine: '패스 이용 기간 내 사용 · 멘토링 상품별 할인 한도 적용',
  mentorsTitle: '커피챗 가능한 마케팅 현직자 예시',
  mentorsNote: '멘토는 계속 업데이트됩니다',
  mentors: [
    {
      short: 'AE',
      color: 'bg-[#F1642B]',
      company: '대학내일',
      role: 'AE · 캠페인 기획',
    },
    { short: 'CRM', color: 'bg-[#7C5CF5]', company: 'CJ', role: 'CRM 마케팅' },
    {
      short: 'BR',
      color: 'bg-[#F1642B]',
      company: 'CJ제일제당',
      role: '브랜드 마케팅',
    },
    {
      short: 'PM',
      color: 'bg-[#EC4899]',
      company: '쿠팡이츠',
      role: '퍼포먼스 마케팅',
    },
    {
      short: 'CG',
      color: 'bg-[#10B981]',
      company: '놀유니버스',
      role: '콘텐츠 마케팅',
    },
    {
      short: 'BM',
      color: 'bg-[#3B82F6]',
      company: 'SK하이닉스',
      role: 'B2B 마케팅',
    },
  ] satisfies MentorExample[],
  footnote: '* 멘토 소속 및 직무는 운영 시점에 따라 변경될 수 있습니다.',
} as const;
