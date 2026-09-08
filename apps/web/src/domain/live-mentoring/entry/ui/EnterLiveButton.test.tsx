/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react';

import EnterLiveButton, { computeButtonState } from './EnterLiveButton';
import { LIVE_ENTER_LEAD_MS } from '../constants/live';

const START = new Date('2026-06-13T10:00:00+09:00').getTime();
const END = new Date('2026-06-13T11:00:00+09:00').getTime();
const startISO = new Date(START).toISOString();
const endISO = new Date(END).toISOString();

describe('computeButtonState', () => {
  it('일정이 없으면 비활성(unknown)', () => {
    const s = computeButtonState(START);
    expect(s.phase).toBe('unknown');
    expect(s.active).toBe(false);
  });

  it('입장 가능 시각 이전이면 비활성 + "입장까지" 라벨', () => {
    const before = START - LIVE_ENTER_LEAD_MS - 60 * 1000; // 21분 전
    const s = computeButtonState(before, startISO, endISO);
    expect(s.phase).toBe('before');
    expect(s.active).toBe(false);
    expect(s.label).toContain('입장까지');
  });

  it('20분 전 ~ 시작 사이면 활성 + "라이브 입장하기"', () => {
    const inWindow = START - 10 * 60 * 1000; // 10분 전
    const s = computeButtonState(inWindow, startISO, endISO);
    expect(s.phase).toBe('open');
    expect(s.active).toBe(true);
    expect(s.label).toContain('라이브 입장하기');
  });

  it('종료 후면 비활성 + "종료된 세션"', () => {
    const s = computeButtonState(END + 1000, startISO, endISO);
    expect(s.phase).toBe('ended');
    expect(s.active).toBe(false);
    expect(s.label).toBe('종료된 세션');
  });
});

describe('EnterLiveButton (카운트다운 갱신)', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it('입장 불가 시각엔 비활성이고, 경계 넘어가면 활성으로 전환된다', () => {
    // 입장 오픈 2초 전으로 now 고정
    jest.setSystemTime(START - LIVE_ENTER_LEAD_MS - 2000);
    const onEnter = jest.fn();
    render(
      <EnterLiveButton
        startDate={startISO}
        endDate={endISO}
        onEnter={onEnter}
      />,
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button.textContent).toContain('입장까지');

    // 3초 경과 → 입장 오픈 구간 진입
    act(() => {
      jest.setSystemTime(START - LIVE_ENTER_LEAD_MS + 1000);
      jest.advanceTimersByTime(3000);
    });

    expect(button).not.toBeDisabled();
    expect(button.textContent).toContain('라이브 입장하기');

    fireEvent.click(button);
    expect(onEnter).toHaveBeenCalledTimes(1);
  });
});
