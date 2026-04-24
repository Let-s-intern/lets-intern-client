import { BlogType, useBlogListQuery } from '@/api/blog/blog';

export default function useGetBlogParticipationReview(size: number) {
  const { data: programReviewsData } = useBlogListQuery({
    pageable: { page: 1, size },
    types: [BlogType.PROGRAM_REVIEWS],
  });
  const { data: jobSuccessStoriesData } = useBlogListQuery({
    pageable: { page: 1, size },
    types: [BlogType.JOB_SUCCESS_STORIES],
  });

  const data = [
    ...(programReviewsData?.blogInfos ?? []),
    ...(jobSuccessStoriesData?.blogInfos ?? []),
  ].sort((a, b) => {
    const displayDateA = a.blogThumbnailInfo.displayDate ?? '';
    const displayDateB = b.blogThumbnailInfo.displayDate ?? '';

    if (displayDateA > displayDateB) return -1;
    if (displayDateA < displayDateB) return 1;
    return 0;
  });

  return data.slice(0, size);
}
