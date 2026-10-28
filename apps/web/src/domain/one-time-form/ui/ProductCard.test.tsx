import { render, screen } from '@testing-library/react';
import {
  freeFormFixture,
  paidFormFixture,
} from '../__fixtures__/oneTimeFormFixtures';
import ProductCard from './ProductCard';

describe('ProductCard', () => {
  it('썸네일이 있으면 img 를 그린다', () => {
    render(<ProductCard form={paidFormFixture.form} />);

    const img = screen.getByRole('img', {
      name: paidFormFixture.form.title,
    });
    expect(img).toHaveAttribute('src', paidFormFixture.form.thumbnailUrl);
    expect(img).toHaveClass('object-cover');
    expect(
      screen.queryByTestId('product-thumbnail-placeholder'),
    ).not.toBeInTheDocument();
  });

  it('썸네일이 null 이면 그라데이션 자리표시를 그린다', () => {
    render(<ProductCard form={freeFormFixture.form} />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByTestId('product-thumbnail-placeholder')).toHaveClass(
      'bg-gradient-start',
    );
  });

  it('유료 폼은 분류·제목·일정과 기본 금액을 보여 준다', () => {
    render(<ProductCard form={paidFormFixture.form} />);

    expect(screen.getByText('일회성 클래스')).toBeInTheDocument();
    expect(
      screen.getByText('현직자와 함께하는 포트폴리오 집중 클래스'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('11.15(토) 14:00 · 29,000원부터'),
    ).toBeInTheDocument();
  });

  it('무료 폼은 금액 없이 일정만 보여 준다', () => {
    render(<ProductCard form={freeFormFixture.form} />);

    expect(screen.getByText('11.30(일)까지')).toBeInTheDocument();
    expect(screen.queryByText(/원부터/)).not.toBeInTheDocument();
  });
});
