import { FaStar } from 'react-icons/fa';

import type { MentorReviewItem } from '@/api/mentor/mentorSchema';
import EmptyContainer from '@/common/container/EmptyContainer';
import dayjs from '@/lib/dayjs';

interface MentorReviewSectionProps {
  reviewList: MentorReviewItem[];
}

const ReviewStars = ({ score }: { score: number }) => {
  const filled = Math.min(5, Math.max(0, Math.round(score)));
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, index) => (
        <span
          key={index}
          className={index < filled ? 'text-primary' : 'text-neutral-70'}
        >
          <FaStar />
        </span>
      ))}
    </div>
  );
};

const ReviewCard = ({ review }: { review: MentorReviewItem }) => (
  <li className="border-neutral-80 flex flex-col gap-2 rounded-md border px-6 py-5">
    <div className="flex items-center justify-between gap-2">
      <ReviewStars score={review.score} />
      <span className="text-xxsmall12 md:text-xsmall14 text-neutral-45">
        {dayjs(review.createDate).format('YYYY.MM.DD')}
      </span>
    </div>
    {review.programTitle && (
      <span className="text-xsmall14 md:text-xsmall16 text-neutral-30 font-medium">
        {review.programTitle}
      </span>
    )}
    {review.review && (
      <p className="text-xsmall14 md:text-xsmall16 text-neutral-10 whitespace-pre-line">
        {review.review}
      </p>
    )}
  </li>
);

const MentorReviewSection = ({ reviewList }: MentorReviewSectionProps) => {
  return (
    <section
      id="mentor-reviews"
      className="flex w-full scroll-mt-[84px] flex-col gap-6 md:scroll-mt-[115px]"
    >
      <div className="flex items-baseline justify-between">
        <h2 className="text-medium22 text-neutral-0 font-bold">후기</h2>
        <span className="text-xsmall16 text-neutral-45">
          {reviewList.length}개의 후기
        </span>
      </div>

      {reviewList.length > 0 ? (
        <ul className="flex flex-col gap-4">
          {reviewList.map((review, index) => (
            <ReviewCard key={index} review={review} />
          ))}
        </ul>
      ) : (
        <EmptyContainer text="등록된 후기가 없습니다." />
      )}
    </section>
  );
};

export default MentorReviewSection;
