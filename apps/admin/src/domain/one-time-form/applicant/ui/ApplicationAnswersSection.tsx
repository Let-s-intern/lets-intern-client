import type {
  AdminOneTimeFormApplicationQuestion,
  OneTimeFormAnswers,
} from '@/api/one-time-form/oneTimeFormSchema';

import { getAnswerRows, getQuestionTitle } from '../utils/answerDisplay';
import AnswerValue from './AnswerValue';
import DetailSection from './DetailSection';

interface ApplicationAnswersSectionProps {
  applicationId: number;
  questions: AdminOneTimeFormApplicationQuestion[];
  answers: OneTimeFormAnswers;
}

/** 질문 순서대로 모든 답. 삭제된 질문은 답했을 때만 `(삭제됨)` 을 붙여 보여준다 */
const ApplicationAnswersSection = ({
  applicationId,
  questions,
  answers,
}: ApplicationAnswersSectionProps) => {
  const rows = getAnswerRows(questions, answers);

  return (
    <DetailSection title="답변">
      {rows.length === 0 ? (
        <p className="text-xsmall14 text-neutral-40">질문이 없습니다.</p>
      ) : (
        <ol className="flex flex-col gap-5">
          {rows.map(({ question, value }) => (
            <li
              key={question.questionId}
              className="text-xsmall14 flex flex-col gap-1.5"
            >
              <span className="text-neutral-0 font-semibold">
                {getQuestionTitle(question)}
              </span>
              <div className="text-neutral-0">
                <AnswerValue
                  applicationId={applicationId}
                  question={question}
                  value={value}
                />
              </div>
            </li>
          ))}
        </ol>
      )}
    </DetailSection>
  );
};

export default ApplicationAnswersSection;
