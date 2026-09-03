/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen } from '@testing-library/react';

import StarRating from './StarRating';

describe('StarRating', () => {
  it('value 만큼 채워진 별을 그린다', () => {
    render(<StarRating value={3} onChange={jest.fn()} />);

    const stars = [1, 2, 3, 4, 5].map((n) => screen.getByAltText(`별 ${n}개`));
    expect(stars[0]).toHaveAttribute('src', '/icons/star-yellow.svg');
    expect(stars[2]).toHaveAttribute('src', '/icons/star-yellow.svg');
    expect(stars[3]).toHaveAttribute('src', '/icons/star-unfill.svg');
  });

  it('별을 클릭하면 onChange 에 그 값을 전달한다', () => {
    const onChange = jest.fn();
    render(<StarRating value={0} onChange={onChange} />);

    fireEvent.click(screen.getByAltText('별 4개'));

    expect(onChange).toHaveBeenCalledWith(4);
  });

  it('hover 하면 그 지점까지 미리 채워 보여준다', () => {
    render(<StarRating value={1} onChange={jest.fn()} />);

    fireEvent.mouseEnter(screen.getByAltText('별 5개'));
    expect(screen.getByAltText('별 5개')).toHaveAttribute(
      'src',
      '/icons/star-yellow.svg',
    );

    fireEvent.mouseLeave(screen.getByAltText('별 5개'));
    expect(screen.getByAltText('별 5개')).toHaveAttribute(
      'src',
      '/icons/star-unfill.svg',
    );
    // hover 를 떠나면 원래 value(1) 만큼만 남는다.
    expect(screen.getByAltText('별 1개')).toHaveAttribute(
      'src',
      '/icons/star-yellow.svg',
    );
  });
});
