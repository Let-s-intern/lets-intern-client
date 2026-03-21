import Image from 'next/image';
import { memo } from 'react';
import { USER_REVIEWS } from '../data/challenge-feedback-data';

const UserReviewSection = memo(function UserReviewSection() {
  return (
    <section className="flex w-full flex-col items-center justify-center bg-[#0f0d2e] py-16 md:py-24">
      <div className="mx-auto max-w-[1000px] px-6">
        <p className="text-center text-sm font-semibold text-[#B49AFF] md:text-base">
          피드백 후기
        </p>
        <h2 className="mt-2 text-center text-xl font-bold text-white md:text-2xl">
          렛츠커리어 수강생의 솔직한 피드백 후기
        </h2>
        <p className="mb-10 mt-4 text-center text-base text-gray-300 md:mb-14 md:text-lg">
          이미 피드백을 경험한 수강생분들의 솔직한 후기를 확인해보세요!
        </p>

        {/* 2x2 그리드 배치 */}
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {USER_REVIEWS.map((review, i) => (
            <div key={i} className="overflow-hidden rounded-lg shadow-lg">
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
