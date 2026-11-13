'use client';

import { BlogType, blogListQueryOptions } from '@/api/blog/blog';
import {
  GetReview,
  ReviewType,
  reviewTypeSchema,
  useGetProgramReview,
  useGetReviewCount,
} from '@/api/review/review';
import Button from '@/common/button/Button';
import { YYYY_MM_DD } from '@/data/dayjsFormat';
import dayjs from '@/lib/dayjs';
import { questionTypeToText } from '@/utils/convert';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const { MISSION_REVIEW } = reviewTypeSchema.enum;

const ReviewSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const { data: reviewCount } = useGetReviewCount();
  const { data: blogData } = useSuspenseQuery(
    blogListQueryOptions({
      pageable: { page: 1, size: 0 },
      types: [BlogType.PROGRAM_REVIEWS],
    }),
  );

  const { data: totalReview, isLoading: totalReviewIsLoading } =
    useGetProgramReview({
      size: 20,
      page: 1,
      types: Object.keys(
        reviewTypeSchema.exclude([MISSION_REVIEW]).enum,
      ) as ReviewType[], // MISSION_REVIEW(미션 리뷰)는 reviewItemList 없음
    });

  const reviewsCount =
    (reviewCount?.count ?? 0) + (blogData?.pageInfo.totalElements ?? 0);

  const reviewList = totalReview?.reviewList.filter(
    (r) => r.reviewItemList && r.reviewItemList?.length > 0,
  );

  useEffect(() => {
    if (totalReviewIsLoading) return;

    const current = sectionRef.current;
    if (!current) return;
    if (reviewsCount === 0) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }, // 화면에 50% 이상 보이면 트리거
    );

    observer.observe(current);

    return () => {
      observer.unobserve(current);
    };
  }, [reviewsCount, totalReviewIsLoading]);

  if (totalReviewIsLoading || !totalReview || (reviewList?.length ?? 0) < 5) {
    return null;
  }

  return (
    <>
      <section
        ref={sectionRef}
        className="mt-16 flex w-full max-w-[1120px] flex-col gap-6 px-5 md:mt-28 md:flex-row md:items-center md:gap-10 xl:px-0"
      >
        <div className="flex flex-col md:w-[40%]">
          <div className="text-small20 text-neutral-0 md:text-xlarge28 font-bold md:mt-2">
            <span className="text-primary">
              렛츠커리어 챌린지는 지금도 진행 중!
            </span>
            <div className="flex h-7 overflow-hidden break-keep md:h-[2.375rem]">
              <div
                className={`transition-transform delay-500 duration-1000 ease-out ${
                  isVisible ? '-translate-y-full' : 'translate-y-0'
                }`}
              >
                <div>{reviewsCount - 1}</div>
                <div>{reviewsCount}</div>
              </div>
              <span>개의 후기가 실시간으로</span>
            </div>
            <span> 공유되고 있어요.</span>
          </div>
          <Button
            className="review_cta rounded-xs text-xsmall14 md:text-small18 shadow-03 mt-4 w-fit px-3 py-2.5 font-semibold md:mt-8 md:rounded-sm md:px-4 md:py-3"
            to="/review"
          >
            수강생들의 생생 후기 더 보기
          </Button>
        </div>
        <div className="border-primary-15 bg-primary-5 relative h-72 w-full items-center overflow-hidden rounded-md border md:h-[336px] md:flex-1">
          {/* 아래로 갈수록 흐려지는 시안 표현 */}
          <div className="from-primary-5 pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t to-transparent" />
          <Swiper
            className="slide-per-auto-vertical slide-rolling h-full"
            modules={[Autoplay]}
            allowTouchMove={false}
            direction="vertical"
            loop
            spaceBetween={16}
            slidesOffsetBefore={20}
            slidesOffsetAfter={20}
            slidesPerView={'auto'}
            autoplay={{ delay: 1 }}
            speed={5000}
            breakpoints={{
              768: {
                slidesOffsetBefore: 24,
                slidesOffsetAfter: 24,
              },
            }}
          >
            {totalReview.reviewList
              .filter((r) => r.reviewItemList && r.reviewItemList?.length > 0)
              .map((review, index) => (
                <SwiperSlide
                  key={`review-${review.reviewInfo.reviewId}-${index}`}
                >
                  <ReviewItem review={review} />
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      </section>
    </>
  );
};

export default ReviewSection;

export const ReviewItem = ({ review }: { review: GetReview }) => {
  // 홈 카드에는 첫 문항 하나만 보여준다
  const question = review.reviewItemList?.[0];
  return (
    <div className="mx-4 flex select-none flex-col rounded-sm bg-white px-4 py-4 md:mx-6 md:px-5">
      <span className="text-xxsmall12 text-neutral-45 line-clamp-1">
        {dayjs(review.reviewInfo.createDate).format(YYYY_MM_DD)} 작성 ·{' '}
        {review.reviewInfo.programTitle}
      </span>
      <h3 className="text-xsmall14 text-neutral-0 md:text-xsmall16 mt-2 font-bold">
        {question?.questionType
          ? questionTypeToText[question.questionType]
          : '-'}
      </h3>
      <p className="text-xsmall14 text-neutral-20 mt-1 line-clamp-2">
        {question?.answer}
      </p>
    </div>
  );
};
