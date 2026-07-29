import { MentorTagValue } from './constants';

export interface DummyMentor {
  mentorId: string;
  name: string;
  profileImage: string;
  badgeImage: string;
  company: string;
  position: string;
  careerTitle: string;
  tags: MentorTagValue[];
}

export const DUMMY_MENTORS: DummyMentor[] = [
  {
    mentorId: '1',
    name: '쥬디 멘토',
    profileImage: '/images/marketing/calendar-january.png',
    badgeImage: '/logo/logo-simple.svg',
    company: '렛츠커리어',
    position: 'CEO',
    careerTitle: '대표경력',
    tags: ['pm-po', 'career-change', 'cover-letter', 'interview'],
  },
  {
    mentorId: '2',
    name: '쥬디 멘토',
    profileImage: '/images/marketing/calendar-june.png',
    badgeImage: '/logo/logo-simple.svg',
    company: '렛츠커리어',
    position: 'CEO',
    careerTitle: '대표경력',
    tags: ['marketing', 'hr', 'interview', 'career-change'],
  },
  {
    mentorId: '3',
    name: '쥬디 멘토',
    profileImage: '/images/marketing/profile3.png',
    badgeImage: '/logo/logo-simple.svg',
    company: '렛츠커리어',
    position: 'CEO',
    careerTitle: '대표경력대표경력',
    tags: ['development', 'engineering-job', 'career-change', 'cover-letter'],
  },
  {
    mentorId: '4',
    name: '쥬디 멘토',
    profileImage: '/images/marketing/profile4.png',
    badgeImage: '/logo/logo-simple.svg',
    company: '렛츠커리어',
    position: 'CEO',
    careerTitle: '대표경력',
    tags: ['design', 'interview', 'cover-letter', 'career-change'],
  },
  {
    mentorId: '5',
    name: '쥬디 멘토',
    profileImage: '/images/marketing/profile5.png',
    badgeImage: '/logo/logo-simple.svg',
    company: '렛츠커리어',
    position: 'CEO',
    careerTitle: '대표경력',
    tags: ['pm-po', 'hr', 'engineering-job', 'interview'],
  },
];
