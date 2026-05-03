import { FeedbackMissionCardConfig } from './FeedbackMissionCard';
import type { DaySchedule, SlotStatus } from './live/types';
import { TIME_SLOTS } from './live/types';
import { toDateString } from './live/utils';

function getSlotStatus(date: Date, time: string, mentorId: string): SlotStatus {
  const [hour, minute] = time.split(':').map(Number);
  const slotTime = new Date(date);
  slotTime.setHours(hour, minute, 0, 0);
  if (slotTime <= new Date()) return 'expired';

  const hash = [...`${toDateString(date)}${time}${mentorId}`].reduce(
    (acc, c) => acc + c.charCodeAt(0),
    0,
  );
  const n = hash % 10;
  if (n < 3) return 'unavailable';
  if (n < 6) return 'booked';
  return 'available';
}

export function getMentorSchedule(
  mentorId: string,
  weekStart: Date,
): DaySchedule[] {
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    const slots: Record<string, SlotStatus> = {};
    TIME_SLOTS.forEach((time) => {
      slots[time] = getSlotStatus(date, time, mentorId);
    });
    return { date: toDateString(date), slots };
  });
}

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
    startDay: '2026-05-04',
    endDay: '2026-05-31',
    buttonLabel: '예약 신청',
  },
  {
    thumbnail: '',
    title: '프로그램 n주차 미션, 라이브 1:1 멘토링',
    description: '미션설명 미션설명 미션설명 미션설명',
    statusLabel: '예약 전',
    categoryLabel: '프로그램 종류',
    startDay: '2026-06-01',
    endDay: '2026-06-28',
    buttonLabel: '예약 신청',
  },
];
