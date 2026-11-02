import dayjs from '@/lib/dayjs';
import { getApplyStatus } from './applyStatus';

const NOW = dayjs('2026-11-10T12:00:00');

const BASE = {
  hasLiveId: true,
  isLoading: false,
  hasLiveInfo: true,
  applied: false,
  deadline: NOW.add(1, 'day'),
  now: NOW,
};

describe('getApplyStatus', () => {
  it('마감 전이고 신청하지 않았으면 신청 가능이다', () => {
    expect(getApplyStatus(BASE)).toBe('available');
  });

  it('신청했으면 이미 신청함이다', () => {
    expect(getApplyStatus({ ...BASE, applied: true })).toBe('applied');
  });

  it('마감 뒤에도 신청자는 이미 신청함이다', () => {
    expect(
      getApplyStatus({
        ...BASE,
        applied: true,
        deadline: NOW.subtract(1, 'day'),
      }),
    ).toBe('applied');
  });

  it('현재 시각이 마감을 지나면 마감이다', () => {
    expect(
      getApplyStatus({ ...BASE, deadline: NOW.subtract(1, 'minute') }),
    ).toBe('closed');
  });

  it('마감 시각과 같으면 서버처럼 아직 신청 가능이다', () => {
    expect(getApplyStatus({ ...BASE, deadline: NOW })).toBe('available');
  });

  it('라이브 ID 가 없으면 로딩과 무관하게 정보 없음이다', () => {
    expect(getApplyStatus({ ...BASE, hasLiveId: false, isLoading: true })).toBe(
      'unavailable',
    );
  });

  it('조회 중이면 로딩이다', () => {
    expect(getApplyStatus({ ...BASE, isLoading: true })).toBe('loading');
  });

  it('조회에 실패해 정보가 없으면 정보 없음이다', () => {
    expect(getApplyStatus({ ...BASE, hasLiveInfo: false })).toBe('unavailable');
  });

  it('마감 시각이 없으면 정보 없음이다', () => {
    expect(getApplyStatus({ ...BASE, deadline: null })).toBe('unavailable');
  });
});
