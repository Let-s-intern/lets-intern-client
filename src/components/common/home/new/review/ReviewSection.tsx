import useGetBlogParticipationReview from '@/hooks/useGetParticipationReviews';
import { getBlogPathname } from '@/utils/url';
import Link from 'next/link';
import { GoArrowRight } from 'react-icons/go';
import Heading from '../ui/Heading';

const ReviewSection = () => {
  const data = useGetBlogParticipationReview(5);

  return (
    <section className="px-5">
      <div className="flex items-center justify-between">
        <Heading>생생한 참여 후기</Heading>
        <Link
          className="flex cursor-pointer items-center gap-1 text-neutral-40"
          href="/blog/list"
        >
          <span>더보기</span>
          <GoArrowRight size={20} />
        </Link>
      </div>
      <div className="custom-scrollbar mt-6 flex items-center gap-4 overflow-x-auto">
        {data.map(({ blogThumbnailInfo }) => (
          <Link
            href={getBlogPathname(blogThumbnailInfo)}
            key={blogThumbnailInfo.id}
            className="review_card shrink-0"
          >
            <img
              className="h-[11.25rem] w-auto rounded-xs object-contain sm:h-[250px]"
              src={blogThumbnailInfo.thumbnail ?? ''}
              alt="참여 후기 썸네일"
            />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ReviewSection;
