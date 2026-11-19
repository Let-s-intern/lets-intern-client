import { maskName, pickReviewExcerpt } from './reviewExcerpt';

describe('상단 후기 카드', () => {
  it('이름은 첫 글자만 남기고, 없으면 수강생', () => {
    expect(maskName('김철수')).toBe('김**');
    expect(maskName('이준')).toBe('이**');
    expect(maskName('남궁민수')).toBe('남***');
    expect(maskName(null)).toBe('수강생');
  });

  it('좋았던 점 → 목표 달성 → 아무 답변 순으로 고른다', () => {
    expect(
      pickReviewExcerpt([
        { questionType: 'GOAL_RESULT', answer: '목표' },
        { questionType: 'GOOD_POINT', answer: ' 좋았어요 ' },
      ]),
    ).toBe('좋았어요');
    expect(
      pickReviewExcerpt([
        { questionType: 'GOOD_POINT', answer: '  ' },
        { questionType: 'WORRY', answer: '걱정' },
        { questionType: 'GOAL_RESULT', answer: '목표' },
      ]),
    ).toBe('목표');
    expect(pickReviewExcerpt([{ questionType: 'WORRY', answer: '걱정' }])).toBe(
      '걱정',
    );
    expect(pickReviewExcerpt([{ questionType: null, answer: null }])).toBe('');
  });
});
