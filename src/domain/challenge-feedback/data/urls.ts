import type { ChallengeKey } from '../types';

/** 유입 경로: referrer URL 키워드 → 챌린지 자동 선택 매핑 */
export const REFERRER_KEYWORD_MAP: { keyword: string; key: ChallengeKey }[] = [
  { keyword: '경험정리', key: 'experience' },
  { keyword: '이력서', key: 'resume' },
  { keyword: '자기소개서', key: 'personal-statement' },
  { keyword: '포트폴리오', key: 'portfolio' },
  { keyword: '대기업', key: 'large-corp' },
  { keyword: '마케팅', key: 'marketing' },
  { keyword: 'HR', key: 'hr' },
  { keyword: 'hr', key: 'hr' },
];

/** 신청 페이지: 챌린지별 최신 기수 신청 URL */
export const APPLY_URLS: Record<ChallengeKey, string> = {
  experience:
    'https://www.letscareer.co.kr/challenge/experience-summary/latest',
  resume: 'https://www.letscareer.co.kr/challenge/resume/latest',
  'personal-statement':
    'https://www.letscareer.co.kr/challenge/personal-statement/latest',
  portfolio: 'https://www.letscareer.co.kr/challenge/portfolio/latest',
  'large-corp': 'https://www.letscareer.co.kr/challenge/large-corp/latest',
  marketing: 'https://www.letscareer.co.kr/challenge/marketing/latest',
  hr: 'https://www.letscareer.co.kr/challenge/hr/latest',
};
