import styled from 'styled-components';
import ReviewHeader from '../ReviewHeader';
import InputTitle from './InputTitle';
import Star from './Star';
import TextArea from './TextArea';

interface ReviewEditorProps {
  loading: boolean;
  error: unknown;
  program: any;
  values: any;
  isSubmitDisabled: boolean;
  handleRatingChange: (value: number) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmitButton: () => void;
}

interface SubmitButtonProps {
  $disabled?: boolean;
}

const ReviewEditor = ({
  loading,
  error,
  program,
  values,
  isSubmitDisabled,
  handleRatingChange,
  handleInputChange,
  handleSubmitButton,
}: ReviewEditorProps) => {
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
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                onClick={() => handleRatingChange(i + 1)}
                isActive={values.grade > i}
              />
            ))}
          </div>
        </div>
      </section>
      <hr />
      <section className="py-7">
        <InputTitle>전반적인 후기를 남겨주세요.</InputTitle>
        <TextArea
          placeholder="후기를 여기에 작성해주세요."
          name="reviewContents"
          value={values.reviewContents}
          onChange={handleInputChange}
        />
      </section>
      <hr />
      <section className="py-7">
        <InputTitle>그 외 바라는 점이 있다면 작성해주세요.</InputTitle>
        <TextArea
          placeholder="바라는 점을 여기에 작성해주세요.(선택)"
          name="suggestContents"
          value={values.suggestContents}
          onChange={handleInputChange}
        />
      </section>
      <div className="h-14 sm:h-20" />
      <div className="fixed bottom-0 left-0 flex w-screen justify-center sm:bottom-3">
        <SubmitButton $disabled={isSubmitDisabled} onClick={handleSubmitButton}>
          등록하기
        </SubmitButton>
      </div>
    </div>
  );
};

export default ReviewEditor;

const SubmitButton = styled.button<SubmitButtonProps>`
  height: 3.5rem;
  width: 100%;
  background-color: ${({ $disabled }) => ($disabled ? '#a5a1fa' : '#6963F6')};
  color: #ffffff;
  cursor: ${({ $disabled }) => ($disabled ? 'auto' : 'pointer')};

  @media (min-width: 640px) {
    max-width: 36rem;
    border-radius: 4px;
  }
`;
