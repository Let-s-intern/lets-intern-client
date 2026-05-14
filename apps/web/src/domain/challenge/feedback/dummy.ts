import type { LiveFeedbackMission, Mentor, SlotStatus } from './live/types';
import { TIME_SLOTS } from './live/types';
import { toDateString } from './live/utils';
import type { WrittenFeedbackMission } from './written/types';

function getSlotStatus(date: Date, time: string, mentorId: number): SlotStatus {
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

export function getMentorDaySlots(
  mentorId: number,
  dateStr: string,
): Record<string, SlotStatus> {
  const date = new Date(dateStr);
  const slots: Record<string, SlotStatus> = {};
  TIME_SLOTS.forEach((time) => {
    slots[time] = getSlotStatus(date, time, mentorId);
  });
  return slots;
}

export function getMentorMonthAvailability(
  mentorId: number,
  year: number,
  month: number,
  startDay: string,
  endDay: string,
): Record<string, boolean> {
  const start = new Date(startDay);
  const end = new Date(endDay);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const result: Record<string, boolean> = {};

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    if (date < start || date > end) continue;
    const dateStr = toDateString(date);
    const slots = Object.values(getMentorDaySlots(mentorId, dateStr));
    result[dateStr] = slots.some((s) => s === 'available');
  }
  return result;
}

export const DUMMY_MENTORS: Mentor[] = [
  {
    id: 1,
    company: '렛츠인턴',
    name: '이프쌤',
    thumbnailUrl: '',
    stars: 5,
    description:
      '멘토 소개를 간단히 적어주세요. 멘토 소개를 간단히 적어주세요.멘토 소개를 간단히 적어주세요. 멘토 소개를 간단히 적어주세요. 멘토 소개를 간단히 적어주세요. 멘토 소개를 간단히 적어주세요.',
  },
  {
    id: 2,
    company: '렛츠렛츠커리어',
    name: '줄리아',
    thumbnailUrl: '',
    stars: 4,
    description:
      '멘토 소개를 간단히 적어주세요. 멘토 소개를 간단히 적어주세요. 멘토 소개를 간단히 적어주세요. 멘토 소개를 간단히 적어주세요. ',
  },
  {
    id: 3,
    company: '렛츠커리어',
    name: '도안',
    thumbnailUrl: '',
    stars: 3,
    description:
      '멘토 소개를 간단히 적어주세요.멘토 소개를 간단히 적어주세요. 멘토 소개를 간단히 적어주세요. 멘토 소개를 간단히 적어주세요. 멘토 소개를 간단히 적어주세요.',
  },
  {
    id: 4,
    company: '렛츠커리어',
    name: '레오',
    thumbnailUrl: '',
    stars: 2,
    description: '멘토 소개를 간단히 적어주세요.',
  },
];

export const DUMMY_WRITTEN_FEEDBACK_MISSIONS: WrittenFeedbackMission[] = [
  {
    id: 1,
    thumbnail: '',
    title: '프로그램 n주차 미션, 서면 피드백',
    description: '미션설명 미션설명 미션설명 미션설명',
    status: 'pending',
    challengeType: '경험정리',
    missionNumber: 1,
    startDay: '2026-06-01',
    endDay: '2026-06-28',
  },
  {
    id: 2,
    thumbnail: '',
    title: '프로그램 n주차 미션',
    description:
      '미션설명 미션설명 미션설명 미션설명 미션설명 미션설명 미션설명 미션설명',
    status: 'submitted',
    challengeType: 'HR',
    missionNumber: 2,
    startDay: '2026-05-04',
    endDay: '2026-05-31',
  },
  {
    id: 3,
    thumbnail: '',
    title: '프로그램 n주차 서면 피드백 프로그램 n주차 미션',
    description:
      '미션설명 미션설명 미션설명 미션설명 미션설명 미션설명 미션설명 미션설명',
    status: 'done',
    challengeType: '대기업 자소서',
    missionNumber: 3,
    startDay: '2026-04-01',
    endDay: '2026-04-30',
  },
];

