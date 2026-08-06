import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { OpeningHistoryItem } from '@/api/live-mentoring/liveMentoringSchema';

const closeMock = vi.fn();
let queryState: { data?: OpeningHistoryItem[]; isLoading: boolean } = {
  data: undefined,
  isLoading: false,
};

vi.mock('@/api/live-mentoring/liveMentoring', () => ({
  useLiveMentoringOpenStatusQuery: () => queryState,
  useCloseLiveMentoringOpeningMutation: () => ({
    mutate: closeMock,
    isPending: false,
  }),
}));

import OpenStatusPage from '../OpenStatusPage';

const openings: OpeningHistoryItem[] = [
  {
    openingId: 102,
    status: 'OPEN',
    durationPrices: [{ duration: 60, price: 60000 }],
    feedbackStartDate: '2026-07-14',
    feedbackEndDate: '2026-07-28',
    openedAt: '2026-07-13T09:00:00',
    closedAt: null,
    closeReason: null,
  },
  {
    openingId: 101,
    status: 'CLOSED',
    durationPrices: [{ duration: 30, price: 35000 }],
    feedbackStartDate: '2026-07-11',
    feedbackEndDate: '2026-07-24',
    openedAt: '2026-07-10T09:00:00',
    closedAt: '2026-07-20T16:00:00',
    closeReason: 'MENTOR_CANCELED',
  },
];

afterEach(() => {
  queryState = { data: undefined, isLoading: false };
  closeMock.mockReset();
});

describe('OpenStatusPage', () => {
  it('개설 이력을 진행시간별 가격과 함께 렌더한다', () => {
    queryState = { data: openings, isLoading: false };
    render(<OpenStatusPage />);

    expect(screen.getByText('60분 60,000원')).toBeInTheDocument();
    expect(screen.getByText('30분 35,000원')).toBeInTheDocument();
    expect(screen.getByText('102')).toBeInTheDocument();
  });

  // 이전에는 "{시작} ~" 와 "{종료}" 가 별도 텍스트 노드라 좁은 열에서 중간이 끊겼다.
  // 한 덩어리로 렌더되는지(= 끊기지 않는지) 고정한다.
  it('피드백 기간을 끊기지 않는 한 덩어리로 렌더한다', () => {
    queryState = { data: openings, isLoading: false };
    render(<OpenStatusPage />);

    expect(screen.getByText('07-14 ~ 07-28')).toBeInTheDocument();
    expect(screen.getByText('07-11 ~ 07-24')).toBeInTheDocument();
  });

  it('상태 뱃지와 종료 사유를 노출한다', () => {
    queryState = { data: openings, isLoading: false };
    render(<OpenStatusPage />);

    expect(screen.getByText('오픈중')).toBeInTheDocument();
    expect(screen.getByText('종료')).toBeInTheDocument();
    expect(screen.getByText('멘토 취소')).toBeInTheDocument();
  });

  // 응답에 예약 수가 없다 — 0으로 채워 보여주면 화면이 사실과 달라진다.
  it('예약 수 열을 렌더하지 않는다', () => {
    queryState = { data: openings, isLoading: false };
    render(<OpenStatusPage />);

    expect(screen.queryByText('예약 수')).not.toBeInTheDocument();
  });

  it('OPEN 인 개설에만 종료 버튼을 둔다', () => {
    queryState = { data: openings, isLoading: false };
    render(<OpenStatusPage />);

    expect(screen.getAllByRole('button', { name: '종료하기' })).toHaveLength(1);
  });

  it('종료는 확인을 거친 뒤 해당 개설 id 로 호출한다', () => {
    queryState = { data: openings, isLoading: false };
    render(<OpenStatusPage />);

    fireEvent.click(screen.getByRole('button', { name: '종료하기' }));
    // 확인 모달이 먼저 뜨고, 이 시점에는 아직 요청이 나가지 않는다.
    expect(closeMock).not.toHaveBeenCalled();
    // 예약이 있어도 종료된다는 서버 동작을 문구로 알린다.
    expect(
      screen.getByText(/진행 중인 예약이 있어도 종료되며/),
    ).toBeInTheDocument();

    // 표의 버튼과 모달의 확인 버튼이 같은 라벨이라, 나중에 렌더된 모달 쪽을 누른다.
    const buttons = screen.getAllByRole('button', { name: '종료하기' });
    fireEvent.click(buttons[buttons.length - 1]);
    expect(closeMock).toHaveBeenCalledTimes(1);
    expect(closeMock.mock.calls[0][0]).toBe(102);
  });

  it('데이터가 없으면 빈 상태 문구를 노출한다', () => {
    queryState = { data: [], isLoading: false };
    render(<OpenStatusPage />);

    expect(screen.getByText(/개설 이력이 없습니다/)).toBeInTheDocument();
  });
});
