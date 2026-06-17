import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import axios from '@/utils/axios';

import FeedbackAvailabilityModal from '../FeedbackAvailabilityModal';

vi.mock('@/utils/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

const axiosMock = vi.mocked(axios, true);

beforeEach(() => {
  axiosMock.get.mockReset();
  axiosMock.post.mockReset();
  axiosMock.delete.mockReset();
});

afterEach(() => {
  vi.clearAllMocks();
});

function renderModal(
  props: { isOpen: boolean; onClose?: () => void } = {
    isOpen: true,
  },
) {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
  const onClose = props.onClose ?? vi.fn();
  const utils = render(
    <QueryClientProvider client={client}>
      <FeedbackAvailabilityModal isOpen={props.isOpen} onClose={onClose} />
    </QueryClientProvider>,
  );
  return { ...utils, onClose };
}

describe('FeedbackAvailabilityModal', () => {
  it('isOpen=false 면 axios.get 을 호출하지 않는다 (enabled 가드)', async () => {
    renderModal({ isOpen: false });
    await new Promise((r) => setTimeout(r, 10));
    expect(axiosMock.get).not.toHaveBeenCalled();
  });

  it('isOpen=true 일 때 BE 슬롯을 GET 한다', async () => {
    axiosMock.get.mockResolvedValue({
      data: { data: { feedbackSlotList: [] } },
    });
    renderModal({ isOpen: true });
    await waitFor(() =>
      expect(axiosMock.get).toHaveBeenCalledWith(
        '/feedback/mentor/slot',
        expect.objectContaining({
          params: expect.objectContaining({
            statusList: ['OPEN', 'RESERVED'],
          }),
        }),
      ),
    );
  });

  it('변경 없이 저장 클릭 시 onClose 호출 + mutation 미호출', async () => {
    axiosMock.get.mockResolvedValue({
      data: { data: { feedbackSlotList: [] } },
    });
    const onClose = vi.fn();
    renderModal({ isOpen: true, onClose });
    const saveButton = await screen.findByRole('button', { name: '저장하기' });
    fireEvent.click(saveButton);
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    expect(axiosMock.post).not.toHaveBeenCalled();
    expect(axiosMock.delete).not.toHaveBeenCalled();
  });

  it('에러 응답 시 다시 시도 버튼이 노출된다', async () => {
    axiosMock.get.mockRejectedValue(new Error('network'));
    renderModal({ isOpen: true });
    await waitFor(() =>
      expect(
        screen.getByText('슬롯 정보를 불러오지 못했습니다.'),
      ).toBeInTheDocument(),
    );
  });

  it('"예약현황 보기" 클릭 시 예약 현황 모달이 열린다', async () => {
    const user = userEvent.setup();
    axiosMock.get.mockResolvedValue({
      data: { data: { feedbackSlotList: [] } },
    });
    renderModal({ isOpen: true });

    // 일정 오픈 모달 헤더의 "예약 현황 보기" 버튼이 노출된다.
    const openReservationButton = await screen.findByRole('button', {
      name: '예약 현황 보기',
    });
    await user.click(openReservationButton);

    // 예약 현황 모달(헤더 "예약 현황")이 열린다 — 페이지 이동 아님.
    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: '예약 현황' }),
      ).toBeInTheDocument(),
    );
  });
});
