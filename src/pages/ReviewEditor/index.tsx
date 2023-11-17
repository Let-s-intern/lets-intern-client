import ReviewHeader from '../../components/ReviewHeader';
import InputTitle from './components/InputTitle';
import Star from './components/Star';
import TextArea from './components/TextArea';
import useReviewEditor from './hook';

const ReviewEditor = () => {
  const { loading, error, program } = useReviewEditor();

  if (loading) {
    return <div className="mx-auto w-full max-w-xl px-7">loading</div>;
  }

  if (error) {
    return <div className="mx-auto w-full max-w-xl px-7">error</div>;
  }

  return (
    <div className="mx-auto w-full max-w-xl px-7">
      <ReviewHeader program={program} />
      <hr />
      <section className="py-5">
        <InputTitle>프로그램은 어떠셨나요?</InputTitle>
        <p className="mx-auto mt-2 w-52 break-keep text-center text-zinc-500">
          참여한 프로그램의 만족도를 별점으로 평가해 주세요.
        </p>
        <div className="mt-3 flex justify-center">
          <div className="flex gap-2">
            <Star />
            <Star />
            <Star />
            <Star />
            <Star />
          </div>
        </div>
      </section>
      <hr />
      <section className="py-7">
        <InputTitle>전반적인 후기를 남겨주세요.</InputTitle>
        <TextArea placeholder="후기를 여기에 작성해주세요." />
      </section>
      <hr />
      <section className="py-7">
        <InputTitle>그 외 바라는 점이 있다면 작성해주세요.</InputTitle>
        <TextArea placeholder="바라는 점을 여기에 작성해주세요." />
      </section>
      <div className="h-14 sm:h-20" />
      <div className="fixed bottom-0 left-0 flex w-screen justify-center sm:bottom-3">
        <button className="h-14 w-full bg-primary text-white sm:max-w-xl sm:rounded">
          등록하기
        </button>
      </div>
    </div>
  );
};

export default ReviewEditor;
