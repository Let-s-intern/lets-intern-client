'use client';

import useGetBlogParticipationReview from '@/hooks/useGetParticipationReviews';
import useHasScroll from '@/hooks/useHasScroll';
import { twMerge } from '@/lib/twMerge';
import { getBlogPathname } from '@/utils/url';
import Link from 'next/link';
import AboutTitleDark from '../ui/AboutTitleDark';

const title = {
  subTitle: '원하는 신입 · 인턴십 합격',
  mainTitle: '렛츠커리어와 함께한 사람들의 이야기',
};

const ReviewSection = () => {
  const data = useGetBlogParticipationReview(5);
  const { scrollRef, hasScroll } = useHasScroll();

  return (
    <section className="bg-[#101348] px-5 py-[3.75rem] sm:px-10 sm:py-[6.25rem] xl:py-[8.75rem]">
      <AboutTitleDark {...title} />

      <div
        ref={scrollRef}
        className={twMerge(
          'custom-scrollbar -mx-5 mt-10 flex w-auto flex-nowrap gap-4 overflow-x-auto px-5 sm:-mx-10 sm:px-10 xl:pl-16',
          !hasScroll && 'justify-center',
        )}
      >
        {data.map(({ blogThumbnailInfo }) => (
          <Link
            href={getBlogPathname(blogThumbnailInfo)}
            key={blogThumbnailInfo.id}
            className="review_card shrink-0"
          >
            <img
              className="h-[11.25rem] w-auto rounded-xs object-contain sm:h-[250px]"
              src={blogThumbnailInfo.thumbnail ?? undefined}
              alt="참여 후기 썸네일"
            />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ReviewSection;
