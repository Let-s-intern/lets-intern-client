import { memo } from 'react';
import ReviewCard from '../components/ReviewCard';
import { USER_REVIEWS } from '../data/challenge-feedback-data';

const ROTATIONS = ['-rotate-3', 'rotate-2', '-rotate-1', 'rotate-3'];

const UserReviewSection = memo(function UserReviewSection() {
  return (
    <section className="w-full bg-[#0f0d2e] py-20">
      <div className="mx-auto max-w-[1200px] px-6">
        <h2 className="mb-10 text-center text-xl font-bold text-[#B49AFF] md:text-2xl">
          수강생의 피드백 솔직 후기
        </h2>

        <div className="relative flex justify-center gap-4 overflow-hidden pb-4 md:gap-6">
          {USER_REVIEWS.map((review, i) => (
            <ReviewCard
              key={i}
              review={review}
              className={`${ROTATIONS[i % ROTATIONS.length]} ${
                i >= 2 ? 'blur-[2px] opacity-60' : ''
              } transition-all`}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

export default UserReviewSection;