export const DUMMY_FEEDBACK_MISSIONS: LiveFeedbackMission[] = [
  {
    id: 1,
    thumbnail: '',
    title: '프로그램 n주차 미션, LIVE 1:1 멘토링',
    description: '미션설명 미션설명 미션설명 미션설명',
    status: 'prev',
    challengeType: 'HR',
    missionNumber: 1,
    startDay: '2026-05-10',
    endDay: '2026-06-01',
    reservationStartDay: '2026-04-12',
    reservationEndDay: '2026-05-30',
    assignedMentor: DUMMY_MENTORS[0],
    reservationInfo: null,
  },
  {
    id: 2,
    thumbnail: '',
    title: '프로그램 n주차 미션, LIVE 1:1 멘토링',
    description:
      '미션설명 미션설명 미션설명 미션설명 미션설명 미션설명 미션설명 미션설명 미션설명 미션설명 ',
    status: 'reserved',
    challengeType: '마케팅',
    missionNumber: 2,
    startDay: '2026-05-04',
    endDay: '2026-05-31',
    reservationStartDay: '2026-05-08',
    reservationEndDay: '2026-05-20',
    assignedMentor: DUMMY_MENTORS[1],
    reservationInfo: {
      reservationId: 'reservation-dummy-001',
      scheduledDate: '2026-05-10',
      scheduledTime: '13:30',
    },
  },
  {
    id: 3,
    thumbnail: '',
    title: '프로그램 n주차 미션, LIVE 1:1 멘토링',
    description:
      '미션설명 미션설명 미션설명 미션설명 미션설명 미션설명 미션설명 미션설명 미션설명 미션설명 ',
    status: 'done',
    challengeType: '경험정리',
    missionNumber: 3,
    startDay: '2026-03-01',
    endDay: '2026-03-31',
    reservationStartDay: '2026-03-05',
    reservationEndDay: '2026-03-20',
    assignedMentor: DUMMY_MENTORS[1],
    reservationInfo: {
      reservationId: 'reservation-dummy-001',
      scheduledDate: '2026-03-10',
      scheduledTime: '14:00',
    },
  },
  {
    id: 4,
    thumbnail: '',
    title: '프로그램 n주차 미션, LIVE 1:1 멘토링',
    description:
      '미션설명 미션설명 미션설명 미션설명 미션설명 미션설명 미션설명 미션설명 미션설명 미션설명 ',
    status: 'done',
    challengeType: '대기업 자소서',
    missionNumber: 4,
    startDay: '2026-04-01',
    endDay: '2026-04-30',
    reservationStartDay: '2026-04-05',
    reservationEndDay: '2026-04-18',
    assignedMentor: DUMMY_MENTORS[2],
    reservationInfo: {
      reservationId: 'reservation-dummy-002',
      scheduledDate: '2026-04-10',
      scheduledTime: '14:00',
    },
  },
  {
    id: 5,
    thumbnail: '',
    title: '프로그램 n주차 미션, LIVE 1:1 멘토링',
    description: '미션설명 미션설명 미션설명 미션설명',
    status: 'canceled',
    challengeType: '마케팅 서류 완성 25기',
    missionNumber: 25,
    startDay: '2026-05-01',
    endDay: '2026-05-31',
    reservationStartDay: '2026-05-05',
    reservationEndDay: '2026-05-15',
    assignedMentor: DUMMY_MENTORS[2],
    reservationInfo: {
      reservationId: 'reservation-dummy-003',
      scheduledDate: null,
      scheduledTime: null,
      previousScheduledDate: '2026-05-08',
      previousScheduledTime: '10:00',
    },
  },
  {
    id: 6,
    thumbnail: '',
    title: '프로그램 n주차 미션, LIVE 1:1 멘토링',
    description: '미션설명 미션설명 미션설명 미션설명',
    status: 'changed',
    challengeType: '경험정리',
    missionNumber: 6,
    startDay: '2026-05-01',
    endDay: '2026-05-31',
    reservationStartDay: '2026-05-05',
    reservationEndDay: '2026-05-15',
    assignedMentor: DUMMY_MENTORS[3],
    reservationInfo: {
      reservationId: 'reservation-dummy-004',
      scheduledDate: '2026-05-14',
      scheduledTime: '18:00',
      previousScheduledDate: '2026-05-12',
      previousScheduledTime: '11:00',
    },
  },
  {
    id: 7,
    thumbnail: '',
    title: '프로그램 n주차 미션, LIVE 1:1 멘토링',
    description: '미션설명 미션설명 미션설명 미션설명',
    status: 'expired',
    challengeType: 'HR',
    missionNumber: 7,
    startDay: '2026-02-01',
    endDay: '2026-02-28',
    reservationStartDay: '2026-02-03',
    reservationEndDay: '2026-02-10',
    assignedMentor: DUMMY_MENTORS[3],
    reservationInfo: null,
  },
];
