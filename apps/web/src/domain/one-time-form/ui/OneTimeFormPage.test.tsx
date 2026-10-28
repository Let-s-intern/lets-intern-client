import { useOneTimeFormQuery } from '@/api/one-time-form/oneTimeForm';
import { render, screen } from '@testing-library/react';
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
});
