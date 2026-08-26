import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import ScheduleChangeModal from './ScheduleChangeModal';

const getMock = jest.fn();
jest.mock('@/utils/axios', () => ({
  __esModule: true,
  default: {
    get: (...args: unknown[]) => getMock(...args),
  },
}));

/*
  09:00 과 09:30 두 칸이 열려 있다. 30분 플랜은 한 칸, 60분 플랜은 연속 두 칸을 쓴다.
*/
const SLOTS = {
  liveMentoringSlotList: [
    {
      slotId: 501,
      startDate: '2026-09-20T09:00:00',
      endDate: '2026-09-20T09:30:00',
      status: 'OPEN',
    },
    {
      slotId: 502,
      startDate: '2026-09-20T09:30:00',
      endDate: '2026-09-20T10:00:00',
      status: 'OPEN',
    },
  ],
};

function renderModal(
  props: Partial<Parameters<typeof ScheduleChangeModal>[0]>,
) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: 0 } },
  });
  const onConfirm = jest.fn();
  const onClose = jest.fn();
  render(
    <QueryClientProvider client={queryClient}>
      <ScheduleChangeModal
        mentorId={1}
        duration={30}
        selectedSlots={[]}
        onConfirm={onConfirm}
        onClose={onClose}
        {...props}
      />
    </QueryClientProvider>,
  );
  return { onConfirm, onClose };
}

beforeEach(() => {
  getMock.mockReset();
  getMock.mockResolvedValue({ data: { data: SLOTS } });
});

describe('ScheduleChangeModal', () => {
  it('멘토의 슬롯을 새로 받아 온다', async () => {
    /*
      충돌했다는 것은 손에 든 목록이 이미 낡았다는 뜻이다. 그대로 다시 고르게 하면
      방금 팔린 자리를 또 고를 수 있다.
    */
    renderModal({});

    await waitFor(() =>
      expect(getMock).toHaveBeenCalledWith('/live-mentoring/mentors/1/slots'),
    );
  });

  it('작성한 내용이 남아 있다는 것을 알린다', () => {
    renderModal({});

    expect(
      screen.getByText(/작성하신 내용은 그대로 있어요/),
    ).toBeInTheDocument();
  });

  it('아무것도 고르지 않으면 변경할 수 없다', async () => {
    renderModal({});

    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: '이 시간으로 변경' }),
      ).toBeDisabled(),
    );
  });

  it('취소하면 아무것도 바꾸지 않고 닫는다', async () => {
    const { onClose, onConfirm } = renderModal({});

    fireEvent.click(screen.getByRole('button', { name: '취소' }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('이미 고른 일정이 있으면 그 상태로 열려 바로 변경할 수 있다', async () => {
    const picked = [
      {
        slotId: 501,
        date: '2026-09-20',
        time: '09:00',
        startDate: '2026-09-20T09:00:00',
        endDate: '2026-09-20T09:30:00',
      },
    ];
    const { onConfirm } = renderModal({ selectedSlots: picked });

    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: '이 시간으로 변경' }),
      ).toBeEnabled(),
    );
    fireEvent.click(screen.getByRole('button', { name: '이 시간으로 변경' }));

    expect(onConfirm).toHaveBeenCalledWith(picked);
  });

  it('60분 플랜은 두 칸을 채워야 변경할 수 있다', async () => {
    const onlyOne = [
      {
        slotId: 501,
        date: '2026-09-20',
        time: '09:00',
        startDate: '2026-09-20T09:00:00',
        endDate: '2026-09-20T09:30:00',
      },
    ];
    renderModal({ duration: 60, selectedSlots: onlyOne });

    // 한 칸만 잡힌 채 나가면 서버 validateSlotsAreConsecutive 에서 400 이 난다.
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: '이 시간으로 변경' }),
      ).toBeDisabled(),
    );
  });
});
