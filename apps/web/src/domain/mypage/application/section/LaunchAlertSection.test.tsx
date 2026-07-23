import { MypageApplicationCardConfig } from '@/domain/mypage/application/utils/applicationCardConfig';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

const useGetMypageMagnetListQueryMock = jest.fn();
const deleteMutateAsyncMock = jest.fn();
const confirmMock = jest.fn();
const toastErrorMock = jest.fn();
const toastSuccessMock = jest.fn();

jest.mock('@/api/magnet/magnet', () => ({
  useGetMypageMagnetListQuery: (...args: unknown[]) =>
    useGetMypageMagnetListQueryMock(...args),
  useDeleteMagnetApplicationMutation: () => ({
    mutateAsync: deleteMutateAsyncMock,
  }),
}));

jest.mock('@letscareer/ui', () => ({
  useConfirm: () => confirmMock,
  useToast: () => ({ error: toastErrorMock, success: toastSuccessMock }),
}));

// 실제 카드 대신 config를 노출하는 stub — 매핑/액션만 검증한다.
jest.mock('../../ui/card/NewApplicationCard', () => ({
  MypageApplicationCard: ({
    config,
  }: {
    config: MypageApplicationCardConfig;
  }) => (
    <button
      data-testid="card"
      data-type-key={config.programTypeKey}
      data-status={config.statusLabel}
      data-category={config.categoryLabel}
      data-date-label={config.dateLabel}
      data-action-label={config.actionButton?.label}
      onClick={() => config.actionButton?.onClick?.()}
    >
      {config.title}
    </button>
  ),
}));
jest.mock('../../ui/button/MoreButton', () => ({
  __esModule: true,
  default: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick: () => void;
  }) => (
    <button data-testid="more" onClick={onClick}>
      {children}
    </button>
  ),
}));
jest.mock('./EmptySection', () => ({
  __esModule: true,
  default: ({ text }: { text: string }) => (
    <div data-testid="empty">{text}</div>
  ),
}));

// LaunchAlertSection 은 위 mock 이후 import 해야 한다.
const LaunchAlertSection = require('./LaunchAlertSection').default;

const makeMagnet = (magnetId: number, title: string) => ({
  magnetId,
  type: 'LAUNCH_ALERT' as const,
  title,
  description: '출시되면 알려드릴게요.',
  desktopThumbnail: '',
  mobileThumbnail: '',
  applicationCreateDate: '2026-07-01T09:30:00',
});

describe('LaunchAlertSection', () => {
  beforeEach(() => {
    useGetMypageMagnetListQueryMock.mockReset();
    deleteMutateAsyncMock.mockReset();
    confirmMock.mockReset();
    toastErrorMock.mockReset();
    toastSuccessMock.mockReset();
    deleteMutateAsyncMock.mockResolvedValue({});
  });

  it('typeList=[LAUNCH_ALERT] 로 마그넷 신청현황을 조회한다', () => {
    useGetMypageMagnetListQueryMock.mockReturnValue({
      data: { magnetList: [] },
      isLoading: false,
    });

    render(<LaunchAlertSection />);

    const callArg = useGetMypageMagnetListQueryMock.mock.calls[0][0];
    expect(callArg.typeList).toEqual(['LAUNCH_ALERT']);
  });

  it('신청 내역이 없으면 빈 상태를 렌더한다', () => {
    useGetMypageMagnetListQueryMock.mockReturnValue({
      data: { magnetList: [] },
      isLoading: false,
    });

    render(<LaunchAlertSection />);

    expect(screen.getByTestId('empty')).toHaveTextContent(
      '아직 신청한 출시알림이 없어요',
    );
  });

  it('카드는 신청취소 액션과 클릭 비활성용 programTypeKey 를 가진다', () => {
    useGetMypageMagnetListQueryMock.mockReturnValue({
      data: { magnetList: [makeMagnet(1, 'AI 특강')] },
      isLoading: false,
    });

    render(<LaunchAlertSection />);

    const card = screen.getByTestId('card');
    expect(card).toHaveAttribute('data-action-label', '신청취소');
    expect(card).toHaveAttribute('data-type-key', 'LAUNCH_ALERT');
    expect(card).toHaveAttribute('data-status', '신청완료');
    expect(card).toHaveAttribute('data-category', '출시알림');
    expect(card).toHaveAttribute('data-date-label', '신청일자');
  });

  it('10건 초과 시 더보기 버튼을 노출한다', () => {
    useGetMypageMagnetListQueryMock.mockReturnValue({
      data: {
        magnetList: Array.from({ length: 11 }, (_, i) =>
          makeMagnet(i + 1, `출시알림 ${i + 1}`),
        ),
      },
      isLoading: false,
    });

    render(<LaunchAlertSection />);

    expect(screen.getAllByTestId('card')).toHaveLength(10);
    expect(screen.getByTestId('more')).toBeInTheDocument();
  });

  it('신청취소 클릭 시 확인 후 취소 mutation 을 호출한다', async () => {
    confirmMock.mockResolvedValue(true);
    useGetMypageMagnetListQueryMock.mockReturnValue({
      data: { magnetList: [makeMagnet(42, 'AI 특강')] },
      isLoading: false,
    });

    render(<LaunchAlertSection />);
    fireEvent.click(screen.getByTestId('card'));

    await waitFor(() => {
      expect(confirmMock).toHaveBeenCalledWith(
        expect.objectContaining({
          title: '출시알림을 취소하시겠습니까?',
          confirmLabel: '취소하기',
          cancelLabel: '닫기',
        }),
      );
    });
    await waitFor(() => {
      expect(deleteMutateAsyncMock).toHaveBeenCalledWith(42);
    });
    await waitFor(() => {
      expect(toastSuccessMock).toHaveBeenCalledWith(
        '출시알림이 취소되었어요',
        expect.objectContaining({
          description: '언제든 다시 신청하실 수 있어요.',
        }),
      );
    });
  });

  it('취소 mutation 이 실패하면 에러 토스트를 띄운다', async () => {
    confirmMock.mockResolvedValue(true);
    deleteMutateAsyncMock.mockRejectedValue(new Error('network error'));
    useGetMypageMagnetListQueryMock.mockReturnValue({
      data: { magnetList: [makeMagnet(42, 'AI 특강')] },
      isLoading: false,
    });

    render(<LaunchAlertSection />);
    fireEvent.click(screen.getByTestId('card'));

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith(
        '출시알림 취소에 실패했어요',
        expect.objectContaining({
          description: '네트워크 상태를 확인하고 다시 시도해주세요.',
        }),
      );
    });
  });

  it('확인 모달에서 취소하면 mutation 을 호출하지 않는다', async () => {
    confirmMock.mockResolvedValue(false);
    useGetMypageMagnetListQueryMock.mockReturnValue({
      data: { magnetList: [makeMagnet(42, 'AI 특강')] },
      isLoading: false,
    });

    render(<LaunchAlertSection />);
    fireEvent.click(screen.getByTestId('card'));

    await waitFor(() => {
      expect(confirmMock).toHaveBeenCalled();
    });
    expect(deleteMutateAsyncMock).not.toHaveBeenCalled();
  });
});
