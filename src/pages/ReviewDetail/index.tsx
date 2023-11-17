import ReviewHeader from '../../components/ReviewHeader';
import useReviewDetail from './hook';

const ReviewDetail = () => {
  const { loading, error, program } = useReviewDetail();

  if (loading) {
    return <div className="mx-auto w-full max-w-xl px-7">로딩 중...</div>;
  }

  if (error) {
    return <div className="mx-auto w-full max-w-xl px-7">에러 발생</div>;
  }

  return (
    <div className="mx-auto w-full max-w-xl px-7">
      <ReviewHeader program={program} />
      <section className="py-7">
        <h1 className="text-lg font-bold text-neutral-grey">후기 내용</h1>
        <p className="mt-3 text-zinc-500">도움이 아주 많이 되었습니다.</p>
      </section>
    </div>
  );
};

export default ReviewDetail;
