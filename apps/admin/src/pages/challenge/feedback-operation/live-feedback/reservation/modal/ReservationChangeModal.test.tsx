import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type {
  FeedbackAdminVo,
  FeedbackSlotVo,
} from '@/api/feedback/feedbackSchema';

const reservation: FeedbackAdminVo = {
  feedbackId: 1,
  programTitle: '면접 준비 7일 끝장 챌린지 2기',
  mentorId: 101,
  mentorName: '쥬디',
  menteeName: '홍길동',
  startDate: '2026-06-01T17:00:00',
  endDate: '2026-06-01T17:30:00',
  createDate: '2026-05-20T10:12:00',
  mentorStatus: 'PENDING',
  menteeStatus: 'PENDING',
  status: 'RESERVED',
};

const openSlots: FeedbackSlotVo[] = [
  {
    feedbackSlotId: 10106,
    startDate: '2026-06-03T17:30:00',
    endDate: '2026-06-03T18:00:00',
    status: 'OPEN',
  },
  {
    feedbackSlotId: 10107,
    startDate: '2026-06-04T11:00:00',
    endDate: '2026-06-04T11:30:00',
    status: 'OPEN',
  },
];

const snackbar = vi.fn();
const refetch = vi.fn();
const changeMutate = vi.fn();
let slotsData: FeedbackSlotVo[] = openSlots;
let isPending = false;

vi.mock('@/hooks/useAdminSnackbar', () => ({
  useAdminSnackbar: () => ({ snackbar }),
}));

vi.mock('@/api/feedback/feedback', () => ({
  useMentorFeedbackSlotsQuery: () => ({ data: slotsData, refetch }),
  useChangeAdminFeedbackSlotMutation: () => ({
    mutate: changeMutate,
    isPending,
  }),
}));

import ReservationChangeModal from './ReservationChangeModal';

describe('ReservationChangeModal', () => {
  beforeEach(() => {
    snackbar.mockReset();
    refetch.mockReset();
    changeMutate.mockReset();
    slotsData = openSlots;
    isPending = false;
  });

  it('reservation 이 null 이면 아무것도 렌더하지 않는다', () => {
    const { container } = render(
      <ReservationChangeModal reservation={null} onClose={vi.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('멘티·담당 멘토·프로그램·현재 예약을 표시한다', () => {
    render(
      <ReservationChangeModal reservation={reservation} onClose={vi.fn()} />,
    );
    expect(screen.getByText('홍길동 님')).toBeInTheDocument();
    expect(screen.getByText('쥬디 님')).toBeInTheDocument();
    expect(
      screen.getByText('면접 준비 7일 끝장 챌린지 2기'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('2026년 6월 1일 월요일 17:00-17:30'),
    ).toBeInTheDocument();
  });

  it('고정 안내문구 2개를 노출하고 취소/체크박스는 없다', () => {
    render(
      <ReservationChangeModal reservation={reservation} onClose={vi.fn()} />,
    );
    expect(screen.getByText(/반드시 조율 후/)).toBeInTheDocument();
    expect(
      screen.getByText(/자동으로 예약 가능 상태로 전환됩니다/),
    ).toBeInTheDocument();
    expect(screen.queryByText('예약 취소하기')).not.toBeInTheDocument();
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('슬롯 선택 전에는 변경하기 버튼이 비활성이다', () => {
    render(
      <ReservationChangeModal reservation={reservation} onClose={vi.fn()} />,
    );
    expect(screen.getByRole('button', { name: '변경하기' })).toBeDisabled();
  });

  it('날짜·시간대를 선택하면 변경하기가 활성화되고 클릭 시 mutation 을 호출한다', () => {
    render(
      <ReservationChangeModal reservation={reservation} onClose={vi.fn()} />,
    );

    fireEvent.change(screen.getByLabelText('날짜 선택'), {
      target: { value: '2026-06-04' },
    });
    fireEvent.change(screen.getByLabelText('시간대 선택'), {
      target: { value: '10107' },
    });

    const submit = screen.getByRole('button', { name: '변경하기' });
    expect(submit).toBeEnabled();

    fireEvent.click(submit);

    expect(changeMutate).toHaveBeenCalledTimes(1);
    expect(changeMutate.mock.calls[0][0]).toEqual({
      feedbackId: 1,
      feedbackSlotId: 10107,
      mentorId: 101,
    });
  });

  it('변경 성공 시 토스트를 띄우고 모달을 닫는다', () => {
    const onClose = vi.fn();
    changeMutate.mockImplementation((_vars, opts) => opts?.onSuccess?.());

    render(
      <ReservationChangeModal reservation={reservation} onClose={onClose} />,
    );

    fireEvent.change(screen.getByLabelText('날짜 선택'), {
      target: { value: '2026-06-04' },
    });
    fireEvent.change(screen.getByLabelText('시간대 선택'), {
      target: { value: '10107' },
    });
    fireEvent.click(screen.getByRole('button', { name: '변경하기' }));

    expect(snackbar).toHaveBeenCalledWith('예약 일시가 변경되었습니다.');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('변경 실패 시 토스트를 띄우고 슬롯을 refetch 하며 모달은 유지한다', () => {
    const onClose = vi.fn();
    changeMutate.mockImplementation((_vars, opts) => opts?.onError?.());

    render(
      <ReservationChangeModal reservation={reservation} onClose={onClose} />,
    );

    fireEvent.change(screen.getByLabelText('날짜 선택'), {
      target: { value: '2026-06-04' },
    });
    fireEvent.change(screen.getByLabelText('시간대 선택'), {
      target: { value: '10107' },
    });
    fireEvent.click(screen.getByRole('button', { name: '변경하기' }));

    expect(snackbar).toHaveBeenCalledWith(
      '예약 변경에 실패했습니다. 다시 시도해 주세요.',
    );
    expect(refetch).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('OPEN 슬롯이 없으면 안내 문구를 띄우고 변경하기를 비활성화한다', () => {
    slotsData = [];
    render(
      <ReservationChangeModal reservation={reservation} onClose={vi.fn()} />,
    );
    expect(
      screen.getByText('변경 가능한 시간대가 없습니다.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '변경하기' })).toBeDisabled();
  });
});
