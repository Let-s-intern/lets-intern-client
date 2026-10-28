import { useOneTimeFormQuery } from '@/api/one-time-form/oneTimeForm';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  freeFormFixture,
  paidFormFixture,
} from '../__fixtures__/oneTimeFormFixtures';
import OneTimeFormPage from './OneTimeFormPage';

jest.mock('@/api/one-time-form/oneTimeForm', () => ({
  useOneTimeFormQuery: jest.fn(),
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
    expect(screen.queryByText(/\d\/\d/)).not.toBeInTheDocument();
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
});
