export interface LetsconSession {
  id: string;
  time: string;
  title: string;
  mentor: string;
}

export const LETSCON_DAY14_SESSIONS: LetsconSession[] = [
  { id: 'hr', time: '16:00 – 17:30', title: 'HR', mentor: '덕양 멘토' },
  {
    id: 'pm',
    time: '19:00 – 20:30',
    title: '서비스 기획/PM',
    mentor: '헤이즐 멘토',
  },
];

export const LETSCON_DAY15_SESSIONS: LetsconSession[] = [
  {
    id: 'mk',
    time: '14:30 – 16:30',
    title: '마케팅',
    mentor: '팀장 박주삼 멘토',
  },
  {
    id: 'iv',
    time: '16:45 – 18:45',
    title: '대기업 면접관 관점',
    mentor: '프리쪼아 멘토',
  },
];
