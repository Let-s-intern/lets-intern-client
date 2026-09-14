import { ApiError } from '@letscareer/api/errors';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { PlanUpgrade } from './api/planUpgradeSchema';

const pushMock = jest.fn();
let searchParams = new URLSearchParams();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, back: jest.fn() }),
  useSearchParams: () => searchParams,
}));

const authState = { isInitialized: true, isLoggedIn: true };
jest.mock('@/store/useAuthStore', () => ({
  __esModule: true,
  default: (selector: (state: typeof authState) => unknown) =>
    selector(authState),
}));

// 패키지 entry(@letscareer/api) 는 import.meta 때문에 jest 에서 로드되지 않는다.
// instanceof 가 실제 클래스를 보도록 errors 서브경로의 ApiError 를 내보낸다.
jest.mock('@letscareer/api', () => ({
  ApiError: jest.requireActual('@letscareer/api/errors').ApiError,
}));

const usePlanUpgradeQueryMock = jest.fn();
jest.mock('./api/planUpgrade', () => ({
  usePlanUpgradeQuery: (...args: unknown[]) => usePlanUpgradeQueryMock(...args),
}));

import PlanUpgradeContent from './PlanUpgradeContent';

const planUpgrade: PlanUpgrade = {
  applicationId: 7,
  programId: 3,
  challengeTitle: '대기업 자기소개서 완성 챌린지 12기',
  currentPlan: {
    planType: 'BASIC',
    description: '학습 콘텐츠, 미션 템플릿',
    salePrice: 84000,
    paidAmount: 74000,
  },
  deadline: '2026-10-01T23:59:00',
  unavailableReason: null,
  options: [
    {
      planType: 'STANDARD',
      title: '스탠다드',
      description: '학습 콘텐츠, 미션 템플릿, 피드백 2회',
      salePrice: 168000,
      additionalAmount: 84000,
      feedbackMissions: [
        {
          missionId: 11,
          th: 3,
          title: '경험분석',
          feedbackType: 'WRITTEN_FEEDBACK',
        },
        {
          missionId: 12,
          th: 4,
          title: '직무 역량',
          feedbackType: 'WRITTEN_FEEDBACK',
        },
      ],
    },
    {
      planType: 'PREMIUM',
      title: '프리미엄',
      description: '학습 콘텐츠, 미션 템플릿, 피드백 4회',
      salePrice: 250000,
      additionalAmount: 166000,
      feedbackMissions: [
        {
          missionId: 11,
          th: 3,
          title: '경험분석',
          feedbackType: 'WRITTEN_FEEDBACK',
        },
        {
          missionId: 12,
          th: 4,
          title: '직무 역량',
          feedbackType: 'WRITTEN_FEEDBACK',
        },
        {
          missionId: 13,
          th: 5,
          title: '지원동기',
          feedbackType: 'WRITTEN_FEEDBACK',
        },
        {
          missionId: 14,
          th: 6,
          title: '자기소개서 완성',
          feedbackType: 'LIVE_FEEDBACK',
        },
      ],
    },
  ],
};

const queryResult = (overrides: Record<string, unknown> = {}) => ({
  data: undefined,
  isLoading: false,
  error: null,
  refetch: jest.fn(),
  ...overrides,
});

const renderContent = () => render(<PlanUpgradeContent applicationId="7" />);

