import { MdChevronRight } from 'react-icons/md';
import { Link } from 'react-router-dom';

import { twMerge } from '@/lib/twMerge';
import { ProgramType } from '@/types/common';
import { ProgramBlogReview } from '@/types/interface';
import Description from './common/program/program-detail/Description';
import Heading2 from './common/program/program-detail/Heading2';

/**
 * TODO: 파일 어디론가 옮기기.
 */
const ProgramDetailBlogReviewSection = ({
  review,
  programType,
}: {
  review: ProgramBlogReview;
  programType: ProgramType;
}) => {
  return (
    <section className="w-full md:flex md:flex-col md:items-center">
      <div className="mb-6 w-full max-w-[1000px] md:mb-16">
        <div className="relative mb-3 flex items-start justify-between md:mb-7 md:block">
          <Heading2 className="text-small20 md:text-center md:text-xlarge28">
            {programType === 'live' ? '클래스 ' : ''}참여자들의
            <br /> 생생한 후기를 더 만나보세요
          </Heading2>
          <Link
            to="/blog/list"
            className="mt-1 flex items-center whitespace-nowrap text-xsmall14 font-medium text-neutral-35 md:absolute md:right-0 md:top-0"
          >
            더보기
            <MdChevronRight className="h-5 w-5" />
          </Link>
        </div>
        <Description className="md:text-center">
          렛츠커리어와 함께한 다양한 합격자들의 <br />
          생생한 인터뷰를 확인해보세요
        </Description>
      </div>

      {/* 슬라이드 */}
      <div className="flex justify-center">
        <div
          className={twMerge(
            'custom-scrollbar -mx-5 flex flex-nowrap gap-4 overflow-x-auto px-5 md:-mx-10 md:px-10 lg:px-0',
          )}
        >
          {review.list.map((review) => (
            <Link
              to={`/blog/${review.id}`}
              key={review.id}
              className="shrink-0"
              target="_blank"
              rel="noreferrer noopener"
            >
              <img
                className="h-28 w-auto md:h-64"
                style={{ aspectRatio: '864/627' }}
                src={review.thumbnail}
                alt="참여 후기 썸네일"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramDetailBlogReviewSection;
