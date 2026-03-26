import BlogReviewWrapper from '@/domain/review/BlogReviewWrapper';

export default async function Page() {
  return (
    <div className="w-full px-5 md:px-0">
      <BlogReviewWrapper />
    </div>
  );
}
