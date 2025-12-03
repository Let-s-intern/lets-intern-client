import { ProgramType } from '@/types/common';
import { ProgramBlogReview } from '@/types/interface';
import Link from 'next/link';
import { MdChevronRight } from 'react-icons/md';
import { Break } from './Break';
import Description from './common/program/program-detail/Description';
import Heading2 from './common/ui/Heading2';

const ProgramChallengePortfolioDetailBlogReviewSection = ({
  review,
  // programType,
}: {
  review: ProgramBlogReview;
  programType: ProgramType;
}) => {
  return (
    <div className="flex w-full flex-col items-center bg-[#1A2A5D] md:pb-32">
      <section className="flex w-full max-w-[1000px] flex-col px-5 md:items-center md:px-10 lg:px-0">
        <div className="mb-6 w-full md:mb-16">
          <div className="relative mb-3 flex items-start justify-between md:mb-7 md:block">
            <Heading2 className="text-small20 text-white md:text-center md:text-xlarge28">
              그리고 이 기세 그대로 서류 넣어서
              <Break />
              실제로 <span className="text-[#FFCE5B]">합격</span>까지 달성하자!
            </Heading2>
            <Link
              href="/blog/list"
              target="_blank"
              className="mt-1 flex items-center whitespace-nowrap text-xsmall14 font-medium text-neutral-50 md:absolute md:right-0 md:top-0"
            >
              더보기
              <MdChevronRight className="h-5 w-5" />
            </Link>
          </div>
          <Description className="text-neutral-50 md:text-center">
            렛츠커리어와 함께한 다양한 합격자들의 <br />
            생생한 인터뷰를 확인해보세요
          </Description>
        </div>

        {/* 슬라이드 */}
        <div className="custom-scrollbar w-full overflow-x-auto">
          <div className="flex w-fit gap-4">
            {review.list.map((review) => (
              <Link
                href={`/blog/${review.id}`}
                key={review.id}
                className="shrink-0"
                target="_blank"
              >
                <img
                  className="h-28 w-auto rounded-sm transition hover:opacity-85 md:h-64"
                  src={review.thumbnail}
                  alt="참여 후기 썸네일"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProgramChallengePortfolioDetailBlogReviewSection;
