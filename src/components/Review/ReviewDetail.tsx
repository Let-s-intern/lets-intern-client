interface ReviewDetailProps {
  loading: boolean;
  error: unknown;
}

const ReviewDetail = ({ loading, error }: ReviewDetailProps) => {
  if (loading) {
    return <div></div>;
  }

  if (error) {
    return <div>에러 발생</div>;
  }

  return (
    <div className="mx-auto w-full max-w-xl px-7">
      {/* <ReviewHeader program={undefined} /> */}
      <section className="py-7">
        <h1 className="text-lg font-bold text-neutral-grey">후기 내용</h1>
        <p className="mt-3 text-zinc-500">도움이 아주 많이 되었습니다.</p>
      </section>
    </div>
  );
};

export default ReviewDetail;