describe('PlanUpgradeContent', () => {
  beforeEach(() => {
    authState.isInitialized = true;
    authState.isLoggedIn = true;
    searchParams = new URLSearchParams();
    pushMock.mockReset();
    usePlanUpgradeQueryMock.mockReset();
    usePlanUpgradeQueryMock.mockReturnValue(queryResult({ data: planUpgrade }));
  });

  describe('로그인', () => {
    it('로그인 확인 전에는 로딩만 보이고 조회하지 않는다', () => {
      authState.isInitialized = false;
      authState.isLoggedIn = false;

      renderContent();

      expect(screen.getByText('로딩 중...')).toBeInTheDocument();
      expect(usePlanUpgradeQueryMock).not.toHaveBeenCalled();
      expect(pushMock).not.toHaveBeenCalled();
    });

    it('비로그인이면 지금 주소로 돌아오게 로그인으로 보낸다', () => {
      authState.isLoggedIn = false;
      window.history.pushState({}, '', '/plan-upgrade/7?plan=PREMIUM');

      renderContent();

      expect(pushMock).toHaveBeenCalledWith(
        `/login?redirect=${encodeURIComponent('/plan-upgrade/7?plan=PREMIUM')}`,
      );
      expect(usePlanUpgradeQueryMock).not.toHaveBeenCalled();
    });
  });

  describe('조회 상태', () => {
    it('조회 중에는 헤더와 로딩을 보여준다', () => {
      usePlanUpgradeQueryMock.mockReturnValue(queryResult({ isLoading: true }));

      renderContent();

      expect(usePlanUpgradeQueryMock).toHaveBeenCalledWith('7');
      expect(screen.getByText('플랜 업그레이드 하기')).toBeInTheDocument();
      expect(screen.getByText('로딩 중...')).toBeInTheDocument();
    });

    it('조회에 실패하면 다시 시도로 refetch 한다', async () => {
      const refetch = jest.fn();
      usePlanUpgradeQueryMock.mockReturnValue(
        queryResult({ error: new Error('Network Error'), refetch }),
      );

      renderContent();
      expect(screen.getByText('정보를 불러오지 못했어요')).toBeInTheDocument();

      await userEvent.click(screen.getByRole('button', { name: '다시 시도' }));

      expect(refetch).toHaveBeenCalledTimes(1);
    });

    it.each([403, 404])(
      '%i 이면 신청을 찾을 수 없다고 안내하고 마이페이지로 보낸다',
      (status) => {
        usePlanUpgradeQueryMock.mockReturnValue(
          queryResult({
            error: new ApiError({
              code: 'API_ERROR',
              message: '권한이 없습니다.',
              status,
              endpoint: '/plan-upgrade/7',
              method: 'GET',
            }),
          }),
        );

        renderContent();

        expect(
          screen.getByText('신청 정보를 찾을 수 없어요'),
        ).toBeInTheDocument();
        expect(
          screen.getByRole('link', { name: '마이페이지로' }),
        ).toHaveAttribute('href', '/mypage/application');
        expect(
          screen.queryByRole('button', { name: '다시 시도' }),
        ).not.toBeInTheDocument();
      },
    );
  });

  it('불가 사유가 있으면 선택지·혜택·금액 대신 안내와 마이페이지 버튼을 둔다', async () => {
    usePlanUpgradeQueryMock.mockReturnValue(
      queryResult({
        data: {
          ...planUpgrade,
          unavailableReason: 'DEADLINE_PASSED',
          options: [],
        },
      }),
    );

    renderContent();

    expect(
      screen.getByText('대기업 자기소개서 완성 챌린지 12기'),
    ).toBeInTheDocument();
    expect(screen.getByText('BASIC')).toBeInTheDocument();
    expect(screen.getByText('74,000원 결제')).toBeInTheDocument();
    expect(
      screen.getByText('업그레이드 가능 기간이 지났어요 (10월 1일 23:59까지)'),
    ).toBeInTheDocument();
    expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument();
    expect(
      screen.queryByText('BASIC에서 추가되는 혜택'),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('추가 결제 금액')).not.toBeInTheDocument();

    await userEvent.click(
      screen.getByRole('button', { name: '마이페이지로 이동' }),
    );

    expect(pushMock).toHaveBeenCalledWith('/mypage/application');
  });

  describe('플랜 선택', () => {
    it('첫 선택은 바로 위 플랜이고 바꾸면 금액·혜택·버튼 문구가 따라 바뀐다', async () => {
      const user = userEvent.setup();
      renderContent();

      expect(screen.getByRole('radio', { name: /STANDARD/ })).toBeChecked();
      expect(screen.getByText('84,000원')).toBeInTheDocument();
      expect(screen.getByText('피드백 2회')).toBeInTheDocument();
      expect(
        screen.getByText('10월 1일 23:59까지 업그레이드할 수 있어요'),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: '84,000원에 업그레이드 하기' }),
      ).toBeInTheDocument();

      await user.click(screen.getByRole('radio', { name: /PREMIUM/ }));

      expect(screen.getByRole('radio', { name: /PREMIUM/ })).toBeChecked();
      expect(screen.getByText('166,000원')).toBeInTheDocument();
      expect(screen.queryByText('84,000원')).not.toBeInTheDocument();
      expect(screen.getByText('피드백 4회')).toBeInTheDocument();
      expect(screen.queryByText('피드백 2회')).not.toBeInTheDocument();
      expect(
        screen.getByText('6회차 미션 자기소개서 완성 Live 멘토링'),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: '166,000원에 업그레이드 하기' }),
      ).toBeInTheDocument();

      await user.click(
        screen.getByRole('button', { name: '결제 금액 상세 보기' }),
      );

      expect(
        screen.getByText('PREMIUM 플랜 금액').nextSibling,
      ).toHaveTextContent('250,000원');
      expect(
        screen.getByText('현재 BASIC 플랜 금액').nextSibling,
      ).toHaveTextContent('-84,000원');
    });

    it('plan 쿼리가 유효하면 그 플랜을 선택해 연다', () => {
      searchParams = new URLSearchParams('plan=PREMIUM');

      renderContent();

      expect(screen.getByRole('radio', { name: /PREMIUM/ })).toBeChecked();
      expect(
        screen.getByRole('button', { name: '166,000원에 업그레이드 하기' }),
      ).toBeInTheDocument();
    });

    it('버튼을 누르면 다시 바꾸기 어렵다는 알럿을 띄우고, 취소하면 이동하지 않는다', async () => {
      renderContent();

      await userEvent.click(
        screen.getByRole('button', { name: '84,000원에 업그레이드 하기' }),
      );

      expect(screen.getByText('플랜을 업그레이드할까요?')).toBeInTheDocument();
      expect(
        screen.getByText(/STANDARD 플랜으로 결제하면 다시 변경하기 어려워요/),
      ).toBeInTheDocument();

      await userEvent.click(screen.getByRole('button', { name: '취소' }));
      expect(screen.queryByText('플랜을 업그레이드할까요?')).toBeNull();
      expect(pushMock).not.toHaveBeenCalled();
    });

    it('알럿에서 결제하러 가기를 누르면 고른 플랜으로 결제 단계에 가고 이동 중에는 비활성이다', async () => {
      renderContent();
      const button = screen.getByRole('button', {
        name: '84,000원에 업그레이드 하기',
      });

      await userEvent.click(button);
      await userEvent.click(
        screen.getByRole('button', { name: '결제하러 가기' }),
      );

      expect(pushMock).toHaveBeenCalledWith(
        '/plan-upgrade/7/payment?plan=STANDARD',
      );
      expect(button).toBeDisabled();
    });
  });
});
