import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { INITIAL_FILTER } from '../utils/buildListParams';
import ReservationFilters from './ReservationFilters';

const baseProps = {
  challengeOptions: [{ value: '2', label: '면접준비 챌린지' }],
  mentorOptions: [{ value: '101', label: '쥬디' }],
};

describe('ReservationFilters', () => {
  it('유형 select 에 전체·챌린지·1대1 세 선택지를 표시한다', () => {
    render(
      <ReservationFilters
        {...baseProps}
        filter={INITIAL_FILTER}
        onChange={vi.fn()}
      />,
    );
    const options = Array.from(
      screen.getByLabelText('유형').querySelectorAll('option'),
    ).map((o) => o.textContent);
    expect(options).toEqual([
      '전체',
      '챌린지 라이브 피드백',
      '1대1 라이브 멘토링',
    ]);
  });

  it('유형이 전체이면 프로그램명을 고를 수 있다', () => {
    render(
      <ReservationFilters
        {...baseProps}
        filter={INITIAL_FILTER}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByLabelText('프로그램명')).not.toBeDisabled();
  });

  it('유형이 1대1이면 프로그램명이 잠기고 왜 잠기는지 알린다', () => {
    render(
      <ReservationFilters
        {...baseProps}
        filter={{ ...INITIAL_FILTER, type: 'LIVE_MENTORING' }}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByLabelText('프로그램명')).toBeDisabled();
    expect(
      screen.getByText(
        '1대1 라이브 멘토링에는 챌린지가 없어 프로그램명으로 거를 수 없습니다.',
      ),
    ).toBeInTheDocument();
  });

  it('1대1로 바꾸면 직전에 고른 프로그램명을 함께 비운다', () => {
    const onChange = vi.fn();
    render(
      <ReservationFilters
        {...baseProps}
        filter={{ ...INITIAL_FILTER, challengeId: '2' }}
        onChange={onChange}
      />,
    );
    fireEvent.change(screen.getByLabelText('유형'), {
      target: { value: 'LIVE_MENTORING' },
    });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'LIVE_MENTORING', challengeId: '' }),
    );
  });

  it('유형이 고정된 화면에서는 유형 select 를 감춘다', () => {
    render(
      <ReservationFilters
        {...baseProps}
        filter={{ ...INITIAL_FILTER, type: 'LIVE_MENTORING' }}
        onChange={vi.fn()}
        hideTypeFilter
      />,
    );
    expect(screen.queryByLabelText('유형')).not.toBeInTheDocument();
  });
});
