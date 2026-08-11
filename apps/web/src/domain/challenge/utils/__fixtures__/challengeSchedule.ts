import dayjs from '@/lib/dayjs';
import { Schedule } from '@/schema';
import { Dayjs } from 'dayjs';

/**
 * 챌린지 369(인적성 검사 수리/추리 뽀개기 2기) 편성을 그대로 옮긴 픽스처.
 * 1~23회차 + 보너스(100), 미션은 매일 08:00 에 열리고 23:59 에 닫힌다.
 * 그래서 매일 00:00~08:00 여덟 시간 동안 진행 중인 미션이 하나도 없다 — LC-3207 의 서식지다.
 */
export const CHALLENGE_FIRST_DAY = '2026-07-20';

const dayStart = (day: number) =>
  dayjs(`${CHALLENGE_FIRST_DAY}T08:00:00+09:00`).add(day, 'day');

const dayEnd = (day: number) =>
  dayjs(`${CHALLENGE_FIRST_DAY}T23:59:00+09:00`).add(day, 'day');

type AttendanceOverrides = Partial<Schedule['attendanceInfo']>;

const emptyAttendance: Schedule['attendanceInfo'] = {
  submitted: null,
  id: null,
  link: null,
  comments: null,
  status: null,
  result: null,
  feedbackStatus: null,
  submittedUserExperienceIds: null,
};

export const buildSchedule = ({
  th,
  id,
  day,
  startDate,
  endDate,
  attendance,
}: {
  th: number | null;
  id?: number;
  /** 챌린지 시작일로부터 며칠째. 그날 08:00~23:59 창을 만든다. */
  day?: number;
  startDate?: Dayjs | null;
  endDate?: Dayjs | null;
  attendance?: AttendanceOverrides;
}): Schedule => ({
  missionInfo: {
    id: id ?? (th ?? 0) + 1000,
    title: `${th}회차 미션`,
    th,
    startDate: startDate !== undefined ? startDate : dayStart(day ?? 0),
    endDate: endDate !== undefined ? endDate : dayEnd(day ?? 0),
    status: null,
  },
  attendanceInfo: { ...emptyAttendance, ...attendance },
});

/** 제출 완료(정상 통과) 출석 기록 */
export const submittedAttendance: AttendanceOverrides = {
  submitted: true,
  id: 1,
  status: 'PRESENT',
  result: 'PASS',
};

/** 1~23회차 + 보너스(100), 하루 한 회차씩 */
export const buildChallengeSchedules = (): Schedule[] => [
  ...Array.from({ length: 23 }, (_, index) =>
    buildSchedule({ th: index + 1, day: index }),
  ),
  buildSchedule({ th: 100, id: 1100, day: 23 }),
];

/** N회차 미션이 진행 중인 시각 (그날 정오) */
export const noonOfMission = (th: number) =>
  dayjs(`${CHALLENGE_FIRST_DAY}T12:00:00+09:00`).add(th - 1, 'day');

/** N회차가 마감되고 N+1회차가 열리기 전, 문의가 들어온 새벽 시각 */
export const dawnAfterMission = (th: number) =>
  dayjs(`${CHALLENGE_FIRST_DAY}T03:36:00+09:00`).add(th, 'day');
