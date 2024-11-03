import { twMerge } from '@/lib/twMerge';
import { ProgramType } from '@/types/common';
import { ProgramBlogReview } from '@/types/interface';
import { MdChevronRight } from 'react-icons/md';
import { Link } from 'react-router-dom';
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
    <div className="w-full max-w-[1200px] px-5 py-8 md:px-10 md:py-52">
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
      <Description className="mb-6 md:mb-20 md:text-center">
        렛츠커리어와 함께한 다양한 합격자들의 <br />
        생생한 인터뷰를 확인해보세요
      </Description>
      <div className="flex justify-center">
        <div
          className={twMerge(
            'custom-scrollbar -mx-5 flex w-auto flex-nowrap gap-4 overflow-x-auto px-5',
          )}
        >
          {review.list.map((review) => (
            <Link
              to={`/blog/${review.id}`}
              key={review.id}
              className="w-72 flex-shrink-0 overflow-hidden rounded-md lg:w-96 lg:min-w-96"
              target="_blank"
              rel="noreferrer noopener"
            >
              <img
                className="object h-auto w-full object-cover"
                style={{ aspectRatio: '864/627' }}
                src={review.thumbnail}
                alt="참여 후기 썸네일"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgramDetailBlogReviewSection;
