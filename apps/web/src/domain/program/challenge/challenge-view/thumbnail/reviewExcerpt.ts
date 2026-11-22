import { LandingReview } from '@/api/program-category/programCategory';

/** 첫 글자만 남긴다. 김철수 → 김** */
export const maskName = (name?: string | null) =>
  name
    ? `${name.slice(0, 1)}${'*'.repeat(Math.max(name.length - 1, 2))}`
    : '수강생';

/** 좋았던 점 → 목표 달성 → 아무 답변 순으로 고른다. 없으면 빈 문자열 */
export const pickReviewExcerpt = (items: LandingReview['itemList']) => {
  const by = (type: string) =>
    items.find((i) => i.questionType === type && i.answer?.trim())?.answer;
  return (
    by('GOOD_POINT') ??
    by('GOAL_RESULT') ??
    items.find((i) => i.answer?.trim())?.answer ??
    ''
  ).trim();
};
