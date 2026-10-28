import {
  useCreateOneTimeFormApplicationMutation,
  useMyOneTimeFormApplicationQuery,
  useOneTimeFormQuery,
} from '@/api/one-time-form/oneTimeForm';
import { useUserQuery } from '@/api/user/user';
import useAuthStore from '@/store/useAuthStore';
import { ApiError } from '@letscareer/api/errors';
import { act, fireEvent, render, screen } from '@testing-library/react';
import {
  freeFormFixture,
  paidFormFixture,
} from '../__fixtures__/oneTimeFormFixtures';
import { readDraft, saveDraft } from '../utils/applicationDraft';
import { saveUtmOnce, utmStorageKey } from '../utils/utmStorage';
import OneTimeFormPage from './OneTimeFormPage';

jest.mock('@/api/one-time-form/oneTimeForm', () => ({
  ONE_TIME_FORM_NOT_FOUND: 'ONE_TIME_FORM_NOT_FOUND',
  ONE_TIME_FORM_ALREADY_APPLIED: 'ONE_TIME_FORM_ALREADY_APPLIED',
  // 실제 구현은 ApiError 의 code 를 읽는다. axios 를 끌어오지 않도록 code 만 본다
  getOneTimeFormErrorCode: (error: { code?: string } | null) => error?.code,
  useOneTimeFormQuery: jest.fn(),
  useMyOneTimeFormApplicationQuery: jest.fn(),
  useCreateOneTimeFormApplicationMutation: jest.fn(),
}));

jest.mock('@/api/user/user', () => ({
  useUserQuery: jest.fn(() => ({ data: undefined })),
}));

jest.mock('@/store/useAuthStore', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const push = jest.fn();
const replace = jest.fn();
const mutate = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push, replace }),
  usePathname: () => '/form/portfolio-1115',
  useSearchParams: () =>
    new URLSearchParams('utm_source=instagram&utm_medium=story'),
}));

const refetch = jest.fn();

const mockQuery = (result: {
  data?: unknown;
  isLoading: boolean;
  error?: unknown;
}) =>
  (useOneTimeFormQuery as jest.Mock).mockReturnValue({
    error: null,
    refetch,
    ...result,
  });

const mockMyApplication = (result: {
  data?: unknown;
  isLoading?: boolean;
  isError?: boolean;
}) =>
  (useMyOneTimeFormApplicationQuery as jest.Mock).mockReturnValue({
    isLoading: false,
    isError: false,
    refetch,
    ...result,
  });

const mockAuth = (state: { isLoggedIn: boolean; isInitialized: boolean }) =>
  (useAuthStore as unknown as jest.Mock).mockImplementation(
    (selector: (s: typeof state) => unknown) => selector(state),
  );

const MY_APPLICATION = {
  applicationId: 501,
  createDate: '2026-11-02T10:12:00',
  isCanceled: false,
  canceledAt: null,
  isCancelable: true,
  cancelDeadline: '2026-11-10T23:59:59',
  name: '김렛커',
  email: 'letscareer@example.com',
  phoneNum: '010-1234-5678',
  selectedOptions: [],
  payment: { paidAmount: 49000, refundAmount: 0, paymentMethod: '카드' },
  answerItems: [],
};

beforeEach(() => {
  jest.clearAllMocks();
  mockAuth({ isLoggedIn: true, isInitialized: true });
  mockMyApplication({ data: null });
  (useCreateOneTimeFormApplicationMutation as jest.Mock).mockReturnValue({
    mutate,
    isPending: false,
  });
});

