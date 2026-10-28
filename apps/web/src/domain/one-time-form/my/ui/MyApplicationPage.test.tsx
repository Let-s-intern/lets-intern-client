import {
  useMyOneTimeFormApplicationQuery,
  useOneTimeFormQuery,
} from '@/api/one-time-form/oneTimeForm';
import useAuthStore from '@/store/useAuthStore';
import { ApiError } from '@letscareer/api/errors';
import { fireEvent, render, screen } from '@testing-library/react';
import { paidFormFixture } from '../../__fixtures__/oneTimeFormFixtures';
import MyApplicationPage from './MyApplicationPage';

jest.mock('@/api/one-time-form/oneTimeForm', () => ({
  ONE_TIME_FORM_NOT_FOUND: 'ONE_TIME_FORM_NOT_FOUND',
  getOneTimeFormErrorCode: (error: { code?: string } | null) => error?.code,
  useOneTimeFormQuery: jest.fn(),
  useMyOneTimeFormApplicationQuery: jest.fn(),
}));

jest.mock('@/store/useAuthStore', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}));

const refetch = jest.fn();

const mockAuth = (state: { isLoggedIn: boolean; isInitialized: boolean }) =>
  (useAuthStore as unknown as jest.Mock).mockImplementation(
    (selector: (s: typeof state) => unknown) => selector(state),
  );

const mockForm = (data: unknown, error: unknown = null) =>
  (useOneTimeFormQuery as jest.Mock).mockReturnValue({
    data,
    isLoading: false,
    isError: Boolean(error),
    error,
    refetch,
  });

const mockMyApplication = (data: unknown, error: unknown = null) =>
  (useMyOneTimeFormApplicationQuery as jest.Mock).mockReturnValue({
    data,
    isLoading: false,
    isError: Boolean(error),
    error,
    refetch,
  });

const NOT_FOUND = { code: 'ONE_TIME_FORM_NOT_FOUND' };

// 계약 U2 응답 예시 = 시드 신청 1042(유료, 취소 가능)
const APPLICATION_1042 = {
  applicationId: 1042,
  createDate: '2026-11-02T13:24:00',
  isCanceled: false,
  canceledAt: null,
  isCancelable: true,
  cancelDeadline: '2026-11-10T23:59:59',
  name: '김렛커',
  email: 'letscareer@example.com',
  phoneNum: '010-1234-5678',
  selectedOptions: [
    {
      optionGroupId: 31,
      groupTitle: '참여 방식을 골라 주세요',
      optionId: 311,
      optionName: '온라인 라이브',
      additionalPrice: 0,
    },
    {
      optionGroupId: 32,
      groupTitle: '함께 신청하면 좋아요',
      optionId: 321,
      optionName: '포트폴리오 1:1 첨삭',
      additionalPrice: 20000,
    },
  ],
  payment: { paidAmount: 49000, refundAmount: 0, paymentMethod: '카드' },
  answerItems: [
    {
      questionId: 101,
      type: 'RADIO',
      title: '희망 직무',
      isDeleted: false,
      value: '프론트엔드',
    },
    {
      questionId: 103,
      type: 'CHECKBOX',
      title: '참여 가능한 요일',
      isDeleted: false,
      value: ['월', '수'],
    },
    {
      questionId: 110,
      type: 'FILE',
      title: '이력서',
      isDeleted: false,
      value: {
        key: 'one-time-form/attachment/7/0b5c2f4e-9a61-4d1e-8f0a-3c2b7d9e1a44.pdf',
        name: '김렛커_이력서_최종.pdf',
      },
    },
  ],
};

// 시드 신청 1043(취소, 옵션 312 오프라인 10,000원)
const APPLICATION_1043 = {
  ...APPLICATION_1042,
  applicationId: 1043,
  name: '박서현',
  isCanceled: true,
  isCancelable: false,
  canceledAt: '2026-11-03T14:02:00',
  selectedOptions: [
    {
      optionGroupId: 31,
      groupTitle: '참여 방식을 골라 주세요',
      optionId: 312,
      optionName: '오프라인 현장 참여',
      additionalPrice: 10000,
    },
  ],
  payment: { paidAmount: 39000, refundAmount: 39000, paymentMethod: '카드' },
  answerItems: [
    {
      questionId: 100,
      type: 'SHORT_TEXT',
      title: '이전 질문',
      isDeleted: true,
      value: '삭제 전 답',
    },
  ],
};

const renderPage = () => render(<MyApplicationPage slug="portfolio-1115" />);

beforeEach(() => {
  jest.clearAllMocks();
  mockAuth({ isLoggedIn: true, isInitialized: true });
  mockForm(paidFormFixture);
});

