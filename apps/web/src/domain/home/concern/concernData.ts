/**
 * 고민 패널의 카드 하나 = 취준 여정 카테고리 하나 (domain/career-journey/journeyNav.ts 의 slug).
 * 이동은 메뉴와 같다: 어드민이 지정한 바로 갈 상품이 있으면 상세, 없으면 카테고리 랜딩
 */
export interface ConcernAction {
  title: string;
  quote: string;
  meta: string;
  cta: string;
  slug: string;
}

export interface Concern {
  id: string;
  label: string;
  headline: string;
  keywords: string;
  panelTitle: string;
  panelDescription: string;
  actions: ConcernAction[];
}

export const CONCERNS: Concern[] = [
  {
    id: 'experience',
    label: '스펙 정리',
    headline: '경험이 정리가\n안 돼요',
    keywords: '경험정리',
    panelTitle: '어떤 경험부터 정리할까요?',
    panelDescription: '모든 서류의 기반이 되는 경험정리부터 시작해요',
    actions: [
      {
        title: '경험정리',
        quote: '"쓸 만한 경험이 없는 것 같아요"',
        meta: '기필코 경험정리 챌린지 · 단계별 미션',
        cta: '경험정리 시작하기',
        slug: 'experience',
      },
    ],
  },
  {
    id: 'document',
    label: '서류 작성',
    headline: '서류를 어떻게\n써야 할지 모르겠어요',
    keywords: '이력서 · 자기소개서 · 포트폴리오',
    panelTitle: '어떤 서류에서 막혔나요?',
    panelDescription: '지원 서류 3종 중 지금 막힌 서류를 골라요',
    actions: [
      {
        title: '이력서',
        quote: '"경험 나열만 하고 있어요"',
        meta: '이력서 완성 챌린지 · VOD · 1:1 첨삭 LIVE',
        cta: '이력서 준비 시작하기',
        slug: 'resume',
      },
      {
        title: '자기소개서',
        quote: '"지원동기가 매번 뻔해요"',
        meta: '자소서 10일 완성 챌린지 · 가이드북',
        cta: '자기소개서 준비 시작하기',
        slug: 'personal-statement',
      },
      {
        title: '포트폴리오',
        quote: '"뭘 넣고 뭘 빼야 할지 모르겠어요"',
        meta: '포트폴리오 챌린지 · 직무별 예시',
        cta: '포트폴리오 준비 시작하기',
        slug: 'portfolio',
      },
    ],
  },
  {
    id: 'large-corp',
    label: '대기업',
    headline: '대기업 공채가\n처음이에요',
    keywords: '대기업 자기소개서 · 인적성',
    panelTitle: '대기업 공채, 어디서부터 준비할까요?',
    panelDescription: '공채 시즌에 맞춰 서류부터 차근차근',
    actions: [
      {
        title: '대기업',
        quote: '"자소서 문항도, 인적성도 막막해요"',
        meta: '대기업 자소서 챌린지 · 인적성 · 현직자 멘토링',
        cta: '대기업 준비 시작하기',
        slug: 'large-corp',
      },
    ],
  },
  {
    id: 'interview',
    label: '면접',
    headline: '면접만 가면\n떨어져요',
    keywords: '면접',
    panelTitle: '면접, 무엇이 가장 걱정되나요?',
    panelDescription: '질문 유형별 대비부터 실전 답변까지',
    actions: [
      {
        title: '면접 준비',
        quote: '"무슨 질문이 나올지 모르겠어요"',
        meta: '면접 준비 끝장 챌린지 · 질문 유형별 대비',
        cta: '면접 준비 시작하기',
        slug: 'interview',
      },
    ],
  },
  {
    id: 'job',
    label: '직무특화',
    headline: '직무에 맞춰\n준비하고 싶어요',
    keywords: 'HR · 마케팅 · PM/PO',
    panelTitle: '어떤 직무를 준비하나요?',
    panelDescription: '현직자 멘토와 함께 직무 탐색부터 서류 완성까지',
    actions: [
      {
        title: 'HR',
        quote: '"인사 직무가 정확히 뭘 하는지 궁금해요"',
        meta: 'HR 직무 서류 완성 올인원 챌린지',
        cta: 'HR 준비 시작하기',
        slug: 'hr',
      },
      {
        title: '마케팅',
        quote: '"마케팅 경험을 어떻게 보여줄까요?"',
        meta: '마케팅 서류 완성 올인원 챌린지',
        cta: '마케팅 준비 시작하기',
        slug: 'marketing',
      },
      {
        title: 'PM/PO',
        quote: '"기획 직무 포트폴리오가 막막해요"',
        meta: 'PM/서비스기획 서류 완성 챌린지',
        cta: 'PM/PO 준비 시작하기',
        slug: 'pm',
      },
    ],
  },
];
