import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ResultsField from '../ResultsField';
import ReviewsVisibleField from '../ReviewsVisibleField';
import StrategyField from '../StrategyField';
import VideoField from '../VideoField';

const strategy = {
  visible: true,
  title: '전략',
  subtitle: '부제',
  points: [{ image: null, title: '포인트', description: '설명' }],
};

const video = {
  visible: true,
  title: '영상',
  subtitle: '부제',
  videoUrl: null,
  caption: '캡션',
};

const results = {
  visible: false,
  title: '결과',
  subtitle: '결과',
  cases: [],
};

describe('노출 토글이 있는 섹션', () => {
  it('취업 성공 전략 노출을 끄고, Point 를 추가·삭제한다', () => {
    const onChange = vi.fn();
    render(<StrategyField value={strategy} onChange={onChange} />);

    fireEvent.click(screen.getByLabelText('상세페이지에 표시'));
    expect(onChange.mock.lastCall?.[0].visible).toBe(false);

    fireEvent.click(screen.getByRole('button', { name: 'Point 추가 +' }));
    expect(onChange.mock.lastCall?.[0].points).toHaveLength(2);

    fireEvent.click(screen.getByRole('button', { name: '삭제' }));
    expect(onChange.mock.lastCall?.[0].points).toEqual([]);
  });

  it('소개 영상에 YouTube 가 아닌 주소를 넣으면 알린다', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <VideoField value={video} onChange={onChange} />,
    );
    fireEvent.change(screen.getByLabelText('YouTube 주소'), {
      target: { value: 'https://youtu.be/abc' },
    });
    expect(onChange.mock.lastCall?.[0].videoUrl).toBe('https://youtu.be/abc');

    rerender(
      <VideoField
        value={{ ...video, videoUrl: 'https://vimeo.com/1' }}
        onChange={onChange}
      />,
    );
    expect(
      screen.getByText('YouTube 주소만 넣을 수 있습니다.'),
    ).toBeInTheDocument();
  });

  it('결과 사례 노출을 켜고 사례를 추가한다', () => {
    const onChange = vi.fn();
    render(<ResultsField value={results} onChange={onChange} />);

    fireEvent.click(screen.getByLabelText('상세페이지에 표시'));
    expect(onChange.mock.lastCall?.[0].visible).toBe(true);

    fireEvent.click(screen.getByRole('button', { name: '사례 추가 +' }));
    expect(onChange.mock.lastCall?.[0].cases).toHaveLength(1);
  });

  it('후기 섹션 노출만 바꾸고 고른 후기는 그대로 둔다', () => {
    const onChange = vi.fn();
    render(
      <ReviewsVisibleField
        value={{ visible: true, selectedReviewIds: [1, 2] }}
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByLabelText('상세페이지에 후기 섹션 표시'));
    expect(onChange).toHaveBeenLastCalledWith({
      visible: false,
      selectedReviewIds: [1, 2],
    });
  });
});