describe('OneTimeFormPage', () => {
  it('유료 폼은 "신청서 작성 1/2"와 상품 카드, 다음 버튼을 그린다', () => {
    mockQuery({ data: paidFormFixture, isLoading: false });
    render(<OneTimeFormPage slug="portfolio-1115" />);

    expect(useOneTimeFormQuery).toHaveBeenCalledWith('portfolio-1115');
    expect(screen.getByText('신청서 작성')).toBeInTheDocument();
    expect(screen.getByText('1/2')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(
      screen.getByText('현직자와 함께하는 포트폴리오 집중 클래스'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '다음' })).toBeInTheDocument();
  });

  it('무료 폼은 단계 표시 없이 "사전 설문"과 제출하기 버튼을 그린다', () => {
    mockQuery({ data: freeFormFixture, isLoading: false });
    render(<OneTimeFormPage slug="seminar-1130" />);

    expect(
      screen.getByText('사전 설문', { selector: 'h1' }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/^\d\/\d$/)).not.toBeInTheDocument();
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '제출하기' }),
    ).toBeInTheDocument();
  });

  it('무료 폼 제목은 categoryText 를 따른다', () => {
    mockQuery({
      data: {
        ...freeFormFixture,
        form: { ...freeFormFixture.form, categoryText: '무료 특강 신청' },
      },
      isLoading: false,
    });
    render(<OneTimeFormPage slug="seminar-1130" />);

    expect(
      screen.getByText('무료 특강 신청', { selector: 'h1' }),
    ).toBeInTheDocument();
  });

  it('불러오는 동안 로딩 문구를 보여 준다', () => {
    mockQuery({ data: undefined, isLoading: true });
    render(<OneTimeFormPage slug="portfolio-1115" />);

    expect(screen.getByText('불러오는 중이에요')).toBeInTheDocument();
  });

  describe('옵션 선택', () => {
    const total = () => screen.getByText('선택한 금액').nextSibling;

    it('옵션 카드와 배지, 추가 금액, 기본 금액 합계를 그린다', () => {
      mockQuery({ data: paidFormFixture, isLoading: false });
      render(<OneTimeFormPage slug="portfolio-1115" />);

      expect(screen.getByText('참여 방식을 골라 주세요')).toBeInTheDocument();
      expect(screen.getByText('추천')).toBeInTheDocument();
      expect(screen.getByText('추가 금액 없음')).toBeInTheDocument();
      expect(screen.getByText('+10,000원')).toBeInTheDocument();
      expect(total()).toHaveTextContent('29,000원');
    });

    it('라디오는 바꿔 고르고 체크박스는 더하거나 빼며 합계가 따라 바뀐다', () => {
      mockQuery({ data: paidFormFixture, isLoading: false });
      render(<OneTimeFormPage slug="portfolio-1115" />);

      const online = screen.getByRole('radio', { name: /온라인 라이브/ });
      const offline = screen.getByRole('radio', { name: /오프라인 현장 참여/ });
      const feedback = screen.getByRole('checkbox', { name: /1:1 첨삭/ });

      fireEvent.click(offline);
      expect(offline).toBeChecked();
      expect(total()).toHaveTextContent('39,000원');

      fireEvent.click(online);
      expect(online).toBeChecked();
      expect(offline).not.toBeChecked();
      expect(total()).toHaveTextContent('29,000원');

      fireEvent.click(feedback);
      expect(feedback).toBeChecked();
      expect(total()).toHaveTextContent('49,000원');

      fireEvent.click(feedback);
      expect(feedback).not.toBeChecked();
      expect(total()).toHaveTextContent('29,000원');
    });

    it('무료 폼은 옵션과 합계를 그리지 않는다', () => {
      mockQuery({ data: freeFormFixture, isLoading: false });
      render(<OneTimeFormPage slug="seminar-1130" />);

      expect(screen.queryByRole('radio')).not.toBeInTheDocument();
      // 체크박스는 개인정보 동의 하나뿐이다
      expect(screen.getByRole('checkbox')).toHaveAccessibleName(
        /개인정보 수집 및 이용 동의/,
      );
      expect(screen.queryByText('선택한 금액')).not.toBeInTheDocument();
    });
  });

  describe('신청서 입력과 검증', () => {
    const USER = {
      name: '김렛커',
      email: 'login@example.com',
      contactEmail: 'letscareer@example.com',
      phoneNum: '01012345678',
    };

    beforeAll(() => {
      Element.prototype.scrollIntoView = jest.fn();
    });

    beforeEach(() => {
      (useUserQuery as jest.Mock).mockReturnValue({ data: USER });
    });

    it('필수 정보 3개를 계정 정보로 채운다', () => {
      mockQuery({ data: freeFormFixture, isLoading: false });
      render(<OneTimeFormPage slug="seminar-1130" />);

      expect(screen.getByLabelText(/이름/)).toHaveValue('김렛커');
      expect(screen.getByLabelText(/이메일/)).toHaveValue(
        'letscareer@example.com',
      );
      expect(screen.getByLabelText(/전화번호/)).toHaveValue('010-1234-5678');
    });

    it('필수 질문과 개인정보 동의를 채우기 전에는 제출하기가 막혀 있고, 채우면 U3 를 무료 형태로 부른다', () => {
      window.sessionStorage.clear();
      saveUtmOnce('seminar-1130', {
        utmSource: 'instagram',
        utmMedium: 'story',
        utmCampaign: null,
        utmContent: null,
        utmTerm: null,
        referrer: null,
      });
      mockQuery({ data: freeFormFixture, isLoading: false });
      render(<OneTimeFormPage slug="seminar-1130" />);

      const submit = screen.getByRole('button', { name: '제출하기' });
      expect(submit).toBeDisabled();

      fireEvent.change(screen.getByLabelText(/세미나에서 듣고 싶은 내용/), {
        target: { value: ' 포트폴리오 첨삭 사례가 궁금해요. ' },
      });
      expect(submit).toBeDisabled();

      fireEvent.click(
        screen.getByRole('checkbox', { name: /개인정보 수집 및 이용 동의/ }),
      );
      expect(submit).toBeEnabled();

      fireEvent.click(submit);
      expect(mutate).toHaveBeenCalledWith(
        {
          name: '김렛커',
          email: 'letscareer@example.com',
          phoneNum: '010-1234-5678',
          selectedOptionIds: [],
          answers: { '201': '포트폴리오 첨삭 사례가 궁금해요.' },
          utmSource: 'instagram',
          utmMedium: 'story',
          utmCampaign: null,
          utmContent: null,
          utmTerm: null,
          referrer: null,
          payment: null,
        },
        expect.anything(),
      );
    });

    describe('무료 폼 제출 결과', () => {
      const submitFreeForm = () => {
        mockQuery({ data: freeFormFixture, isLoading: false });
        render(<OneTimeFormPage slug="seminar-1130" />);
        fireEvent.change(screen.getByLabelText(/세미나에서 듣고 싶은 내용/), {
          target: { value: '포트폴리오 첨삭 사례가 궁금해요.' },
        });
        fireEvent.click(
          screen.getByRole('checkbox', { name: /개인정보 수집 및 이용 동의/ }),
        );
        fireEvent.click(screen.getByRole('button', { name: '제출하기' }));
        return mutate.mock.calls[0][1] as {
          onSuccess: () => void;
          onError: (error: unknown) => void;
        };
      };

      beforeEach(() => window.sessionStorage.clear());

      it('성공하면 보관한 UTM 을 지우고 완료 화면으로 replace 한다', () => {
        saveUtmOnce('seminar-1130', {
          utmSource: 'instagram',
          utmMedium: null,
          utmCampaign: null,
          utmContent: null,
          utmTerm: null,
          referrer: null,
        });
        const { onSuccess } = submitFreeForm();
        act(() => onSuccess());

        expect(
          window.sessionStorage.getItem(utmStorageKey('seminar-1130')),
        ).toBeNull();
        expect(replace).toHaveBeenCalledWith('/form/seminar-1130/complete');
      });

      it('이미 신청했다는 응답이면 완료 화면으로 보낸다', () => {
        const { onError } = submitFreeForm();
        act(() => onError({ code: 'ONE_TIME_FORM_ALREADY_APPLIED' }));

        expect(replace).toHaveBeenCalledWith('/form/seminar-1130/complete');
      });

      it('그 밖의 실패는 문구를 보여 주고 머문다', () => {
        const { onError } = submitFreeForm();
        act(() =>
          onError(
            new ApiError({
              status: 400,
              code: 'ONE_TIME_FORM_NOT_IN_PERIOD',
              message: 'Request failed with status code 400',
              endpoint: '/one-time-form/seminar-1130/applications',
              method: 'POST',
              serverMessage: '신청 기간이 아닙니다.',
            }),
          ),
        );

        expect(screen.getByRole('alert')).toHaveTextContent(
          '신청 기간이 아닙니다.',
        );
        expect(replace).not.toHaveBeenCalled();
      });

      it('요청 중에는 제출하기를 막아 두 번 보내지 않는다', () => {
        (useCreateOneTimeFormApplicationMutation as jest.Mock).mockReturnValue({
          mutate,
          isPending: true,
        });
        mockQuery({ data: freeFormFixture, isLoading: false });
        render(<OneTimeFormPage slug="seminar-1130" />);
        fireEvent.change(screen.getByLabelText(/세미나에서 듣고 싶은 내용/), {
          target: { value: '포트폴리오 첨삭 사례가 궁금해요.' },
        });
        fireEvent.click(
          screen.getByRole('checkbox', { name: /개인정보 수집 및 이용 동의/ }),
        );

        expect(screen.getByRole('button', { name: '제출하기' })).toBeDisabled();
      });
    });

    it('전화번호는 입력하는 대로 하이픈을 넣고, 칸을 벗어나면 오류를 보여 준다', () => {
      mockQuery({ data: freeFormFixture, isLoading: false });
      render(<OneTimeFormPage slug="seminar-1130" />);

      const phone = screen.getByLabelText(/전화번호/);
      fireEvent.change(phone, { target: { value: '0101234' } });
      expect(phone).toHaveValue('010-1234');
      expect(
        screen.queryByText('전화번호 형식을 확인해 주세요.'),
      ).not.toBeInTheDocument();

      fireEvent.blur(phone);
      expect(
        screen.getByText('전화번호 형식을 확인해 주세요.'),
      ).toBeInTheDocument();
    });

    it('유료 폼은 필수 옵션 그룹을 고르기 전까지 다음이 막혀 있다', () => {
      mockQuery({
        data: {
          ...paidFormFixture,
          questions: paidFormFixture.questions.filter(
            (q) => q.questionId === 101,
          ),
        },
        isLoading: false,
      });
      render(<OneTimeFormPage slug="portfolio-1115" />);

      const next = screen.getByRole('button', { name: '다음' });
      fireEvent.click(screen.getByRole('radio', { name: '프론트엔드' }));
      expect(next).toBeDisabled();

      fireEvent.click(screen.getByRole('radio', { name: /온라인 라이브/ }));
      expect(next).toBeEnabled();
    });

    it('형식 오류가 있으면 누를 때 첫 오류 칸으로 포커스하고 넘기지 않는다', () => {
      mockQuery({
        data: {
          ...paidFormFixture,
          questions: paidFormFixture.questions.filter((q) =>
            [101, 107].includes(q.questionId),
          ),
        },
        isLoading: false,
      });
      render(<OneTimeFormPage slug="portfolio-1115" />);

      fireEvent.click(screen.getByRole('radio', { name: /온라인 라이브/ }));
      fireEvent.click(screen.getByRole('radio', { name: '프론트엔드' }));
      fireEvent.change(screen.getByLabelText('포트폴리오 링크'), {
        target: { value: 'portfolio.example.com' },
      });
      const email = screen.getByLabelText(/이메일/);
      fireEvent.change(email, { target: { value: 'letscareer' } });

      fireEvent.click(screen.getByRole('button', { name: '다음' }));

      expect(push).not.toHaveBeenCalled();
      expect(
        screen.getByText('이메일 형식을 확인해 주세요.'),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'http:// 또는 https:// 로 시작하는 주소를 입력해 주세요.',
        ),
      ).toBeInTheDocument();
      expect(email).toHaveFocus();
      expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
    });

    describe('유료 폼 다음', () => {
      const paidWithOneQuestion = {
        ...paidFormFixture,
        questions: paidFormFixture.questions.filter(
          (q) => q.questionId === 101,
        ),
      };

      beforeEach(() => {
        window.sessionStorage.clear();
        push.mockClear();
      });

      it('입력값과 합계를 slug 별로 보관하고 결제 단계로 간다', () => {
        mockQuery({ data: paidWithOneQuestion, isLoading: false });
        render(<OneTimeFormPage slug="portfolio-1115" />);

        fireEvent.click(screen.getByRole('radio', { name: /온라인 라이브/ }));
        fireEvent.click(screen.getByRole('checkbox', { name: /1:1 첨삭/ }));
        fireEvent.click(screen.getByRole('radio', { name: '프론트엔드' }));
        fireEvent.click(screen.getByRole('button', { name: '다음' }));

        expect(readDraft('portfolio-1115')).toEqual({
          name: '김렛커',
          email: 'letscareer@example.com',
          phoneNum: '010-1234-5678',
          selectedOptionIds: [311, 321],
          answers: { '101': '프론트엔드' },
          orderId: null,
          amount: 49000,
        });
        expect(push).toHaveBeenCalledWith('/form/portfolio-1115/payment');
        expect(mutate).not.toHaveBeenCalled();
      });

      it('결제 단계에서 돌아오면 보관한 입력값으로 다시 채운다', () => {
        saveDraft('portfolio-1115', {
          name: '박서현',
          email: 'seohyun@example.com',
          phoneNum: '010-9876-5432',
          selectedOptionIds: [312],
          answers: { '101': '백엔드' },
          orderId: 'letsXk29Pq8812',
          amount: 39000,
        });
        mockQuery({ data: paidWithOneQuestion, isLoading: false });
        render(<OneTimeFormPage slug="portfolio-1115" />);

        expect(screen.getByLabelText(/이름/)).toHaveValue('박서현');
        expect(screen.getByLabelText(/전화번호/)).toHaveValue('010-9876-5432');
        expect(
          screen.getByRole('radio', { name: /오프라인 현장 참여/ }),
        ).toBeChecked();
        expect(screen.getByRole('radio', { name: '백엔드' })).toBeChecked();
        expect(screen.getByText('39,000원')).toBeInTheDocument();
      });
    });

    it('질문 10종을 형식에 맞는 입력으로 그린다', () => {
      mockQuery({ data: paidFormFixture, isLoading: false });
      render(<OneTimeFormPage slug="portfolio-1115" />);

      expect(screen.getByLabelText(/현재 상태/).tagName).toBe('SELECT');
      expect(screen.getByLabelText('졸업(예정)일')).toHaveAttribute(
        'type',
        'date',
      );
      expect(screen.getByLabelText('관련 경력')).toHaveAttribute(
        'type',
        'number',
      );
      expect(screen.getByLabelText(/신청 동기/).tagName).toBe('TEXTAREA');
      expect(screen.getByText('0/1000')).toBeInTheDocument();
      expect(
        screen.getByRole('group', { name: '참여 가능한 요일' }),
      ).toBeInTheDocument();
      expect(screen.getByLabelText('프로필 사진').tagName).toBe('BUTTON');
      expect(screen.getByLabelText(/이력서/).tagName).toBe('BUTTON');
    });
  });
});

