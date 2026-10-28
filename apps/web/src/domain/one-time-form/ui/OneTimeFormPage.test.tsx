import { useOneTimeFormQuery } from '@/api/one-time-form/oneTimeForm';
import { useUserQuery } from '@/api/user/user';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  freeFormFixture,
  paidFormFixture,
} from '../__fixtures__/oneTimeFormFixtures';
import OneTimeFormPage from './OneTimeFormPage';

jest.mock('@/api/one-time-form/oneTimeForm', () => ({
  useOneTimeFormQuery: jest.fn(),
}));

jest.mock('@/api/user/user', () => ({
  useUserQuery: jest.fn(() => ({ data: undefined })),
}));

const mockQuery = (result: { data?: unknown; isLoading: boolean }) =>
  (useOneTimeFormQuery as jest.Mock).mockReturnValue(result);

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
      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
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

    it('필수 질문을 채우기 전에는 제출하기가 막혀 있고, 채우면 요청 값을 넘긴다', () => {
      const onValidSubmit = jest.fn();
      mockQuery({ data: freeFormFixture, isLoading: false });
      render(
        <OneTimeFormPage slug="seminar-1130" onValidSubmit={onValidSubmit} />,
      );

      const submit = screen.getByRole('button', { name: '제출하기' });
      expect(submit).toBeDisabled();

      fireEvent.change(screen.getByLabelText(/세미나에서 듣고 싶은 내용/), {
        target: { value: ' 포트폴리오 첨삭 사례가 궁금해요. ' },
      });
      expect(submit).toBeEnabled();

      fireEvent.click(submit);
      expect(onValidSubmit).toHaveBeenCalledWith({
        name: '김렛커',
        email: 'letscareer@example.com',
        phoneNum: '010-1234-5678',
        selectedOptionIds: [],
        answers: { '201': '포트폴리오 첨삭 사례가 궁금해요.' },
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
      const onValidSubmit = jest.fn();
      mockQuery({
        data: {
          ...paidFormFixture,
          questions: paidFormFixture.questions.filter((q) =>
            [101, 107].includes(q.questionId),
          ),
        },
        isLoading: false,
      });
      render(
        <OneTimeFormPage slug="portfolio-1115" onValidSubmit={onValidSubmit} />,
      );

      fireEvent.click(screen.getByRole('radio', { name: /온라인 라이브/ }));
      fireEvent.click(screen.getByRole('radio', { name: '프론트엔드' }));
      fireEvent.change(screen.getByLabelText('포트폴리오 링크'), {
        target: { value: 'portfolio.example.com' },
      });
      const email = screen.getByLabelText(/이메일/);
      fireEvent.change(email, { target: { value: 'letscareer' } });

      fireEvent.click(screen.getByRole('button', { name: '다음' }));

      expect(onValidSubmit).not.toHaveBeenCalled();
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
      expect(screen.getByText('이미지를 첨부해 주세요')).toBeInTheDocument();
      expect(screen.getByText('파일을 첨부해 주세요')).toBeInTheDocument();
    });
  });
});
