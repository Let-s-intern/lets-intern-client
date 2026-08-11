import dayjs from '@/lib/dayjs';
import {
  formatMissionOpenTime,
  isWithinMinuteCountdown,
} from './missionOpenTime';

const at = (iso: string) => dayjs(`${iso}+09:00`);

describe('formatMissionOpenTime', () => {
  // 한 시간 안쪽에서만 분이 의미를 갖는다.
  it('한 시간 안쪽이면 분으로 센다', () => {
    const now = at('2026-08-12T07:19:00');
    const start = at('2026-08-12T08:00:00');

    expect(formatMissionOpenTime(start, now)).toBe('41분 뒤 열려요');
  });

  it('이미 열릴 시각이 지났으면 곧 열린다고 한다', () => {
    const now = at('2026-08-12T08:00:00');
    const start = at('2026-08-12T08:00:00');

    expect(formatMissionOpenTime(start, now)).toBe('곧 열려요');
  });

  // "8시간 12분 뒤" 는 기다릴 수 있는 시간이 아니라 절대 시각으로 말한다.
  it('같은 날 한 시간 넘게 남았으면 오늘 몇 시인지 말한다', () => {
    const now = at('2026-08-12T02:00:00');
    const start = at('2026-08-12T08:00:00');

    expect(formatMissionOpenTime(start, now)).toBe('오늘 오전 8시에 열려요');
  });

  it('하루 뒤면 내일이라고 한다', () => {
    const now = at('2026-08-11T14:00:00');
    const start = at('2026-08-12T08:00:00');

    expect(formatMissionOpenTime(start, now)).toBe('내일 오전 8시에 열려요');
  });

  it('이틀 넘게 남았으면 날짜를 말한다', () => {
    const now = at('2026-08-11T14:00:00');
    const start = at('2026-08-14T08:00:00');

    expect(formatMissionOpenTime(start, now)).toBe(
      '8월 14일 오전 8시에 열려요',
    );
  });

  it('오후 시각과 분을 사람이 읽는 대로 쓴다', () => {
    const now = at('2026-08-11T14:00:00');
    const start = at('2026-08-12T13:30:00');

    expect(formatMissionOpenTime(start, now)).toBe(
      '내일 오후 1시 30분에 열려요',
    );
  });

  it('정오와 자정을 12시로 쓴다', () => {
    const now = at('2026-08-11T08:00:00');

    expect(formatMissionOpenTime(at('2026-08-12T12:00:00'), now)).toBe(
      '내일 오후 12시에 열려요',
    );
    expect(formatMissionOpenTime(at('2026-08-12T00:00:00'), now)).toBe(
      '내일 오전 12시에 열려요',
    );
  });

  // 23:50 → 다음 날 00:10 은 20분 뒤지만 날짜는 하루 차이다. 분 판정이 먼저다.
  it('날짜가 바뀌어도 한 시간 안쪽이면 분으로 센다', () => {
    const now = at('2026-08-11T23:50:00');
    const start = at('2026-08-12T00:10:00');

    expect(formatMissionOpenTime(start, now)).toBe('20분 뒤 열려요');
  });
});

describe('isWithinMinuteCountdown', () => {
  it('한 시간 안쪽이면 참이다', () => {
    expect(
      isWithinMinuteCountdown(
        at('2026-08-12T08:00:00'),
        at('2026-08-12T07:19:00'),
      ),
    ).toBe(true);
  });

  it('한 시간을 넘으면 거짓이다 — 타이머를 돌릴 이유가 없다', () => {
    expect(
      isWithinMinuteCountdown(
        at('2026-08-12T08:00:00'),
        at('2026-08-12T02:00:00'),
      ),
    ).toBe(false);
  });

  it('이미 지났으면 거짓이다', () => {
    expect(
      isWithinMinuteCountdown(
        at('2026-08-12T08:00:00'),
        at('2026-08-12T08:30:00'),
      ),
    ).toBe(false);
  });
});
