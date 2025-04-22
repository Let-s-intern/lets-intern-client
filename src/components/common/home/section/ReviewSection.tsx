import { BlogType, useBlogListQuery } from '@/api/blog';
import {
  GetReview,
  QuestionType,
  useGetProgramReview,
  useGetReviewCount,
} from '@/api/review';
import { YYYY_MM_DD } from '@/data/dayjsFormat';
import dayjs from '@/lib/dayjs';
import { questionTypeToText } from '@/utils/convert';
import Button from '@components/common/ui/button/Button';
import { useEffect, useRef, useState } from 'react';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const ReviewSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [reviewPage, setReviewPage] = useState(1);

  const { data: reviewCount } = useGetReviewCount();
  const { data: blogData } = useBlogListQuery({
    pageable: { page: 1, size: 0 },
    types: [BlogType.PROGRAM_REVIEWS],
  });

  const { data: totalReview, isLoading: totalReviewIsLoading } =
    useGetProgramReview({ size: 40, page: reviewPage });

  const reviewsCount =
    (reviewCount?.count ?? 0) + (blogData?.pageInfo.totalElements ?? 0);

  const reviewList = totalReview?.reviewList.filter(
    (r) => r.reviewItemList && r.reviewItemList?.length > 0,
  );

  useEffect(() => {
    // 총 세 번까지 리뷰 요청
    if (!reviewList || reviewList?.length > 0 || reviewPage > 2) return;
    setReviewPage(reviewPage + 1);
  }, [reviewList]);

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

  if (
    totalReviewIsLoading ||
    !totalReview ||
    totalReview.reviewList.length < 1 ||
    (reviewList?.length ?? 0) < 5
  )
    return null;

  return (
    <>
      <section
        ref={sectionRef}
        className="mt-16 flex w-full max-w-[1120px] flex-col gap-6 px-5 md:mt-36 md:flex-row xl:px-0"
      >
        <div className="flex flex-col md:w-1/2">
          <div className="text-small20 font-bold text-neutral-0 md:mt-2 md:text-xlarge28">
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
            className="review_cta mt-4 w-fit rounded-xs px-3 py-2.5 text-xsmall14 font-semibold md:mt-8 md:rounded-sm md:px-4 md:py-3 md:text-small18"
            to="/review"
          >
            수강생들의 생생 후기 더 보기
          </Button>
        </div>
        <div className="h-72 w-full items-center bg-primary-5 md:h-[520px] md:w-1/2">
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
                  key={'review' + review.reviewInfo.reviewId + index}
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
  return (
    <div className="mx-auto flex w-[260px] select-none flex-col rounded-sm bg-white px-5 py-4 lg:w-[400px]">
      <div className="flex flex-col gap-y-1.5 text-xsmall14">
        <span className="font-medium text-primary">
          {dayjs(review.reviewInfo.createDate).format(YYYY_MM_DD)} 작성
        </span>
        <h3 className="line-clamp-2 font-bold text-neutral-0">
          {review.reviewInfo.programTitle}
        </h3>
      </div>
      <div className="mt-3 flex flex-col gap-y-3">
        {review.reviewItemList?.map((question, index) => (
          <ReviewItemBlock
            key={index}
            answer={question.answer}
            questionType={question.questionType}
          />
        ))}
      </div>
      <div className="mt-3 flex w-full items-center gap-2 text-xxsmall12">
        <span className="whitespace-pre font-medium text-neutral-20">
          {review.reviewInfo.name ? `${review.reviewInfo.name[0]}**` : '익명'}
        </span>
        <span className="text-neutral-70">|</span>
        <span className="line-clamp-1">
          희망직무{' '}
          <span className="font-medium">{review.reviewInfo.wishJob}</span> ·
          희망산업{' '}
          <span className="font-medium">{review.reviewInfo.wishCompany}</span>
        </span>
      </div>
    </div>
  );
};

const ReviewItemBlock = (props: {
  answer?: string | null;
  questionType?: QuestionType | null;
}) => {
  return (
    <div className="flex flex-col gap-y-0.5 text-xsmall14">
      <h3 className="font-semibold text-neutral-10">
        {props.questionType ? questionTypeToText[props.questionType] : '-'}
      </h3>
      <p className="line-clamp-2 text-neutral-20">{props.answer}</p>
    </div>
  );
};
