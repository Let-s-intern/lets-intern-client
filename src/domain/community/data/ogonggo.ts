export type OgonggoJob = {
  id: string;
  name: string;
  description: string;
  link: string;
};

export const OGONGGO_SITE_LINK = 'https://letscareer.oopy.io';

const OGONGGO_PLANNING_LINK = 'https://open.kakao.com/o/gPlanning';
const OGONGGO_HR_LINK = 'https://open.kakao.com/o/gHR';
const OGONGGO_SALES_LINK = 'https://open.kakao.com/o/gSales';
const OGONGGO_MARKETING_LINK = 'https://open.kakao.com/o/gMarketing';

export const ogonggoJobs: OgonggoJob[] = [
  {
    id: 'planning',
    name: '기획',
    description: 'PM · 서비스기획\n채용공고 큐레이션',
    link: OGONGGO_PLANNING_LINK,
  },
  {
    id: 'hr',
    name: 'HR',
    description: '인사 · 경영관리\n채용공고 큐레이션',
    link: OGONGGO_HR_LINK,
  },
  {
    id: 'sales',
    name: '세일즈',
    description: '영업 · B2B 세일즈\n채용공고 큐레이션',
    link: OGONGGO_SALES_LINK,
  },
  {
    id: 'marketing',
    name: '마케팅',
    description: '퍼포먼스 · 콘텐츠\n채용공고 큐레이션',
    link: OGONGGO_MARKETING_LINK,
  },
];
