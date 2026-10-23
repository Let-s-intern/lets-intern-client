import { fireEvent, render, screen } from '@testing-library/react';

import type { MentorReviewItem } from '@/api/mentor/mentorSchema';

import MentorReviewSection from './MentorReviewSection';

// 서버 순서(추천순)는 평점·날짜 순서와 일부러 다르게 둔다
const REVIEWS: MentorReviewItem[] = [
  { score: 3, programTitle: null, review: '추천 1', createDate: '2026-06-01' },
  { score: 5, programTitle: null, review: '추천 2', createDate: '2026-06-02' },
  { score: 4, programTitle: null, review: '추천 3', createDate: '2026-06-03' },
];

const shownReviews = () =>
  screen.getAllByText(/^추천 \d$/).map((node) => node.textContent);

describe('MentorReviewSection 정렬 (LC-3502)', () => {
  it('기본은 서버가 준 순서 그대로인 추천순이다', () => {
    render(
      <MentorReviewSection
        reviewList={REVIEWS}
        reviewCount={3}
        averageScore={4}
      />,
    );
    expect(shownReviews()).toEqual(['추천 1', '추천 2', '추천 3']);
  });

  it('높은 평점순·최신순으로 바꿀 수 있다', () => {
    render(
      <MentorReviewSection
        reviewList={REVIEWS}
        reviewCount={3}
        averageScore={4}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /추천순/ }));
    fireEvent.click(screen.getAllByRole('button', { name: '높은 평점순' })[0]);
    expect(shownReviews()).toEqual(['추천 2', '추천 3', '추천 1']);

    fireEvent.click(screen.getByRole('button', { name: /높은 평점순/ }));
    fireEvent.click(screen.getAllByRole('button', { name: '최신순' })[0]);
    expect(shownReviews()).toEqual(['추천 3', '추천 2', '추천 1']);
  });
});
