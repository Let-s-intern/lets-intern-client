import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type {
  FeedbackAdminVo,
  FeedbackDetailAdminVo,
} from '@/api/feedback/feedbackSchema';
import type { AdminLiveMentoringReservation } from '@/api/live-mentoring/liveMentoringSchema';
import { toChallengeRow, toLiveMentoringRow } from '../utils/reservationRow';

const detail: FeedbackDetailAdminVo = {
  feedbackId: 1,
  programTitle: '면접 준비 7일 끝장 챌린지 2기',
  mentorName: '쥬디',
  mentorEmail: 'judy@letscareer.co.kr',
  menteeName: '홍길동',
  menteeEmail: 'hong@example.com',
  menteePhoneNum: '01012340001',
  startDate: '2026-06-01T17:00:00',
  endDate: '2026-06-01T17:30:00',
  createDate: '2026-05-20T10:12:00',
  preQuestion: '면접에서 자기소개를 어떻게 시작하면 좋을까요?',
  meetingUrl: 'https://meet.google.com/abc-defg-hij',
  mentorStatus: 'PRESENT',
  menteeStatus: 'PENDING',
};

const feedback: FeedbackAdminVo = {
  feedbackId: 1,
  programTitle: '면접 준비 7일 끝장 챌린지 2기',
  mentorId: 101,
  mentorName: '쥬디',
  menteeName: '홍길동',
  startDate: '2026-06-01T17:00:00',
  endDate: '2026-06-01T17:30:00',
  createDate: '2026-05-20T10:12:00',
  mentorStatus: 'PRESENT',
  menteeStatus: 'PENDING',
  status: 'RESERVED',
};

const challengeRow = toChallengeRow(feedback);

const makeLiveMentoringRow = (
  overrides: Partial<AdminLiveMentoringReservation> = {},
) =>
  toLiveMentoringRow({
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
    contactEmail: 'contact@example.com',
    durationMinutes: 60,
    reservationStartAt: '2026-06-01T19:00:00',
    reservationEndAt: '2026-06-01T20:00:00',
    status: 'CONFIRMED',
    createDate: '2026-05-21T09:00:00',
    questionDeferred: false,
    questionContent: '포트폴리오를 함께 봐 주실 수 있나요?',
    mentorStatus: 'PENDING',
    menteeStatus: 'PENDING',
    ...overrides,
  });

const useAdminFeedbackDetailQuery = vi.fn();
const updateAttendanceMutate = vi.fn();

vi.mock('@/api/feedback/feedback', () => ({
  useAdminFeedbackDetailQuery: (id?: number) => useAdminFeedbackDetailQuery(id),
  useUpdateAdminFeedbackMutation: () => ({ mutate: vi.fn(), isPending: false }),
}));

vi.mock('@/api/live-mentoring/liveMentoring', () => ({
  useUpdateLiveMentoringReservationAttendanceMutation: () => ({
    mutate: updateAttendanceMutate,
    isPending: false,
  }),
}));

import ReservationDetailModal from './ReservationDetailModal';

