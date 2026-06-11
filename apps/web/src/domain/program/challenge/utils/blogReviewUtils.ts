import { ExternalBlogReview, ProgramBlogReview } from '@/types/interface';

const MAX_BLOG_REVIEWS = 3;

export type BlogReviewCard = {
  id: string;
  thumbnail: string;
  label: string;
  href: string;
  isExternal: boolean;
};

export function maskName(name: string): string {
  if (name.length <= 1) return name;
  if (name.length === 2) return name[0] + '*';
  return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
}

export function buildBlogReviewCards(
  externalBlogReviews: ExternalBlogReview[],
  internalList: ProgramBlogReview['list'],
): BlogReviewCard[] {
  const externalSlice = externalBlogReviews.slice(0, MAX_BLOG_REVIEWS);
  const internalSlice = internalList.slice(
    0,
    MAX_BLOG_REVIEWS - externalSlice.length,
  );
  return [
    ...externalSlice.map((item, idx) => ({
      id: `ext-${idx}`,
      thumbnail: item.thumbnail,
      label: `${item.programTitle} / ${maskName(item.name)}`,
      href: item.url,
      isExternal: true,
    })),
    ...internalSlice.map((item) => ({
      id: `int-${item.id}`,
      thumbnail: item.thumbnail,
      label: item.title,
      href: `/blog/${item.id}`,
      isExternal: false,
    })),
  ];
}