describe('OneTimeFormPage 예외 화면', () => {
  const apiError = (code: string, status: number) => ({ code, status });

  it('U1 404 면 "신청 페이지를 찾을 수 없어요"와 홈 링크를 그린다', () => {
    mockQuery({
      data: undefined,
      isLoading: false,
      error: apiError('ONE_TIME_FORM_NOT_FOUND', 404),
    });
    render(<OneTimeFormPage slug="private-form" />);

    expect(
      screen.getByRole('heading', { name: '신청 페이지를 찾을 수 없어요' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: '렛츠커리어 홈으로' }),
    ).toHaveAttribute('href', '/');
  });

  it('그 밖의 U1 오류는 다시 시도 버튼으로 다시 부른다', () => {
    mockQuery({
      data: undefined,
      isLoading: false,
      error: apiError('INTERNAL_SERVER_ERROR', 500),
    });
    render(<OneTimeFormPage slug="portfolio-1115" />);

    expect(
      screen.getByRole('heading', { name: '신청 페이지를 불러오지 못했어요' }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '다시 시도' }));
    expect(refetch).toHaveBeenCalled();
  });

  it('시작 전이면 시작일과 신청 기간을 보여 주고 U2 를 부르지 않는다', () => {
    mockQuery({
      data: {
        ...paidFormFixture,
        form: { ...paidFormFixture.form, applyStatus: 'BEFORE' },
      },
      isLoading: false,
    });
    render(<OneTimeFormPage slug="portfolio-1115" />);

    expect(
      screen.getByRole('heading', { name: '11월 1일부터 신청할 수 있어요' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('신청 기간 2026.11.01 ~ 11.10'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('닫기', { selector: 'footer button' }),
    ).toBeInTheDocument();
    expect(useMyOneTimeFormApplicationQuery).toHaveBeenCalledWith(
      'portfolio-1115',
      { enabled: false },
    );
  });

  it('마감이면 "신청이 마감됐어요"를 그린다', () => {
    mockQuery({
      data: {
        ...paidFormFixture,
        form: { ...paidFormFixture.form, applyStatus: 'CLOSED' },
      },
      isLoading: false,
    });
    render(<OneTimeFormPage slug="portfolio-1115" />);

    expect(
      screen.getByRole('heading', { name: '신청이 마감됐어요' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('신청 기간 2026.11.01 ~ 11.10'),
    ).toBeInTheDocument();
  });

  it('비로그인이면 같은 경로와 쿼리로 돌아오는 로그인 링크를 그린다', () => {
    mockAuth({ isLoggedIn: false, isInitialized: true });
    mockQuery({ data: paidFormFixture, isLoading: false });
    render(<OneTimeFormPage slug="portfolio-1115" />);

    expect(
      screen.getByRole('heading', { name: /렛츠커리어 로그인 후/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('현직자와 함께하는 포트폴리오 집중 클래스'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: '로그인하고 계속하기' }),
    ).toHaveAttribute(
      'href',
      `/login?redirect=${encodeURIComponent(
        '/form/portfolio-1115?utm_source=instagram&utm_medium=story',
      )}`,
    );
    expect(useMyOneTimeFormApplicationQuery).toHaveBeenCalledWith(
      'portfolio-1115',
      { enabled: false },
    );
  });

  it('로그인 상태를 읽기 전에는 로그인 화면 대신 로딩을 보여 준다', () => {
    mockAuth({ isLoggedIn: false, isInitialized: false });
    mockQuery({ data: paidFormFixture, isLoading: false });
    render(<OneTimeFormPage slug="portfolio-1115" />);

    expect(screen.getByText('불러오는 중이에요')).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: '로그인하고 계속하기' }),
    ).not.toBeInTheDocument();
  });

  it('취소하지 않은 신청이 있으면 "이미 신청했어요"와 신청 확인 링크를 그린다', () => {
    mockQuery({ data: paidFormFixture, isLoading: false });
    mockMyApplication({ data: MY_APPLICATION });
    render(<OneTimeFormPage slug="portfolio-1115" />);

    expect(useMyOneTimeFormApplicationQuery).toHaveBeenCalledWith(
      'portfolio-1115',
      { enabled: true },
    );
    expect(
      screen.getByRole('heading', { name: '이미 신청했어요' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/2026\.11\.02 신청 · 49,000원 결제/),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '신청 확인하기' })).toHaveAttribute(
      'href',
      '/form/portfolio-1115/my',
    );
    expect(
      screen.queryByRole('button', { name: '다음' }),
    ).not.toBeInTheDocument();
  });

  it('무료 폼 신청이면 결제 금액 없이 신청일만 쓴다', () => {
    mockQuery({ data: freeFormFixture, isLoading: false });
    mockMyApplication({ data: { ...MY_APPLICATION, payment: null } });
    render(<OneTimeFormPage slug="seminar-1130" />);

    expect(screen.getByText(/2026\.11\.02 신청/)).toBeInTheDocument();
    expect(screen.queryByText(/원 결제/)).not.toBeInTheDocument();
  });

  it('신청이 없으면 입력 화면과 계정 표시를 그린다', () => {
    (useUserQuery as jest.Mock).mockReturnValue({
      data: {
        name: '김렛커',
        email: 'login@example.com',
        contactEmail: null,
        phoneNum: '01012345678',
      },
    });
    mockQuery({ data: paidFormFixture, isLoading: false });
    mockMyApplication({ data: null });
    render(<OneTimeFormPage slug="portfolio-1115" />);

    expect(screen.getByRole('button', { name: '다음' })).toBeInTheDocument();
    expect(screen.getByText('김렛커님 계정으로 신청')).toBeInTheDocument();
    expect(screen.getByText('login@example.com')).toBeInTheDocument();
    expect(screen.getByText('로그인됨')).toBeInTheDocument();
  });

  it('취소한 신청만 있으면 입력 화면을 그린다', () => {
    mockQuery({ data: paidFormFixture, isLoading: false });
    mockMyApplication({
      data: {
        ...MY_APPLICATION,
        isCanceled: true,
        canceledAt: '2026-11-03T09:00:00',
      },
    });
    render(<OneTimeFormPage slug="portfolio-1115" />);

    expect(screen.getByRole('button', { name: '다음' })).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: '이미 신청했어요' }),
    ).not.toBeInTheDocument();
  });

  it('U2 를 불러오는 동안 로딩을, 실패하면 다시 시도를 보여 준다', () => {
    mockQuery({ data: paidFormFixture, isLoading: false });
    mockMyApplication({ isLoading: true });
    const { rerender } = render(<OneTimeFormPage slug="portfolio-1115" />);
    expect(screen.getByText('불러오는 중이에요')).toBeInTheDocument();

    mockMyApplication({ isError: true });
    rerender(<OneTimeFormPage slug="portfolio-1115" />);
    fireEvent.click(screen.getByRole('button', { name: '다시 시도' }));
    expect(refetch).toHaveBeenCalled();
  });

  it('진입하면 URL 의 UTM 을 slug 별로 보관한다', () => {
    window.sessionStorage.clear();
    window.history.replaceState(
      null,
      '',
      '/form/portfolio-1115?utm_source=instagram&utm_campaign=1115',
    );
    mockQuery({ data: paidFormFixture, isLoading: false });
    render(<OneTimeFormPage slug="portfolio-1115" />);

    expect(
      JSON.parse(
        window.sessionStorage.getItem('one-time-form:portfolio-1115:utm')!,
      ),
    ).toMatchObject({
      utmSource: 'instagram',
      utmMedium: null,
      utmCampaign: '1115',
    });
  });
});
