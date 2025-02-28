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

const ReviewSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reviewContainerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { data: reviewCount } = useGetReviewCount();
  const { data: blogData } = useBlogListQuery({
    pageable: { page: 1, size: 0 },
    types: [BlogType.PROGRAM_REVIEWS],
  });

  const { data: totalReview, isLoading: totalReviewIsLoading } =
    useGetProgramReview({ size: 20 });

  const reviewsCount =
    (reviewCount?.count ?? 0) + (blogData?.pageInfo.totalElements ?? 0);

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

  useEffect(() => {
    const container = reviewContainerRef.current;
    if (!container) return;

    const scrollSpeed = 1; // 속도 조절
    let animationFrameId: number;

    const scrollContent = () => {
      if (!container) return;

      container.scrollTop += scrollSpeed;

      // 스크롤이 끝까지 도달하면 처음으로 이동
      if (
        container.scrollTop + container.clientHeight >=
        container.scrollHeight
      ) {
        container.scrollTop = 0;
      }

      animationFrameId = requestAnimationFrame(scrollContent);
    };

    // 2초 뒤에 스크롤 시작 (자연스럽게)
    const timeoutId = setTimeout(() => {
      animationFrameId = requestAnimationFrame(scrollContent);
    }, 2000);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timeoutId);
    };
  }, [totalReview]); // 리뷰 데이터가 변경될 때마다 실행

  return (
    <>
      <section
        ref={sectionRef}
        className="mt-16 flex w-full max-w-[1160px] flex-col gap-6 px-5 md:mt-36 md:flex-row xl:px-0"
      >
        <div className="flex flex-col md:w-1/2">
          <span className="text-xsmall16 font-bold text-primary md:text-medium22">
            망설이는 순간, 누군가는 한 걸음 앞서갑니다.
          </span>
          <div className="mt-1 text-small20 font-bold text-neutral-0 md:mt-2 md:text-xxlarge32">
            렛츠커리어 챌린지는 지금도 진행 중!
            <br />
            <div className="flex h-7 overflow-hidden break-keep md:h-11">
              <div
                className={`transition-transform delay-500 duration-1000 ease-out ${
                  isVisible ? '-translate-y-full' : 'translate-y-0'
                }`}
              >
                <div>{reviewsCount - 1}</div>
                <div className="mt-0.5">{reviewsCount}</div>
              </div>
              <span>개의 후기가 실시간으로</span>
            </div>
            <span> 공유되고 있어요.</span>
          </div>
          <Button
            className="review_cta mt-4 w-fit rounded-xs px-3 py-2.5 text-xsmall14 font-semibold md:mt-8 md:rounded-sm md:px-5 md:py-4 md:text-small20"
            to="/review"
          >
            수강생들의 생생 후기 더 보기
          </Button>
        </div>
        <div
          ref={reviewContainerRef}
          className="h-72 w-full items-center overflow-auto bg-primary-5 scrollbar-hide md:h-[520px] md:w-1/2"
        >
          <div className="h-5 md:h-6" />
          <div className="flex w-full flex-col items-center gap-4">
            {totalReview?.reviewList?.map((review, index) => (
              <ReviewItem
                key={review.reviewInfo.reviewId + index.toString()}
                review={review}
              />
            ))}
          </div>
          <div className="h-5 md:h-6" />
        </div>
      </section>
    </>
  );
};

export default ReviewSection;

export const ReviewItem = ({ review }: { review: GetReview }) => {
  return (
    <div className="flex w-[260px] flex-col rounded-sm bg-white px-5 py-4 lg:w-[380px]">
      <div className="flex flex-col gap-y-1.5 text-xsmall14 md:gap-y-2">
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
      <div className="mt-4 flex w-full items-center gap-2 text-xxsmall12">
        <span className="whitespace-pre font-medium text-neutral-20">
          {review.reviewInfo.name ? `${review.reviewInfo.name[0]}**` : '익명'}
        </span>
        <span className="text-neutral-70 md:hidden">|</span>
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
