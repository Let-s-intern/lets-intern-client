import { FeedbackMissionCardConfig } from './FeedbackMissionCard';

export interface Mentor {
  id: string;
  company: string;
  name: string;
  thumbnailUrl?: string;
  description: string;
}

export const DUMMY_MENTORS: Mentor[] = [
  {
    id: '1',
    company: '렛츠인턴',
    name: '이프쌤',
    thumbnailUrl: '',
    description:
      '멘토 소개를 간단히 적어주세요. 멘토 소개를 간단히 적어주세요.',
  },
  {
    id: '2',
    company: '렛츠렛츠커리어',
    name: '줄리아',
    thumbnailUrl: '',
    description: '멘토 소개를 간단히 적어주세요.',
  },
  {
    id: '3',
    company: '렛츠커리어',
    name: '도안',
    thumbnailUrl: '',
    description: '멘토 소개를 간단히 적어주세요.',
  },
  {
    id: '4',
    company: '렛츠커리어',
    name: '레오',
    thumbnailUrl: '',
    description: '멘토 소개를 간단히 적어주세요.',
  },
];

export const DUMMY_FEEDBACK_MISSIONS: FeedbackMissionCardConfig[] = [
  {
    thumbnail: '',
    title:
      '프로그램 n주차 미션, 라이브 1:1 멘토링 프로그램 n주차 미션, 라이브 1:1 멘토링 프로그램 n주차 미션, 라이브 1:1 멘토링',
    description:
      '미션설명 미션설명 미션설명 미션설명 미션설명 미션설명 미션설명 미션설명 미션설명 미션설명 ',
    statusLabel: '예약 전',
    categoryLabel: '프로그램 종류',
    dateText: '진행기간 26.00.00 ~ 26.00.00',
    buttonLabel: '예약 신청',
  },
  {
    thumbnail: '',
    title: '프로그램 n주차 미션, 라이브 1:1 멘토링',
    description: '미션설명 미션설명 미션설명 미션설명',
    statusLabel: '예약 전',
    categoryLabel: '프로그램 종류',
    dateText: '진행기간 26.00.00 ~ 26.00.00',
    buttonLabel: '예약 신청',
  },
];
