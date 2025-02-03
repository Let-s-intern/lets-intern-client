import BlogReviewWrapper from '@components/common/review/BlogReviewWrapper';

export default async function Page() {
  // // [테스트] 파비콘 가져오기
  // const data = await client<BlogReviewList>('/v2/review/blog', {
  //   method: 'GET',
  // });
  // const text = await fetch(data.reviewList[1].url ?? '').then((res) =>
  //   res.text(),
  // );

  return (
    <div className="px-5 md:px-0 w-full">
      <BlogReviewWrapper />
    </div>
  );
}
