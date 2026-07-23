// S6 차별점2 "내가 원하는 직무 현직자" 멘토 6인 (figma 6_차별점.png 기준).
// 카드 이미지에 로고·실루엣·회사·한줄 소개가 모두 baked-in 되어 있어,
// 여기서는 이미지 경로와 접근성용 대체 텍스트만 관리한다.

export interface DifferentiatorMentor {
  id: number;
  image: string;
  /** 회사·직무 (접근성 대체 텍스트 구성용) */
  company: string;
  /** 한줄 소개 */
  desc: string;
}

export const DIFFERENTIATOR_MENTORS: DifferentiatorMentor[] = [
  {
    id: 1,
    image: '/images/seminar/differentiator/mentors/1.png',
    company: '삼성 계열사 영업지원팀 현직자',
    desc: '삼성, CJ 계열사 동시합격',
  },
  {
    id: 2,
    image: '/images/seminar/differentiator/mentors/2.png',
    company: 'CJ 그룹 현직자',
    desc: 'CJ 그룹 신입 공채 인턴십 및 직무 멘토링 멘토',
  },
  {
    id: 3,
    image: '/images/seminar/differentiator/mentors/3.png',
    company: 'CJ그룹 CRM 마케터 현직자',
    desc: '스타트업에서 대기업으로 이직 성공',
  },
  {
    id: 4,
    image: '/images/seminar/differentiator/mentors/4.png',
    company: '카카오 계열사 Product Manager 현직자',
    desc: '카카오 공채 합격',
  },
  {
    id: 5,
    image: '/images/seminar/differentiator/mentors/5.png',
    company: '뤼튼 AI 서비스 기획 현직자',
    desc: '문예창작과 학생에서 AI PM으로 취업 성공',
  },
  {
    id: 6,
    image: '/images/seminar/differentiator/mentors/6.png',
    company: 'SK하이닉스 마케팅 현직자',
    desc: '',
  },
];
