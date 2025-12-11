import Description from '@/domain/program/program-detail/Description';
import { ProgramType } from '@/types/common';
import { ProgramBlogReview } from '@/types/interface';
import Heading2 from '@components/common/ui/Heading2';
import Link from 'next/link';
import { MdChevronRight } from 'react-icons/md';

const ProgramDetailBlogReviewSection = ({
  review,
  programType,
}: {
  review: ProgramBlogReview;
  programType: ProgramType;
}) => {
  return (
    <section className="flex w-full max-w-[1000px] flex-col px-5 md:items-center md:px-10 lg:px-0">
      <div className="mb-6 w-full md:mb-16">
        <div className="relative mb-3 flex items-start justify-between md:mb-7 md:block">
          <Heading2 className="text-small20 md:text-center md:text-xlarge28">
            {programType === 'live' ? '클래스 ' : ''}참여자들의
            <br /> 생생한 후기를 더 만나보세요
          </Heading2>
          <Link
            href="/blog/list"
            target="_blank"
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
  );
};

export default ProgramDetailBlogReviewSection;
