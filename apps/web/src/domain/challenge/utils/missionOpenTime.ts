import { Dayjs } from 'dayjs';

/** 분 단위로 남은 시간을 세는 구간. 이보다 길면 절대 시각으로 말한다. */
const MINUTE_COUNTDOWN_THRESHOLD_MINUTES = 60;

const formatClock = (date: Dayjs) => {
  const hour = date.hour();
  const minute = date.minute();
  const meridiem = hour < 12 ? '오전' : '오후';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;

  return minute === 0
    ? `${meridiem} ${hour12}시`
    : `${meridiem} ${hour12}시 ${minute}분`;
};

/**
 * 다음 미션이 열리는 시각을 사람이 읽는 말로 바꾼다.
 *
 * 남은 시간이 길면 분 단위로 세지 않는다. "8시간 12분 뒤" 는 기다릴 수 있는 시간이
 * 아니라서 행동으로 옮기기 어렵다. "내일 오전 8시" 라고 하면 알람을 맞추든 자든
 * 정할 수 있다. 날짜보다 오늘·내일로 말하는 것도 같은 이유다.
 *
 * 한 시간 안쪽으로 들어오면 그때는 분이 의미를 갖는다.
 */
export const formatMissionOpenTime = (startDate: Dayjs, now: Dayjs) => {
  const minutesLeft = startDate.diff(now, 'minute');

  if (minutesLeft <= 0) return '곧 열려요';
  if (minutesLeft < MINUTE_COUNTDOWN_THRESHOLD_MINUTES) {
    return `${minutesLeft}분 뒤 열려요`;
  }

  const daysApart = startDate.startOf('day').diff(now.startOf('day'), 'day');
  const clock = formatClock(startDate);

  if (daysApart === 0) return `오늘 ${clock}에 열려요`;
  if (daysApart === 1) return `내일 ${clock}에 열려요`;

  return `${startDate.format('M월 D일')} ${clock}에 열려요`;
};

/**
 * 분 단위 카운트다운 구간인지. 이때만 1분마다 다시 그리면 된다.
 * 그 밖에는 문구가 바뀌지 않으므로 타이머를 돌릴 이유가 없다.
 */
export const isWithinMinuteCountdown = (startDate: Dayjs, now: Dayjs) => {
  const minutesLeft = startDate.diff(now, 'minute');
  return minutesLeft > 0 && minutesLeft < MINUTE_COUNTDOWN_THRESHOLD_MINUTES;
};
