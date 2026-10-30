import { render, screen } from '@testing-library/react';
import UsageVodTab from './UsageVodTab';

let mockVodPassQuery: Record<string, unknown> = {};
jest.mock('@/api/vodPass', () => ({
  useVodPassListQuery: () => mockVodPassQuery,
}));

jest.mock('./useUsageVods', () => ({
  useUsageVods: () => ({
    data: [{ id: 1, title: '면접 VOD', thumbnailUrl: '/t.png', url: '/v/1' }],
    isLoading: false,
    isError: false,
  }),
}));

jest.mock('@mui/material', () => ({ useMediaQuery: () => true }));

const LOCKED_MESSAGE = 'VOD 이용권이 있어야 시청할 수 있어요';

const passWith = (status: string) => ({
  isLoading: false,
  isError: false,
  data: { passes: [{ applicationId: 1, status, refundable: false }] },
});

describe('UsageVodTab', () => {
  it('ACTIVE 이용권이 있으면 VOD 목록을 보여준다', () => {
    // 챌린지에서 산 이용권도 같은 목록의 ACTIVE 한 건이다
    mockVodPassQuery = passWith('ACTIVE');
    render(<UsageVodTab />);
    expect(screen.getByText('면접 VOD')).toBeInTheDocument();
    expect(screen.queryByText(LOCKED_MESSAGE)).toBeNull();
  });

  it.each(['EXPIRED', 'SCHEDULED'])(
    '이용권이 %s 뿐이면 구매 링크 없이 잠금 안내만 보여준다',
    (status) => {
      mockVodPassQuery = passWith(status);
      render(<UsageVodTab />);
      expect(screen.getByText(LOCKED_MESSAGE)).toBeInTheDocument();
      expect(screen.queryByRole('link')).toBeNull();
      expect(screen.queryByText('면접 VOD')).toBeNull();
    },
  );

  it('이용권이 하나도 없으면 잠금을 보여준다', () => {
    mockVodPassQuery = {
      isLoading: false,
      isError: false,
      data: { passes: [] },
    };
    render(<UsageVodTab />);
    expect(screen.getByText(LOCKED_MESSAGE)).toBeInTheDocument();
  });

  it('이용권 조회가 실패하면 안내 문구를 보여주고 목록·잠금은 그리지 않는다', () => {
    mockVodPassQuery = { isLoading: false, isError: true, data: undefined };
    render(<UsageVodTab />);
    expect(
      screen.getByText(
        'VOD 이용권 정보를 불러오지 못했어요. 잠시 후 다시 시도해주세요.',
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText('면접 VOD')).toBeNull();
    expect(screen.queryByText(LOCKED_MESSAGE)).toBeNull();
  });
});
