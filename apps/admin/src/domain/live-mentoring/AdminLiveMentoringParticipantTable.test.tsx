import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { AdminLiveMentoringParticipant } from '@/api/live-mentoring/liveMentoringSchema';

const participantsQuery = vi.fn();

vi.mock('@/api/live-mentoring/liveMentoring', () => ({
  useAdminLiveMentoringParticipantsQuery: (params: unknown) =>
    participantsQuery(params),
}));

import AdminLiveMentoringParticipantTable from './AdminLiveMentoringParticipantTable';

const participant: AdminLiveMentoringParticipant = {
  applicationId: 501,
  paymentId: 900,
  liveMentoringId: 10,
  productName: '이력서 1대1 첨삭',
  mentorId: 21,
  mentorName: '김멘토',
  mentorNickname: '렛츠멘토',
  menteeId: 77,
  menteeName: '홍길동',
  menteeEmail: 'hong@example.com',
  menteePhoneNum: '01012340001',
  durationMinutes: 60,
  reservationStartAt: '2026-08-20T17:00:00',
  reservationEndAt: '2026-08-20T18:00:00',
  originalPrice: 60000,
  productDiscount: 5000,
  couponDiscount: 10000,
  paidAmount: 45000,
  couponId: 3,
  couponName: '여름 쿠폰',
  status: 'CONFIRMED',
  refunded: false,
  refundAmount: 0,
  createDate: '2026-08-15T10:00:00',
};

const pageInfo = {
  pageNum: 0,
  pageSize: 20,
  totalElements: 1,
  totalPages: 1,
};

const mockList = (
  participantList: AdminLiveMentoringParticipant[],
  overrides: Record<string, unknown> = {},
) => {
  participantsQuery.mockReturnValue({
    data: { participantList, pageInfo },
    isLoading: false,
    isError: false,
    ...overrides,
  });
};

afterEach(() => {
  vi.clearAllMocks();
});

describe('AdminLiveMentoringParticipantTable', () => {
  it('결제자 한 명의 정보를 컬럼에 맞춰 표시한다', () => {
    mockList([participant]);
    render(<AdminLiveMentoringParticipantTable />);

    expect(screen.getByText('홍길동')).toBeInTheDocument();
    expect(screen.getByText('hong@example.com')).toBeInTheDocument();
    expect(screen.getByText('렛츠멘토')).toBeInTheDocument();
    expect(screen.getByText('2026-08-20 17:00 ~ 18:00')).toBeInTheDocument();
    expect(screen.getByText('60분')).toBeInTheDocument();
    expect(screen.getByText('45,000원')).toBeInTheDocument();
    expect(screen.getByText('정가 60,000원')).toBeInTheDocument();
    expect(screen.getByText('여름 쿠폰 (10,000원 할인)')).toBeInTheDocument();
    expect(screen.getByText('결제 완료')).toBeInTheDocument();
    expect(screen.getByText('환불 없음')).toBeInTheDocument();
  });

  it('쿠폰을 쓰지 않았으면 빈 칸이 아니라 사용 안 함으로 채운다', () => {
    mockList([{ ...participant, couponId: null, couponName: null }]);
    render(<AdminLiveMentoringParticipantTable />);
    expect(screen.getByText('사용 안 함')).toBeInTheDocument();
  });

  // 환불 여부는 신청 취소 플래그로 판단한다. 환불액은 그때만 뜻이 있다.
  it('환불한 건은 환불액과 함께 표시한다', () => {
    mockList([{ ...participant, refunded: true, refundAmount: 45000 }]);
    render(<AdminLiveMentoringParticipantTable />);
    expect(screen.getByText('환불 45,000원')).toBeInTheDocument();
  });

  it('슬롯을 잡지 못한 신청도 목록에서 빠지지 않는다', () => {
    mockList([
      {
        ...participant,
        status: 'PAYMENT_PENDING',
        reservationStartAt: null,
        reservationEndAt: null,
      },
    ]);
    render(<AdminLiveMentoringParticipantTable />);
    expect(screen.getByText('예약 슬롯 없음')).toBeInTheDocument();
    expect(screen.getByText('결제 대기')).toBeInTheDocument();
  });

  it('비어 있으면 안내 문구를 표시한다', () => {
    mockList([], { data: { participantList: [], pageInfo } });
    render(<AdminLiveMentoringParticipantTable />);
    expect(screen.getByText('결제한 참여자가 없습니다.')).toBeInTheDocument();
  });

  it('로딩과 실패를 각각 알린다', () => {
    participantsQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });
    const { rerender } = render(<AdminLiveMentoringParticipantTable />);
    expect(screen.getByText('불러오는 중...')).toBeInTheDocument();

    participantsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });
    rerender(<AdminLiveMentoringParticipantTable />);
    expect(
      screen.getByText('참여자 목록을 불러오지 못했습니다.'),
    ).toBeInTheDocument();
  });
});

describe('멘토별 보기', () => {
  it('mentorId 를 주면 그 멘토만 조회한다', () => {
    mockList([participant]);
    render(<AdminLiveMentoringParticipantTable mentorId={21} />);
    expect(participantsQuery).toHaveBeenCalledWith({
      mentorId: 21,
      page: 1,
      size: 20,
    });
  });

  it('멘토별 보기 중임을 알리고 전체로 돌아갈 수 있다', () => {
    mockList([participant]);
    const onClearMentor = vi.fn();
    render(
      <AdminLiveMentoringParticipantTable
        mentorId={21}
        onClearMentor={onClearMentor}
      />,
    );

    const filter = screen.getByRole('group', { name: '멘토 필터' });
    expect(filter).toHaveTextContent('렛츠멘토 의 참여자만 보고 있습니다.');

    fireEvent.click(screen.getByRole('button', { name: '전체 보기' }));
    expect(onClearMentor).toHaveBeenCalled();
  });

  // 결과가 비면 목록에서 이름을 알 수 없다. 그래도 어느 멘토인지는 남아야 한다.
  it('결과가 비어도 멘토 번호로 누구를 보고 있는지 알린다', () => {
    mockList([]);
    render(<AdminLiveMentoringParticipantTable mentorId={21} />);
    expect(screen.getByRole('group', { name: '멘토 필터' })).toHaveTextContent(
      '멘토 #21 의 참여자만 보고 있습니다.',
    );
    expect(
      screen.getByText('이 멘토의 참여자가 없습니다.'),
    ).toBeInTheDocument();
  });

  it('전체 보기에서는 멘토 필터 안내를 내걸지 않는다', () => {
    mockList([participant]);
    render(<AdminLiveMentoringParticipantTable />);
    expect(
      screen.queryByRole('group', { name: '멘토 필터' }),
    ).not.toBeInTheDocument();
  });
});
