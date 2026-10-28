import { ReactNode, useId } from 'react';

interface QuestionFieldFrameProps {
  title: string;
  isRequired: boolean;
  description?: string | null;
  error?: string;
  /** 한 칸짜리 입력이면 그 입력 id. 없으면(선택지 묶음) 제목이 묶음 이름이 된다 */
  inputId?: string;
  children: ReactNode;
}

/** 질문 한 칸: 제목, 필수 표시, 설명, 입력, 오류 문구(시안 .q) */
const QuestionFieldFrame = ({
  title,
  isRequired,
  description,
  error,
  inputId,
  children,
}: QuestionFieldFrameProps) => {
  const titleId = useId();
  const titleContent = (
    <>
      {title}
      {isRequired ? <span className="text-requirement ml-0.5">*</span> : null}
    </>
  );

  return (
    <div
      className="mt-5"
      role={inputId ? undefined : 'group'}
      aria-labelledby={inputId ? undefined : titleId}
    >
      {inputId ? (
        <label
          htmlFor={inputId}
          className="text-xsmall14 block font-semibold leading-normal"
        >
          {titleContent}
        </label>
      ) : (
        <p
          id={titleId}
          className="text-xsmall14 block font-semibold leading-normal"
        >
          {titleContent}
        </p>
      )}
      {description ? (
        <p className="text-xxsmall12 text-neutral-40 mt-0.5 leading-normal">
          {description}
        </p>
      ) : null}
      <div className="mt-2">{children}</div>
      {error ? (
        <p role="alert" className="text-xxsmall12 text-requirement mt-1.5">
          {error}
        </p>
      ) : null}
    </div>
  );
};

export default QuestionFieldFrame;
