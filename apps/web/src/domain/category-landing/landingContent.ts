/**
 * 카테고리 랜딩 문구. 랜딩 slug(= 취준 여정 메뉴 slug)별로 프론트에 고정한다 (PRD 5.3).
 * 섹션 제목은 어드민 노출 분류의 카테고리 이름을 쓰고, 여기에는 섹션 설명만 카테고리 slug 별로 둔다.
 * 문구는 초안이다. 기획 확정 후 바꾼다
 */
import type { ChallengeType } from '@/schema';

export interface LandingContent {
  heroTitle: string;
  heroDescription: string;
  /** 수강생 후기 섹션. 이 챌린지 구분의 참여 후기를 보여준다. 구분이 없는 랜딩(인적성)은 뺀다 */
  review?: { title: string; label: string; challengeTypes: ChallengeType[] };
  /** 섹션(카테고리) slug → 섹션 아래 한 줄 설명 */
  sectionDescriptions?: Record<string, string>;
}

export const LANDING_CONTENT: Record<string, LandingContent> = {
  experience: {
    review: {
      title: '렛츠커리어와 경험을 정리한 분들의 솔직 후기',
      label: '경험정리',
      challengeTypes: ['EXPERIENCE_SUMMARY'],
    },
    heroTitle: '흩어진 경험,\n렛츠커리어에서 한 번에 정리해요',
    heroDescription: '모든 서류의 기반이 되는 경험정리부터 시작하세요.',
  },
  resume: {
    review: {
      title: '렛츠커리어와 이력서를 완성한 분들의 솔직 후기',
      label: '이력서',
      challengeTypes: ['CAREER_START'],
    },
    heroTitle: '합격하는 이력서,\n렛츠커리어에서 2주면 완성돼요',
    heroDescription:
      '경험 나열만 하고 있는 분에게 추천! 직무 역량이 보이는 이력서로 바꿔요',
  },
  'personal-statement': {
    review: {
      title: '렛츠커리어와 자기소개서를 완성한 분들의 솔직 후기',
      label: '자기소개서',
      challengeTypes: ['PERSONAL_STATEMENT'],
    },
    heroTitle: '뻔하지 않은 자기소개서,\n렛츠커리어와 함께 완성해요',
    heroDescription: '지원동기부터 직무 역량까지, 문항별로 차근차근 써요.',
  },
  portfolio: {
    review: {
      title: '렛츠커리어와 포트폴리오를 완성한 분들의 솔직 후기',
      label: '포트폴리오',
      challengeTypes: ['PORTFOLIO'],
    },
    heroTitle: '직무가 보이는 포트폴리오,\n렛츠커리어에서 완성해요',
    heroDescription: '무엇을 넣고 뺄지, 직무별 예시와 함께 정리해요.',
  },
  'large-corp': {
    review: {
      title: '렛츠커리어와 대기업 자기소개서를 완성한 분들의 솔직 후기',
      label: '대기업 자기소개서',
      challengeTypes: ['PERSONAL_STATEMENT_LARGE_CORP'],
    },
    heroTitle: '대기업 자기소개서,\n문항별로 차근차근 완성해요',
    heroDescription: '공채 시즌에 맞춰 기업별 자소서 문항을 준비하세요.',
  },
  // 인적성 챌린지는 챌린지 구분이 따로 없어(기타) 후기 섹션을 두지 않는다
  aptitude: {
    heroTitle: '서류 다음 관문 인적성,\n유형별로 빠르게 대비해요',
    heroDescription: '수리·추리 핵심 유형부터 실전 감각까지 한 번에.',
  },
  interview: {
    review: {
      title: '렛츠커리어와 면접을 준비한 분들의 솔직 후기',
      label: '면접',
      challengeTypes: ['MEETING_PREPARATION'],
    },
    heroTitle: '면접만 가면 떨어진다면,\n렛츠커리어와 실전처럼 준비해요',
    heroDescription: '질문 유형별 대비부터 실전 답변까지.',
  },
  hr: {
    review: {
      title: '렛츠커리어와 HR 직무를 준비한 분들의 솔직 후기',
      label: 'HR',
      challengeTypes: ['HR'],
    },
    heroTitle: 'HR 직무,\n서류부터 직무 이해까지 한 번에',
    heroDescription: '인사 직무 현직자와 함께 준비하세요.',
  },
  marketing: {
    review: {
      title: '렛츠커리어와 마케팅 직무를 준비한 분들의 솔직 후기',
      label: '마케팅',
      challengeTypes: ['MARKETING'],
    },
    heroTitle: '마케팅 직무,\n경험을 성과로 보여주는 서류를 만들어요',
    heroDescription: '마케터 현직자와 함께 준비하세요.',
  },
  pm: {
    review: {
      title: '렛츠커리어와 PM/PO 직무를 준비한 분들의 솔직 후기',
      label: 'PM/PO',
      challengeTypes: ['PM'],
    },
    heroTitle: 'PM/PO 직무,\n기획 역량이 보이는 서류를 만들어요',
    heroDescription: '서비스 기획 현직자와 함께 준비하세요.',
  },
};