describe('ReservationDetailModal', () => {
  it('선택된 예약이 없으면 아무것도 렌더하지 않는다', () => {
    useAdminFeedbackDetailQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
    });
    const { container } = render(
      <ReservationDetailModal row={null} onClose={vi.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('상세 데이터를 필드에 매핑해 표시한다', () => {
    useAdminFeedbackDetailQuery.mockReturnValue({
      data: detail,
      isLoading: false,
    });
    render(<ReservationDetailModal row={challengeRow} onClose={vi.fn()} />);

    expect(
      screen.getByText('면접 준비 7일 끝장 챌린지 2기'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('2026년 6월 1일 월요일 17:00-17:30'),
    ).toBeInTheDocument();
    expect(screen.getByText('쥬디')).toBeInTheDocument();
    expect(screen.getByText('judy@letscareer.co.kr')).toBeInTheDocument();
    expect(screen.getByText('홍길동')).toBeInTheDocument();
    expect(screen.getByText('hong@example.com')).toBeInTheDocument();
    expect(screen.getByText('01012340001')).toBeInTheDocument();
    // 출석 상태 한글 매핑. 같은 말이 수정 패널 select 에도 있어 개수로 보지 않는다.
    expect(screen.getAllByText('참석').length).toBeGreaterThan(0);
    expect(screen.getAllByText('대기').length).toBeGreaterThan(0);
    // 사전 질문 / 미팅 URL
    expect(
      screen.getByText('면접에서 자기소개를 어떻게 시작하면 좋을까요?'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('https://meet.google.com/abc-defg-hij'),
    ).toBeInTheDocument();
  });

  it('로딩 중에는 안내 문구를 표시한다', () => {
    useAdminFeedbackDetailQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
    });
    render(<ReservationDetailModal row={challengeRow} onClose={vi.fn()} />);
    expect(screen.getByText('불러오는 중...')).toBeInTheDocument();
  });

  describe('1대1 라이브 멘토링', () => {
    it('상세 조회 없이 목록이 가진 값으로 필드를 채운다', () => {
      useAdminFeedbackDetailQuery.mockClear();
      useAdminFeedbackDetailQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
      });
      render(
        <ReservationDetailModal
          row={makeLiveMentoringRow()}
          onClose={vi.fn()}
        />,
      );

      // 챌린지 상세 조회는 나가지 않는다(1대1 id 로 조회하면 남의 예약이 열린다).
      expect(useAdminFeedbackDetailQuery).toHaveBeenCalledWith(undefined);

      expect(screen.getByText('최멘티')).toBeInTheDocument();
      expect(screen.getByText('이력서 1대1 첨삭')).toBeInTheDocument();
      expect(screen.getByText('렛츠멘토')).toBeInTheDocument();
      expect(screen.getByText('contact@example.com')).toBeInTheDocument();
      expect(screen.getByText('결제 완료')).toBeInTheDocument();
      expect(screen.getByText('60분')).toBeInTheDocument();
      expect(
        screen.getByText('2026년 6월 1일 월요일 19:00-20:00'),
      ).toBeInTheDocument();
      expect(
        screen.getByText('포트폴리오를 함께 봐 주실 수 있나요?'),
      ).toBeInTheDocument();
    });

    // 임의로 감추지 않는다. 무엇이 왜 없는지 화면에서 읽혀야 한다.
    it('1대1에 없는 조작을 제한 사항으로 알린다', () => {
      render(
        <ReservationDetailModal
          row={makeLiveMentoringRow()}
          onClose={vi.fn()}
        />,
      );
      const limitations = screen.getByLabelText('제한 사항');
      expect(limitations).toHaveTextContent('후기 점수·내용 수정');
      // 예약 일정 변경, 출석 체크, 입장 링크 복사는 더 이상 제한 사항이 아니다.
      expect(limitations).not.toHaveTextContent('예약 일정 변경');
      expect(limitations).not.toHaveTextContent('멘토·멘티 출석 체크');
      expect(limitations).not.toHaveTextContent('멘토·멘티 입장 링크 복사');
    });

    it('멘토·멘티 입장 링크를 각각 클립보드에 복사한다', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, { clipboard: { writeText } });

      render(
        <ReservationDetailModal
          row={makeLiveMentoringRow({ applicationId: 777 })}
          onClose={vi.fn()}
        />,
      );

      fireEvent.click(
        screen.getByRole('button', { name: '멘토 입장 링크 복사' }),
      );
      await Promise.resolve();
      expect(writeText).toHaveBeenLastCalledWith(
        expect.stringMatching(/\/live-mentoring\/mentor\/777$/),
      );

      fireEvent.click(
        screen.getByRole('button', { name: '멘티 입장 링크 복사' }),
      );
      await Promise.resolve();
      expect(writeText).toHaveBeenLastCalledWith(
        expect.stringMatching(/\/live-mentoring\/mentee\/777$/),
      );
    });

    it('출석 값을 select 로 보여주고 저장하면 뮤테이션을 부른다', () => {
      updateAttendanceMutate.mockClear();
      useAdminFeedbackDetailQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
      });
      render(
        <ReservationDetailModal
          row={makeLiveMentoringRow({
            applicationId: 501,
            mentorStatus: 'PRESENT',
            menteeStatus: 'PENDING',
          })}
          onClose={vi.fn()}
        />,
      );

      const [mentorSelect, menteeSelect] = screen.getAllByRole('combobox');
      expect(mentorSelect).toHaveValue('PRESENT');
      expect(menteeSelect).toHaveValue('PENDING');

      fireEvent.change(menteeSelect, { target: { value: 'ABSENT' } });
      fireEvent.click(screen.getByRole('button', { name: '저장하기' }));

      expect(updateAttendanceMutate).toHaveBeenCalledWith({
        applicationId: 501,
        mentorStatus: 'PRESENT',
        menteeStatus: 'ABSENT',
      });
    });

    it('결제 완료건은 예약 변경 버튼을 내건다', () => {
      render(
        <ReservationDetailModal
          row={makeLiveMentoringRow()}
          onClose={vi.fn()}
          onReschedule={vi.fn()}
        />,
      );
      expect(
        screen.getByRole('button', { name: '예약 변경' }),
      ).toBeInTheDocument();
    });

    it('결제 대기·슬롯 없는 건은 예약 변경 버튼을 내걸지 않는다', () => {
      render(
        <ReservationDetailModal
          row={makeLiveMentoringRow({
            status: 'PAYMENT_PENDING',
            reservationStartAt: null,
            reservationEndAt: null,
          })}
          onClose={vi.fn()}
          onReschedule={vi.fn()}
        />,
      );
      expect(
        screen.queryByRole('button', { name: '예약 변경' }),
      ).not.toBeInTheDocument();
    });

    it('사전 질문을 미룬 신청은 그 사실을 적는다', () => {
      render(
        <ReservationDetailModal
          row={makeLiveMentoringRow({
            questionDeferred: true,
            questionContent: null,
          })}
          onClose={vi.fn()}
        />,
      );
      expect(
        screen.getByText('멘티가 사전 질문을 나중에 보내겠다고 선택했습니다.'),
      ).toBeInTheDocument();
    });

    it('슬롯을 잡지 못한 신청은 예약 일시 자리에 그 사실을 적는다', () => {
      render(
        <ReservationDetailModal
          row={makeLiveMentoringRow({
            status: 'PAYMENT_PENDING',
            reservationStartAt: null,
            reservationEndAt: null,
          })}
          onClose={vi.fn()}
        />,
      );
      expect(screen.getByText('예약 슬롯 없음')).toBeInTheDocument();
      expect(screen.getByText('결제 대기')).toBeInTheDocument();
    });
  });

  it('챌린지 예약은 예약 변경 버튼으로 전환할 수 있다', () => {
    useAdminFeedbackDetailQuery.mockReturnValue({
      data: detail,
      isLoading: false,
    });
    const onReschedule = vi.fn();
    render(
      <ReservationDetailModal
        row={challengeRow}
        onClose={vi.fn()}
        onReschedule={onReschedule}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: '예약 변경' }));
    expect(onReschedule).toHaveBeenCalled();
  });

  it('1대1 예약도 예약 변경 버튼으로 전환할 수 있다', () => {
    const onReschedule = vi.fn();
    render(
      <ReservationDetailModal
        row={makeLiveMentoringRow()}
        onClose={vi.fn()}
        onReschedule={onReschedule}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: '예약 변경' }));
    expect(onReschedule).toHaveBeenCalled();
  });
});