describe('MyApplicationPage', () => {
  it('취소 가능: 신청 완료 배지, 결제·신청 내용, 마감 안내, 신청 취소 버튼', () => {
    mockMyApplication(APPLICATION_1042);
    renderPage();

    expect(screen.getByText('신청 확인')).toBeInTheDocument();
    expect(screen.getByText('신청 완료')).toBeInTheDocument();
    expect(
      screen.getByText('현직자와 함께하는 포트폴리오 집중 클래스'),
    ).toBeInTheDocument();
    expect(screen.getByText('letscareer@example.com')).toBeInTheDocument();
    expect(screen.getByText('2026.11.02 13:24')).toBeInTheDocument();
    // 기본 금액 = 49,000 - 0 - 20,000
    expect(screen.getByText('29,000원')).toBeInTheDocument();
    expect(screen.getByText('+20,000원')).toBeInTheDocument();
    expect(screen.getByText('49,000원')).toBeInTheDocument();
    expect(screen.getByText('카드')).toBeInTheDocument();
    expect(screen.queryByText('환불 금액')).not.toBeInTheDocument();
    expect(screen.getByText('월, 수')).toBeInTheDocument();
    expect(
      screen.getByText(/11\.10\(화\) 23:59까지 취소할 수 있어요/),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '신청 취소' }),
    ).toBeInTheDocument();
  });

  it('첨부 답은 파일명만 보이고 링크가 아니다', () => {
    mockMyApplication(APPLICATION_1042);
    renderPage();

    const fileName = screen.getByText('김렛커_이력서_최종.pdf');
    expect(fileName.closest('a')).toBeNull();
    expect(screen.queryByText(/one-time-form\/attachment/)).toBeNull();
  });

  it('마감 후: 안내만 보이고 신청 취소 버튼이 없다. 내용은 펼쳐서 본다', () => {
    mockMyApplication({ ...APPLICATION_1042, isCancelable: false });
    renderPage();

    expect(
      screen.getByText(/취소 기간\(11\.10까지\)이 지나 직접 취소할 수 없어요/),
    ).toBeInTheDocument();
    expect(screen.getByText('49,000원 결제')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: '신청 취소' }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('신청자 정보')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '신청 내용 보기' }));
    expect(screen.getByText('신청자 정보')).toBeInTheDocument();
    expect(screen.getByText('김렛커_이력서_최종.pdf')).toBeInTheDocument();
  });

  it('취소됨(신청 1043): 취소됨 배지, 취소 일시, 환불 금액, 삭제된 질문 표시', () => {
    mockMyApplication(APPLICATION_1043);
    renderPage();

    expect(screen.getByText('취소됨')).toBeInTheDocument();
    expect(screen.queryByText('신청 완료')).not.toBeInTheDocument();
    expect(
      screen.getByText(
        '2026.11.03 14:02에 취소했어요. 39,000원을 결제한 수단으로 돌려드려요.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('환불 금액')).toBeInTheDocument();
    // 기본 29,000 + 오프라인 10,000 = 결제 39,000 = 환불 39,000
    expect(screen.getByText('29,000원')).toBeInTheDocument();
    expect(screen.getAllByText('39,000원')).toHaveLength(2);
    expect(screen.getByText('(삭제된 질문)')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: '신청 취소' }),
    ).not.toBeInTheDocument();
  });

  it('신청 없음(null): 안내와 신청 페이지 링크', () => {
    mockMyApplication(null);
    renderPage();

    expect(screen.getByText('신청 내역이 없어요')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '신청하러 가기' })).toHaveAttribute(
      'href',
      '/form/portfolio-1115',
    );
  });

  it('결제 수단이 null 이면 줄을 숨긴다', () => {
    mockMyApplication({
      ...APPLICATION_1042,
      payment: { paidAmount: 0, refundAmount: 0, paymentMethod: null },
      selectedOptions: [],
    });
    renderPage();

    expect(screen.getByText('결제 정보')).toBeInTheDocument();
    expect(screen.queryByText('결제 수단')).not.toBeInTheDocument();
  });

  it('무료 폼(payment null)은 결제 정보를 그리지 않는다', () => {
    mockMyApplication({ ...APPLICATION_1042, payment: null });
    renderPage();

    expect(screen.queryByText('결제 정보')).not.toBeInTheDocument();
    expect(screen.getByText('신청자 정보')).toBeInTheDocument();
  });

  it('비로그인이면 로그인 안내, 로그인 후 /my 로 돌아온다', () => {
    mockAuth({ isLoggedIn: false, isInitialized: true });
    mockMyApplication(undefined);
    renderPage();

    expect(
      screen.getByRole('link', { name: '로그인하고 확인하기' }),
    ).toHaveAttribute(
      'href',
      `/login?redirect=${encodeURIComponent('/form/portfolio-1115/my')}`,
    );
  });

  it('로그인 상태여도 U2 가 403 이면 로그인 안내, 로그인 후 /my 로 돌아온다', () => {
    mockMyApplication(
      undefined,
      new ApiError({
        status: 403,
        code: 'API_ERROR',
        message: 'Request failed with status code 403',
        endpoint: '/one-time-form/portfolio-1115/my',
        method: 'GET',
      }),
    );
    renderPage();

    expect(
      screen.getByRole('link', { name: '로그인하고 확인하기' }),
    ).toHaveAttribute(
      'href',
      `/login?redirect=${encodeURIComponent('/form/portfolio-1115/my')}`,
    );
  });

  it('U1 404(비공개 폼)여도 U2 에 신청이 있으면 상품 카드 없이 그린다', () => {
    mockForm(undefined, NOT_FOUND);
    mockMyApplication(APPLICATION_1042);
    renderPage();

    expect(screen.getByText('신청 완료')).toBeInTheDocument();
    expect(
      screen.queryByText('현직자와 함께하는 포트폴리오 집중 클래스'),
    ).not.toBeInTheDocument();
    expect(screen.getByText('김렛커_이력서_최종.pdf')).toBeInTheDocument();
  });

  it('U1 404 이고 신청도 없으면 없는 페이지', () => {
    mockForm(undefined, NOT_FOUND);
    mockMyApplication(null);
    renderPage();

    expect(
      screen.getByText('신청 페이지를 찾을 수 없어요'),
    ).toBeInTheDocument();
  });

  it('U2 404 면 없는 페이지', () => {
    mockForm(undefined, NOT_FOUND);
    mockMyApplication(undefined, NOT_FOUND);
    renderPage();

    expect(
      screen.getByText('신청 페이지를 찾을 수 없어요'),
    ).toBeInTheDocument();
  });
});
