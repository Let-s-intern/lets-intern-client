import type { OneTimeFormQuestion } from '@/api/one-time-form/oneTimeFormSchema';
import {
  fieldDomId,
  questionFieldKey,
  type ApplicationFieldKey,
} from '../../utils/applicationFormErrors';
import type { RawAnswer, RawAnswers } from '../../utils/rawAnswer';
import QuestionFieldFrame from './QuestionFieldFrame';
import QuestionInput, { isSingleControl } from './QuestionInput';

interface QuestionListProps {
  slug: string;
  questions: OneTimeFormQuestion[];
  answers: RawAnswers;
  errors: Partial<Record<ApplicationFieldKey, string>>;
  onChange: (questionId: number, value: RawAnswer | undefined) => void;
  onBlur: (key: ApplicationFieldKey) => void;
}

/** 시안 "추가 질문" 묶음. 질문은 받은 순서(sortOrder)대로 그린다 */
const QuestionList = ({
  slug,
  questions,
  answers,
  errors,
  onChange,
  onBlur,
}: QuestionListProps) => {
  if (questions.length === 0) return null;

  return (
    <section className="mt-7">
      <h2 className="text-xsmall16 font-bold">추가 질문</h2>
      {questions.map((question) => {
        const key = questionFieldKey(question.questionId);
        const id = fieldDomId(key);
        const error = errors[key];

        return (
          <QuestionFieldFrame
            key={question.questionId}
            title={question.title}
            isRequired={question.isRequired}
            description={question.description}
            error={error}
            inputId={isSingleControl(question.type) ? id : undefined}
          >
            <QuestionInput
              id={id}
              slug={slug}
              question={question}
              value={answers[question.questionId]}
              hasError={Boolean(error)}
              onChange={(value) => onChange(question.questionId, value)}
              onBlur={() => onBlur(key)}
            />
          </QuestionFieldFrame>
        );
      })}
    </section>
  );
};

export default QuestionList;
