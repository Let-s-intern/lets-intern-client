import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ScheduleHeader from '../ui/ScheduleHeader';

describe('ScheduleHeader (피드백 캘린더 페이지 헤더)', () => {
  it('제목 "피드백 캘린더"를 노출한다', () => {
    render(<ScheduleHeader />);

    expect(
      screen.getByRole('heading', { name: '피드백 캘린더' }),
    ).toBeInTheDocument();
  });

  it('서브카피를 노출한다', () => {
    render(<ScheduleHeader />);

    expect(
      screen.getByText('미션 피드백 일정을 확인하고 피드백을 진행하세요.'),
    ).toBeInTheDocument();
  });

  it('"프로그램 일정" 문구는 더 이상 노출하지 않는다', () => {
    render(<ScheduleHeader />);

    expect(screen.queryByText('프로그램 일정')).not.toBeInTheDocument();
  });
});
