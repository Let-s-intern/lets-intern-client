import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  act,
  fireEvent,
  render as rtlRender,
  screen,
} from '@testing-library/react';
import type { ReactElement } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { AdminRefundRequest } from '@/api/adminRefund';
import type { AdminLiveMentoringParticipant } from '@/api/live-mentoring/liveMentoringSchema';

const participantsQuery = vi.fn();

vi.mock('@/api/live-mentoring/liveMentoring', () => ({
  ADMIN_LIVE_MENTORING_PARTICIPANT_QUERY_KEY: [
    'adminLiveMentoring',
    'participants',
  ],
  useAdminLiveMentoringParticipantsQuery: (params: unknown) =>
    participantsQuery(params),
}));

const refundMutate = vi.fn();
const snackbarMock = vi.fn();
let refundCallbacks: {
  onSuccess?: (refundedAmount: number) => void;
  onError?: (message: string) => void;
} = {};

vi.mock('@/api/adminRefund', () => ({
  useAdminRefundMutation: (callbacks: typeof refundCallbacks) => {
    refundCallbacks = callbacks;
    return { mutate: refundMutate, isPending: false };
  },
}));

vi.mock('@/hooks/useAdminSnackbar', () => ({
  useAdminSnackbar: () => ({ snackbar: snackbarMock }),
}));

// 환불 모달 자체는 프로그램 참여자 화면에서 이미 검증된다. 여기서는 연결만 본다.
vi.mock('@/domain/admin/program/program-user/ui/RefundModal', () => ({
  default: ({
    target,
    mode,
    onSubmit,
  }: {
    target: { applicationId: number; finalPrice: number };
    mode: string;
    onSubmit: (body: AdminRefundRequest) => void;
  }) => (
    <div>
      <span>{`환불모달 ${mode} ${target.applicationId} ${target.finalPrice}`}</span>
      <button
        type="button"
        onClick={() =>
          onSubmit({
            managerName: '담당자',
            reason: 'CS 협의',
            sendNotification: false,
          })
        }
      >
        환불모달실행
      </button>
    </div>
  ),
}));

import AdminLiveMentoringParticipantTable from './AdminLiveMentoringParticipantTable';

/** 환불 성공 시 목록을 무효화하므로 QueryClient 가 필요하다. */
const render = (ui: ReactElement) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return rtlRender(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>,
  );
};

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
  refundCallbacks = {};
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

  it('로딩 중임을 알린다', () => {
    participantsQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });
    render(<AdminLiveMentoringParticipantTable />);
    expect(screen.getByText('불러오는 중...')).toBeInTheDocument();
  });

  it('조회에 실패하면 그 사실을 알린다', () => {
    participantsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });
    render(<AdminLiveMentoringParticipantTable />);
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

describe('환불', () => {
  it('결제 완료 건에만 환불 버튼을 내건다', () => {
    mockList([participant]);
    render(<AdminLiveMentoringParticipantTable />);
    expect(
      screen.getByRole('button', { name: '전체 환불' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '부분 환불' }),
    ).toBeInTheDocument();
  });

  it('이미 환불한 건은 버튼 대신 이유를 적는다', () => {
    mockList([{ ...participant, refunded: true, refundAmount: 45000 }]);
    render(<AdminLiveMentoringParticipantTable />);
    expect(
      screen.queryByRole('button', { name: '전체 환불' }),
    ).not.toBeInTheDocument();
    expect(screen.getByText('환불 완료')).toBeInTheDocument();
  });

  it('결제가 끝나지 않은 건은 환불할 수 없다', () => {
    mockList([{ ...participant, status: 'PAYMENT_PENDING' }]);
    render(<AdminLiveMentoringParticipantTable />);
    expect(screen.getByText('결제 완료 건만 환불')).toBeInTheDocument();
  });

  // 0원 결제는 전체 환불 경로로만 취소된다.
  it('실결제액이 0원이면 부분 환불을 막는다', () => {
    mockList([{ ...participant, paidAmount: 0 }]);
    render(<AdminLiveMentoringParticipantTable />);
    expect(screen.getByRole('button', { name: '부분 환불' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '전체 환불' })).toBeEnabled();
  });

  it('버튼을 눌러도 곧바로 실행하지 않고 확인 단계를 거친다', () => {
    mockList([participant]);
    render(<AdminLiveMentoringParticipantTable />);

    expect(
      screen.queryByText('환불모달 full 501 45000'),
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '전체 환불' }));

    expect(screen.getByText('환불모달 full 501 45000')).toBeInTheDocument();
    expect(refundMutate).not.toHaveBeenCalled();
  });

  it('확인 단계를 지나면 기존 어드민 환불 API 로 신청 번호를 보낸다', () => {
    mockList([participant]);
    render(<AdminLiveMentoringParticipantTable />);

    fireEvent.click(screen.getByRole('button', { name: '부분 환불' }));
    expect(screen.getByText('환불모달 partial 501 45000')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '환불모달실행' }));
    expect(refundMutate).toHaveBeenCalledWith({
      applicationId: 501,
      body: {
        managerName: '담당자',
        reason: 'CS 협의',
        sendNotification: false,
      },
    });
  });

  it('성공하면 모달을 닫고 금액을 알린다', () => {
    mockList([participant]);
    render(<AdminLiveMentoringParticipantTable />);
    fireEvent.click(screen.getByRole('button', { name: '전체 환불' }));

    // 훅 밖에서 부르는 콜백이라 상태 반영을 act 로 감싼다.
    act(() => refundCallbacks.onSuccess?.(45000));

    expect(
      screen.queryByText('환불모달 full 501 45000'),
    ).not.toBeInTheDocument();
    expect(snackbarMock).toHaveBeenCalledWith('45,000원이 환불되었습니다.');
  });

  it('실패하면 서버 메시지를 그대로 보여준다', () => {
    mockList([participant]);
    render(<AdminLiveMentoringParticipantTable />);
    fireEvent.click(screen.getByRole('button', { name: '전체 환불' }));

    act(() => refundCallbacks.onError?.('이미 환불된 신청입니다.'));

    expect(snackbarMock).toHaveBeenCalledWith('이미 환불된 신청입니다.');
  });
});
