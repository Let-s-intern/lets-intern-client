import { useOneTimeFormFileUrlQuery } from '@/api/one-time-form/oneTimeFormQueries';

interface ImageAnswerProps {
  applicationId: number;
  questionId: number;
  name: string;
}

/** A10 서명 URL 로 미리보기를 그리고 원본 파일명을 붙인다 */
const ImageAnswer = ({ applicationId, questionId, name }: ImageAnswerProps) => {
  const { data, isError } = useOneTimeFormFileUrlQuery(
    applicationId,
    questionId,
  );

  return (
    <div className="flex flex-col gap-2">
      {isError ? (
        <p className="text-xxsmall12 text-neutral-40">
          미리보기를 불러오지 못했습니다.
        </p>
      ) : data ? (
        <img
          src={data.url}
          alt={name}
          className="border-neutral-80 rounded-xs max-h-60 max-w-xs border object-contain"
        />
      ) : (
        <div className="bg-neutral-95 rounded-xs h-40 w-60" />
      )}
      <span>{name}</span>
    </div>
  );
};

export default ImageAnswer;
