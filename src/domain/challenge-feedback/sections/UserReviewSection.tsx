import Image from 'next/image';
import { memo } from 'react';
import { USER_REVIEWS } from '../data/challenge-feedback-data';

const UserReviewSection = memo(function UserReviewSection() {
  return (
    <section className="flex w-full flex-col items-center justify-center bg-[#0f0d2e] py-12 md:py-16">
      <div className="mx-auto max-w-[1000px] px-6">
        <h2 className="mb-10 text-center text-xl font-bold text-[#B49AFF] md:mb-14 md:text-2xl">
          수강생의 피드백 솔직 후기
        </h2>

        {/* 2x2 그리드 배치 */}
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {USER_REVIEWS.map((review, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-lg shadow-lg"
            >
              <Image
                src={review.image}
                alt={review.alt}
                width={480}
                height={360}
                className="h-auto w-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default UserReviewSection;
