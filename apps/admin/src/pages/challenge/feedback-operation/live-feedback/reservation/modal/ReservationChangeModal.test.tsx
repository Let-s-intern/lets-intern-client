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

/** OPEN 2개 + RESERVED 1개 — 자유 입력 매칭 분기(가능/예약됨/없음) 검증용 */
const mentorSlots: FeedbackSlotVo[] = [
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
  {
    feedbackSlotId: 10103,
    startDate: '2026-06-01T17:00:00',
    endDate: '2026-06-01T17:30:00',
    status: 'RESERVED',
  },
];

const snackbar = vi.fn();
const refetch = vi.fn();
const changeMutate = vi.fn();
let slotsData: FeedbackSlotVo[] = mentorSlots;
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

/** 날짜·시간 자유 입력 헬퍼 */
function typeDateTime(date: string, time: string) {
  fireEvent.change(screen.getByLabelText('날짜 입력'), {
    target: { value: date },
  });
  fireEvent.change(screen.getByLabelText('시간 입력'), {
    target: { value: time },
  });
}

describe('ReservationChangeModal', () => {
  beforeEach(() => {
    snackbar.mockReset();
    refetch.mockReset();
    changeMutate.mockReset();
    slotsData = mentorSlots;
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

  it('일시 입력 전에는 변경하기 버튼이 비활성이다', () => {
    render(
      <ReservationChangeModal reservation={reservation} onClose={vi.fn()} />,
    );
    expect(screen.getByRole('button', { name: '변경하기' })).toBeDisabled();
  });

  it('날짜만 입력하면 그 날짜의 변경 가능 시간대를 안내한다', () => {
    render(
      <ReservationChangeModal reservation={reservation} onClose={vi.fn()} />,
    );
    fireEvent.change(screen.getByLabelText('날짜 입력'), {
      target: { value: '2026-06-04' },
    });
    expect(
      screen.getByText('이 날짜의 변경 가능 시간대: 11:00 ~ 11:30'),
    ).toBeInTheDocument();
  });

  it('OPEN 슬롯과 일치하는 일시를 입력하면 변경하기가 활성화되고 클릭 시 mutation 을 호출한다', () => {
    render(
      <ReservationChangeModal reservation={reservation} onClose={vi.fn()} />,
    );

    typeDateTime('2026-06-04', '11:00');
    expect(screen.getByText('변경 가능한 시간대입니다.')).toBeInTheDocument();

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

  it('슬롯이 없는 일시를 입력하면 변경 불가 안내를 띄우고 비활성을 유지한다', () => {
    render(
      <ReservationChangeModal reservation={reservation} onClose={vi.fn()} />,
    );

    typeDateTime('2026-06-04', '13:00');

    expect(
      screen.getByText(
        '멘토가 슬롯을 열지 않은 시간대라 일정을 변경할 수 없습니다.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '변경하기' })).toBeDisabled();
  });

  it('이미 예약된(RESERVED) 일시를 입력하면 예약됨 안내를 띄우고 비활성을 유지한다', () => {
    render(
      <ReservationChangeModal reservation={reservation} onClose={vi.fn()} />,
    );

    typeDateTime('2026-06-01', '17:00');

    expect(
      screen.getByText(
        '이미 예약된 시간대입니다. 다른 시간대를 선택해 주세요.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '변경하기' })).toBeDisabled();
  });

  it('변경 성공 시 토스트를 띄우고 모달을 닫는다', () => {
    const onClose = vi.fn();
    changeMutate.mockImplementation((_vars, opts) => opts?.onSuccess?.());

    render(
      <ReservationChangeModal reservation={reservation} onClose={onClose} />,
    );

    typeDateTime('2026-06-04', '11:00');
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

    typeDateTime('2026-06-04', '11:00');
    fireEvent.click(screen.getByRole('button', { name: '변경하기' }));

    expect(snackbar).toHaveBeenCalledWith(
      '예약 변경에 실패했습니다. 다시 시도해 주세요.',
    );
    expect(refetch).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('OPEN 슬롯이 하나도 없으면 슬롯 미오픈 경고를 띄우고, 입력해도 변경하기는 비활성이다', () => {
    slotsData = [
      {
        feedbackSlotId: 10103,
        startDate: '2026-06-01T17:00:00',
        endDate: '2026-06-01T17:30:00',
        status: 'RESERVED',
      },
    ];
    render(
      <ReservationChangeModal reservation={reservation} onClose={vi.fn()} />,
    );

    expect(
      screen.getByText(/멘토가 열어둔 예약 가능 슬롯이 없어/),
    ).toBeInTheDocument();

    // 입력 자체는 가능하지만 제출은 막힌다
    typeDateTime('2026-06-10', '10:00');
    expect(screen.getByRole('button', { name: '변경하기' })).toBeDisabled();
  });
});
