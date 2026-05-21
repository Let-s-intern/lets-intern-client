import type { Mentor, SlotStatus } from './live/types';
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
    nickname: '이프쌤',
    profileImgUrl: '',
    introduction:
      '멘토 소개를 간단히 적어주세요. 멘토 소개를 간단히 적어주세요.멘토 소개를 간단히 적어주세요. 멘토 소개를 간단히 적어주세요. 멘토 소개를 간단히 적어주세요. 멘토 소개를 간단히 적어주세요.',
  },
  {
    nickname: '줄리아',
    profileImgUrl: '',
    introduction:
      '멘토 소개를 간단히 적어주세요. 멘토 소개를 간단히 적어주세요. 멘토 소개를 간단히 적어주세요. 멘토 소개를 간단히 적어주세요. ',
  },
  {
    nickname: '도안',
    profileImgUrl: '',
    introduction:
      '멘토 소개를 간단히 적어주세요.멘토 소개를 간단히 적어주세요. 멘토 소개를 간단히 적어주세요. 멘토 소개를 간단히 적어주세요. 멘토 소개를 간단히 적어주세요.',
  },
  {
    nickname: '레오',
    profileImgUrl: '',
    introduction: '멘토 소개를 간단히 적어주세요.',
  },
];

export const DUMMY_WRITTEN_FEEDBACK_MISSIONS: WrittenFeedbackMission[] = [
  {
    id: 1,
    thumbnail: '',
    title: '프로그램 n주차 미션, 서면 피드백',
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

// export const DUMMY_FEEDBACK_MISSIONS: LiveFeedbackMission[] = [
//   {
//     id: 1,
//     thumbnail: '',
//     title: '프로그램 n주차 미션, LIVE 1:1 멘토링',
//     status: 'prev',
//     challengeType: 'HR',
//     missionNumber: 1,
//     startDay: '2026-05-10',
//     endDay: '2026-06-01',
//     feedbackStartDay: '2026-06-01',
//     feedbackEndDay: '2026-06-04',
//     assignedMentor: DUMMY_MENTORS[0],
//     reservationInfo: null,
//   },
//   {
//     id: 2,
//     thumbnail: '',
//     title: '프로그램 n주차 미션, LIVE 1:1 멘토링',
//     status: 'reserved',
//     challengeType: '마케팅',
//     missionNumber: 2,
//     startDay: '2028-01-01',
//     endDay: '2028-12-31',
//     feedbackStartDay: '2028-12-31',
//     feedbackEndDay: '2029-01-03',
//     assignedMentor: DUMMY_MENTORS[1],
//     reservationInfo: {
//       feedbackId: 1,
//       startDate: '2028-12-31T13:30:00.000Z',
//       endDate: '2028-12-31T14:00:00.000Z',
//       meetingUrl: null,
//     },
//   },
//   {
//     id: 3,
//     thumbnail: '',
//     title: '프로그램 n주차 미션, LIVE 1:1 멘토링',
//     status: 'done',
//     challengeType: '경험정리',
//     missionNumber: 3,
//     startDay: '2026-03-05',
//     endDay: '2026-03-20',
//     feedbackStartDay: '2026-03-20',
//     feedbackEndDay: '2026-03-23',
//     assignedMentor: DUMMY_MENTORS[1],
//     reservationInfo: {
//       feedbackId: 2,
//       startDate: '2026-03-10T14:00:00.000Z',
//       endDate: '2026-03-10T14:30:00.000Z',
//       meetingUrl: null,
//     },
//   },
//   {
//     id: 4,
//     thumbnail: '',
//     title: '프로그램 n주차 미션, LIVE 1:1 멘토링',
//     status: 'done',
//     challengeType: '대기업 자소서',
//     missionNumber: 4,
//     startDay: '2026-04-05',
//     endDay: '2026-04-18',
//     feedbackStartDay: '2026-04-18',
//     feedbackEndDay: '2026-04-21',
//     assignedMentor: DUMMY_MENTORS[2],
//     reservationInfo: {
//       feedbackId: 3,
//       startDate: '2026-04-10T14:00:00.000Z',
//       endDate: '2026-04-10T14:30:00.000Z',
//       meetingUrl: null,
//     },
//   },
//   {
//     id: 5,
//     thumbnail: '',
//     title: '프로그램 n주차 미션, LIVE 1:1 멘토링',
//     status: 'expired',
//     challengeType: 'HR',
//     missionNumber: 7,
//     startDay: '2026-02-03',
//     endDay: '2026-02-10',
//     feedbackStartDay: '2026-02-10',
//     feedbackEndDay: '2026-02-13',
//     assignedMentor: DUMMY_MENTORS[3],
//     reservationInfo: null,
//   },
// ];
