import { render, screen } from '@testing-library/react';
import UsageVodTab from './UsageVodTab';
import { useUsageVods } from './useUsageVods';

jest.mock('./useUsageVods', () => ({
  useUsageVods: jest.fn(() => ({
    data: [{ id: 1, title: '면접 VOD', thumbnailUrl: '/t.png', url: '/v/1' }],
    isLoading: false,
    isError: false,
  })),
}));

jest.mock('@mui/material', () => ({ useMediaQuery: () => true }));

const period = {
  startsAt: '2026-10-01T10:00:00+09:00',
  endsAt: '2099-11-01T10:00:00+09:00',
};

describe('UsageVodTab', () => {
  beforeEach(() => jest.mocked(useUsageVods).mockClear());

  it('이용 중이면 이용 기간과 D-day, VOD 목록을 보여준다', () => {
    render(<UsageVodTab period={{ ...period, isActive: true }} />);
    expect(screen.getByText('2026.10.01 ~ 2099.11.01')).toBeInTheDocument();
    expect(screen.getByText(/^D-\d+$/)).toBeInTheDocument();
    expect(screen.getByText('면접 VOD')).toBeInTheDocument();
  });

  it('시작 전이면 기간만 보여주고 VOD 목록을 조회하지 않는다', () => {
    render(<UsageVodTab period={{ ...period, isActive: false }} />);
    expect(screen.getByText('2026.10.01 ~ 2099.11.01')).toBeInTheDocument();
    expect(
      screen.getByText('이용 시작일부터 시청할 수 있어요.'),
    ).toBeInTheDocument();
    expect(useUsageVods).not.toHaveBeenCalled();
  });
});
