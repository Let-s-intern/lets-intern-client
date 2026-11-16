import type { SeminarReview } from '../data/reviews';

/**
 * S9 후기 카드 — 흰 배경 카드에 수강생 후기 전문을 노출한다.
 * 캐러셀 슬라이드로 쓰이며 고정 폭·스크롤 스냅은 부모(ReviewSection)가 지정한다.
 */
const ReviewCard = ({ review }: { review: SeminarReview }) => (
  <article className="flex h-full snap-center flex-col justify-center rounded-xl bg-white p-7 shadow-02 md:p-8">
    <p className="whitespace-pre-line break-keep text-xsmall14 leading-relaxed text-neutral-30 md:text-xsmall16">
      {review.content}
    </p>
  </article>
);

export default ReviewCard;
