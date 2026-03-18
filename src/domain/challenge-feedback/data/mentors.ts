import type { Mentor } from '../types';

const MENTOR_IMAGES = [
  '/images/challenge-feedback/mentors/mentor-1.png',
  '/images/challenge-feedback/mentors/mentor-2.png',
  '/images/challenge-feedback/mentors/mentor-3.png',
  '/images/challenge-feedback/mentors/mentor-4.png',
] as const;

const mentorImage = (index: number) =>
  MENTOR_IMAGES[index % MENTOR_IMAGES.length];

export const MENTORS: Record<string, Mentor> = {
  nick: { nickname: '닉 멘토', company: '삼성 계열사', role: '기획', profileImage: mentorImage(0) },
  letscareerTeam: { nickname: '렛츠커리어 취업연구팀', company: '렛츠커리어', role: '취업 연구', profileImage: mentorImage(1) },
  teamtam: { nickname: '팀탐 멘토', company: '시리즈C 스타트업', role: '기획/PM', profileImage: mentorImage(2) },
  jack: { nickname: '잭 멘토', company: 'BGF 리테일', role: '영업/마케팅', profileImage: mentorImage(3) },
  march: { nickname: '마치 멘토', company: '카카오 계열사', role: '기획', profileImage: mentorImage(0) },
  dukyang: { nickname: '덕양 멘토', company: '시리즈B 스타트업', role: 'PM', profileImage: mentorImage(1) },
  robo: { nickname: '로보 멘토', company: '토스증권', role: '개발', profileImage: mentorImage(2) },
  moa: { nickname: '모아 멘토', company: '대학내일', role: '마케팅', profileImage: mentorImage(3) },
  hailey: { nickname: '헤일리 멘토', company: '현대자동차', role: '인사', profileImage: mentorImage(0) },
  julia: { nickname: '줄리아 멘토', company: '현대자동차', role: '기획', profileImage: mentorImage(1) },
  jussaem: { nickname: '쥬쌤 멘토', company: 'SK하이닉스', role: '엔지니어', profileImage: mentorImage(2) },
  matthew: { nickname: '매튜 멘토', company: '현대모비스', role: '기획', profileImage: mentorImage(3) },
  ifssaem: { nickname: '이프쌤 멘토', company: 'SK이노베이션 계열사', role: '경영지원', profileImage: mentorImage(0) },
  doan: { nickname: '도안 멘토', company: '국내 은행', role: '금융', profileImage: mentorImage(1) },
  joan: { nickname: '조앤 멘토', company: '놀유니버스', role: '마케팅', profileImage: mentorImage(2) },
  roy: { nickname: '로이 멘토', company: '클래스101', role: '마케팅', profileImage: mentorImage(3) },
  irin: { nickname: '이린 멘토', company: '캐시노트', role: '마케팅', profileImage: mentorImage(0) },
  bin: { nickname: '빈 멘토', company: '토스', role: '마케팅', profileImage: mentorImage(1) },
  sunny: { nickname: '써니 멘토', company: '한국타이어', role: '인사', profileImage: mentorImage(2) },
  taehoon: { nickname: '허태훈 멘토', company: '공인노무사', role: '노무', profileImage: mentorImage(3) },
  alex: { nickname: '알렉스 멘토', company: '한화 계열사', role: '인사', profileImage: mentorImage(0) },
  gidae: { nickname: '기대 멘토', company: '100대 외국계 기업', role: 'HR', profileImage: mentorImage(1) },
};
