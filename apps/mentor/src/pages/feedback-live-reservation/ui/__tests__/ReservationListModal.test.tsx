import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import ReservationListModal from '../ReservationListModal';

const useFeedbackMentorListQueryMock = vi.fn();
const useUserQueryMock = vi.fn();
const useFeedbackMentorDetailQueryMock = vi.fn();
const useFeedbackMentorSlotsQueryMock = vi.fn();

vi.mock('@/api/feedback/feedback', () => ({
  useFeedbackMentorListQuery: () => useFeedbackMentorListQueryMock(),
  useFeedbackMentorDetailQuery: (id: number | null) =>
    useFeedbackMentorDetailQueryMock(id),
  useFeedbackMentorSlotsQuery: () => useFeedbackMentorSlotsQueryMock(),
}));

vi.mock('@/api/user/user', () => ({
  useUserQuery: () => useUserQueryMock(),
}));

function renderModal(props: { isOpen: boolean; onClose?: () => void }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const onClose = props.onClose ?? vi.fn();
  const utils = render(
    <QueryClientProvider client={client}>
      <ReservationListModal isOpen={props.isOpen} onClose={onClose} />
    </QueryClientProvider>,
  );
  return { ...utils, onClose };
}

function mockBase() {
  useFeedbackMentorListQueryMock.mockReturnValue({
    data: [],
    isLoading: false,
    isError: false,
  });
  useUserQueryMock.mockReturnValue({ data: { name: '테스트 멘토' } });
  useFeedbackMentorDetailQueryMock.mockReturnValue({ data: undefined });
  useFeedbackMentorSlotsQueryMock.mockReturnValue({
    data: { feedbackSlotList: [] },
    isLoading: false,
    isError: false,
  });
}

afterEach(() => {
  vi.clearAllMocks();
});

describe('ReservationListModal', () => {
  it('isOpen=false 면 아무것도 렌더하지 않는다', () => {
    mockBase();
    renderModal({ isOpen: false });
    expect(
      screen.queryByRole('heading', { name: '예약 현황' }),
    ).not.toBeInTheDocument();
  });

  it('isOpen=true 면 헤더와 예약 현황 본문을 노출한다', () => {
    mockBase();
    renderModal({ isOpen: true });
    expect(
      screen.getByRole('heading', { name: '예약 현황' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: '예약 목록' }),
    ).toBeInTheDocument();
  });

  it('닫기(X) 클릭 시 onClose 가 호출된다', async () => {
    const user = (await import('@testing-library/user-event')).default.setup();
    mockBase();
    const { onClose } = renderModal({ isOpen: true });
    await user.click(screen.getByRole('button', { name: '닫기' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
