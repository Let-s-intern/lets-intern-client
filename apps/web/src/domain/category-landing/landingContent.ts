/**
 * 카테고리 랜딩 문구. 랜딩 slug(= 취준 여정 메뉴 slug)별로 프론트에 고정한다 (PRD 5.3).
 * 섹션 제목은 어드민 노출 분류의 카테고리 이름을 쓰고, 여기에는 섹션 설명만 카테고리 slug 별로 둔다.
 * 문구는 초안이다. 기획 확정 후 바꾼다
 */
export interface LandingContent {
  heroTitle: string;
  heroDescription: string;
  /** 섹션(카테고리) slug → 섹션 아래 한 줄 설명 */
  sectionDescriptions?: Record<string, string>;
}

export const LANDING_CONTENT: Record<string, LandingContent> = {
  experience: {
    heroTitle: '흩어진 경험,\n렛츠커리어에서 한 번에 정리해요',
    heroDescription: '모든 서류의 기반이 되는 경험정리부터 시작하세요.',
  },
  resume: {
    heroTitle: '합격하는 이력서,\n렛츠커리어에서 2주면 완성돼요',
    heroDescription:
      '경험 나열만 하고 있는 분에게 추천! 직무 역량이 보이는 이력서로 바꿔요',
  },
  'personal-statement': {
    heroTitle: '뻔하지 않은 자기소개서,\n렛츠커리어와 함께 완성해요',
    heroDescription: '지원동기부터 직무 역량까지, 문항별로 차근차근 써요.',
  },
  portfolio: {
    heroTitle: '직무가 보이는 포트폴리오,\n렛츠커리어에서 완성해요',
    heroDescription: '무엇을 넣고 뺄지, 직무별 예시와 함께 정리해요.',
  },
  'large-corp': {
    heroTitle: '대기업 공채,\n자소서부터 인적성까지 한 번에 준비해요',
    heroDescription: '공채 시즌에 맞춰 서류와 인적성을 차근차근 준비하세요.',
  },
  interview: {
    heroTitle: '면접만 가면 떨어진다면,\n렛츠커리어와 실전처럼 준비해요',
    heroDescription: '질문 유형별 대비부터 실전 답변까지.',
  },
  hr: {
    heroTitle: 'HR 직무,\n서류부터 직무 이해까지 한 번에',
    heroDescription: '인사 직무 현직자와 함께 준비하세요.',
  },
  marketing: {
    heroTitle: '마케팅 직무,\n경험을 성과로 보여주는 서류를 만들어요',
    heroDescription: '마케터 현직자와 함께 준비하세요.',
  },
  pm: {
    heroTitle: 'PM/PO 직무,\n기획 역량이 보이는 서류를 만들어요',
    heroDescription: '서비스 기획 현직자와 함께 준비하세요.',
  },
};
