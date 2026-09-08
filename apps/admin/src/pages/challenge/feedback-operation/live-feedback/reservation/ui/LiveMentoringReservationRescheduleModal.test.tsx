import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import type { FeedbackSlotVo } from '@/api/feedback/feedbackSchema';
import type { AdminLiveMentoringReservation } from '@/api/live-mentoring/liveMentoringSchema';
import LiveMentoringReservationRescheduleModal, {
  findValidRuns,
  requiredSlotCount,
} from './LiveMentoringReservationRescheduleModal';

const mutate = vi.fn();
vi.mock('@/api/live-mentoring/liveMentoring', () => ({
  useUpdateLiveMentoringReservationSlotsMutation: () => ({
    mutate,
    isPending: false,
  }),
}));

let slots: FeedbackSlotVo[] = [];
vi.mock('@/api/feedback/feedback', () => ({
  useMentorFeedbackSlotsQuery: () => ({ data: slots }),
}));

function slot(id: number, start: string, end: string): FeedbackSlotVo {
  return { feedbackSlotId: id, startDate: start, endDate: end, status: 'OPEN' };
}

const reservation: AdminLiveMentoringReservation = {
  applicationId: 501,
  liveMentoringId: 10,
  productName: '이력서 1대1 첨삭',
  mentorId: 21,
  mentorName: '김멘토',
  mentorNickname: '렛츠멘토',
  mentorEmail: 'mentor@letscareer.co.kr',
  menteeId: 77,
  menteeName: '최멘티',
  menteeEmail: 'choi@example.com',
  menteePhoneNum: '01012340001',
  contactEmail: null,
  durationMinutes: 30,
  reservationStartAt: '2026-05-30T19:00:00',
  reservationEndAt: '2026-05-30T19:30:00',
  status: 'CONFIRMED',
  createDate: '2026-05-21T09:00:00',
  questionDeferred: false,
  questionContent: null,
};

describe('requiredSlotCount', () => {
  it('30분은 슬롯 1개, 60분은 슬롯 2개다', () => {
    expect(requiredSlotCount(30)).toBe(1);
    expect(requiredSlotCount(60)).toBe(2);
  });

  it('알 수 없는 값은 1개로 취급한다', () => {
    expect(requiredSlotCount(null)).toBe(1);
  });
});

describe('findValidRuns', () => {
  const sorted = [
    slot(1, '2026-09-01T10:00:00', '2026-09-01T10:30:00'),
    slot(2, '2026-09-01T10:30:00', '2026-09-01T11:00:00'),
    // 사이가 비어 1번과 이어지지 않는다.
    slot(3, '2026-09-01T12:00:00', '2026-09-01T12:30:00'),
  ];

  it('count=1 이면 모든 슬롯이 시작점이다', () => {
    const runs = findValidRuns(sorted, 1);
    expect(runs.map((r) => r.start.feedbackSlotId)).toEqual([1, 2, 3]);
  });

  it('count=2 면 실제로 이어진 조합만 남는다', () => {
    const runs = findValidRuns(sorted, 2);
    expect(runs).toHaveLength(1);
    expect(runs[0].start.feedbackSlotId).toBe(1);
    expect(runs[0].run.map((s) => s.feedbackSlotId)).toEqual([1, 2]);
  });

  it('슬롯이 하나뿐이면 count=2 결과는 비어 있다', () => {
    expect(findValidRuns([sorted[0]], 2)).toHaveLength(0);
  });
});

describe('LiveMentoringReservationRescheduleModal', () => {
  beforeEach(() => {
    mutate.mockReset();
    slots = [];
  });

  it('reservation 이 null 이면 렌더하지 않는다', () => {
    const { container } = render(
      <LiveMentoringReservationRescheduleModal
        reservation={null}
        onClose={vi.fn()}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('열린 날짜가 없으면 안내 문구를 보여 준다', () => {
    slots = [];
    render(
      <LiveMentoringReservationRescheduleModal
        reservation={reservation}
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByText('열린 날짜 없음')).toBeInTheDocument();
  });

  it('날짜와 시간을 고르면 30분 예약은 슬롯 1개로 요청한다', () => {
    slots = [slot(9, '2999-01-01T10:00:00', '2999-01-01T10:30:00')];
    render(
      <LiveMentoringReservationRescheduleModal
        reservation={reservation}
        onClose={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByDisplayValue('날짜 선택'), {
      target: { value: '2999-01-01' },
    });
    fireEvent.change(screen.getByDisplayValue('시간 선택'), {
      target: { value: '9' },
    });
    fireEvent.click(screen.getByRole('button', { name: '변경하기' }));

    expect(mutate).toHaveBeenCalledWith(
      { applicationId: 501, slotIds: [9] },
      expect.anything(),
    );
  });

  it('60분 예약은 연속한 슬롯 2개를 함께 요청한다', () => {
    slots = [
      slot(9, '2999-01-01T10:00:00', '2999-01-01T10:30:00'),
      slot(10, '2999-01-01T10:30:00', '2999-01-01T11:00:00'),
    ];
    render(
      <LiveMentoringReservationRescheduleModal
        reservation={{ ...reservation, durationMinutes: 60 }}
        onClose={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByDisplayValue('날짜 선택'), {
      target: { value: '2999-01-01' },
    });
    fireEvent.change(screen.getByDisplayValue('시간 선택'), {
      target: { value: '9' },
    });
    fireEvent.click(screen.getByRole('button', { name: '변경하기' }));

    expect(mutate).toHaveBeenCalledWith(
      { applicationId: 501, slotIds: [9, 10] },
      expect.anything(),
    );
  });

  it('시간을 고르기 전에는 변경하기 버튼이 비활성이다', () => {
    slots = [slot(9, '2999-01-01T10:00:00', '2999-01-01T10:30:00')];
    render(
      <LiveMentoringReservationRescheduleModal
        reservation={reservation}
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByRole('button', { name: '변경하기' })).toBeDisabled();
  });
});
