import { ProgramContent, ProgramId } from '../types';

export const PROGRAMS: Record<ProgramId, ProgramContent> = {
  experience: {
    id: 'experience',
    title: '기필코 경험정리 챌린지',
    link: 'https://www.letscareer.co.kr/challenge/experience-summary/latest',
  },
  resume: {
    id: 'resume',
    title: '이력서 1주 완성 챌린지',
    link: 'https://www.letscareer.co.kr/challenge/resume/latest',
  },
  coverLetter: {
    id: 'coverLetter',
    title: '자기소개서 2주 완성 챌린지',
    link: 'https://www.letscareer.co.kr/challenge/personal-statement/latest',
  },
  portfolio: {
    id: 'portfolio',
    title: '포트폴리오 2주 완성 챌린지',
    link: 'https://www.letscareer.co.kr/challenge/portfolio/latest',
  },
  interview: {
    id: 'interview',
    title: '면접 준비 끝장 챌린지',
    shortTitle: '대기업 자소서',
    subtitle: '산업·기업 분석과 공채 문항 대비',
    badge: '환급금 없음',
    target: '대기업 맞춤 경험정리·자기소개서를 작성하고 싶은 분',
    duration: '3주',
    deliverable:
      '대기업 맞춤 경험정리본, 자기소개서, 산업/기업분석 특강 자료 및 템플릿',
    feedback: '스탠다드 2회 · 프리미엄 4회',
    curriculum: [
      '기업/산업 분석',
      '직무 분석',
      '경험 분석 + 서면 멘토링',
      '직무 역량 답변 + 서면 멘토링',
      '지원동기 답변 + 서면 멘토링',
      '자기소개서 완성 + Live 멘토링',
    ],
    features: ['대기업 현직자 특강 4회', '기업별 맞춤 분석 심화 커리큘럼'],
    plans: [
      { id: 'basic', name: '베이직', price: '113,500원', note: '환급금 없음' },
      {
        id: 'standard',
        name: '스탠다드',
        price: '164,000원',
        note: '환급금 없음',
      },
      {
        id: 'premium',
        name: '프리미엄',
        price: '214,000원',
        note: '환급금 없음',
      },
    ],
    thumbnail: '/images/curation/enterprise-cover.svg',
    link: 'https://www.letscareer.co.kr/challenge/personal-statement/latest',
  },
  marketingAllInOne: {
    id: 'marketingAllInOne',
    title: '마케팅 서류 완성 올인원 챌린지',
    link: 'https://www.letscareer.co.kr/challenge/marketing/latest',
  },
  hrAllInOne: {
    id: 'hrAllInOne',
    title: 'HR 서류 완성 올인원 챌린지',
    link: 'https://www.letscareer.co.kr/challenge/hr/latest',
  },
};
