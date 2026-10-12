import type { PassMaterial } from '../types';

// introduction = BE가 저장할 모양 그대로(JSON 문자열). FE가 파싱해 설명/부가설명으로 분리.
const intro = (summary: string, bullets: string[]) =>
  JSON.stringify({ summary, bullets });

const SAMPLE_SUMMARY = '자료 설명입니다. 자료 설명입니다. 자료 설명입니다.';
const SAMPLE_BULLETS = [
  '자료 부가 설명입니다',
  '자료 부가 설명입니다',
  '자료 부가 설명입니다',
  '자료 부가 설명입니다',
];
const SAMPLE_LINK = 'https://letscareer-playbook.vercel.app/';

export const materialFixtures: PassMaterial[] = [
  {
    id: 1,
    type: '인적성',
    title: '인적성 검사 완벽 정리 자료',
    introduction: intro(SAMPLE_SUMMARY, SAMPLE_BULLETS),
    link: SAMPLE_LINK,
    thumbnail: null,
  },
  {
    id: 2,
    type: '포트폴리오',
    title: '합격자 포트폴리오 템플릿 모음',
    introduction: intro(SAMPLE_SUMMARY, SAMPLE_BULLETS),
    link: SAMPLE_LINK,
    thumbnail: null,
  },
  {
    id: 3,
    type: '자기소개서',
    title: '대기업 공채 자소서 문항별 예시',
    introduction: intro(SAMPLE_SUMMARY, SAMPLE_BULLETS),
    link: SAMPLE_LINK,
    thumbnail: null,
  },
  {
    id: 4,
    type: '공채',
    title: '2026 하반기 공채 일정 총정리',
    introduction: intro(SAMPLE_SUMMARY, SAMPLE_BULLETS),
    link: SAMPLE_LINK,
    thumbnail: null,
  },
  {
    id: 5,
    type: '산업/기업 분석',
    title: 'IT 산업 직무별 트렌드 리포트',
    introduction: intro(SAMPLE_SUMMARY, SAMPLE_BULLETS),
    link: SAMPLE_LINK,
    thumbnail: null,
  },
  {
    id: 6,
    type: '포트폴리오',
    title: '디자이너 포트폴리오 체크리스트',
    // 평문 폴백 케이스(구버전 데이터처럼 JSON이 아닌 경우)
    introduction: '자료 설명입니다. 자료 설명입니다. 자료 설명입니다.',
    link: SAMPLE_LINK,
    thumbnail: null,
  },
];
