'use client';

import CheckBox from '@/common/box/CheckBox';
import LineInput from '@/common/input/LineInput';
import RadioButton from '@/domain/program/challenge/challenge-view/RadioButton';

const RADIO_COLOR = '#5177FF';

export interface MagnetQuestion {
  questionId: number;
  questionType: string;
  isRequired: string;
  question: string;
  description: string | null;
  selectionMethod: string;
  items: MagnetQuestionItem[];
}

export interface MagnetQuestionItem {
  itemId: number;
  value: string;
  isOther: boolean;
}

export interface MagnetSurveyAnswer {
  questionId: number;
  selectedItemIds: number[];
  otherText: string;
  subjectiveText: string;
}

interface MagnetSurveySectionProps {
  questions: MagnetQuestion[];
  answers: MagnetSurveyAnswer[];
  onAnswerChange: (questionId: number, answer: MagnetSurveyAnswer) => void;
}

const MagnetSurveySection = ({
  questions,
  answers,
  onAnswerChange,
}: MagnetSurveySectionProps) => {
  if (questions.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      {questions.map((question) => {
        const answer = answers.find(
          (a) => a.questionId === question.questionId,
        );
        return (
          <QuestionRenderer
            key={question.questionId}
            question={question}
            answer={answer}
            onAnswerChange={onAnswerChange}
          />
        );
      })}
    </div>
  );
};

function QuestionRenderer({
  question,
  answer,
  onAnswerChange,
}: {
  question: MagnetQuestion;
  answer: MagnetSurveyAnswer | undefined;
  onAnswerChange: (questionId: number, answer: MagnetSurveyAnswer) => void;
}) {
  const isRequired = question.isRequired === 'REQUIRED';

  const currentAnswer: MagnetSurveyAnswer = answer ?? {
    questionId: question.questionId,
    selectedItemIds: [],
    otherText: '',
    subjectiveText: '',
  };

  if (question.questionType === 'SUBJECTIVE') {
    return (
      <div className="flex flex-col gap-[6px]">
        <QuestionLabel
          question={question.question}
          description={question.description}
          isRequired={isRequired}
        />
        <LineInput
          id={`question-${question.questionId}`}
          name={`question-${question.questionId}`}
          className="text-xsmall14 md:text-xsmall16"
          placeholder="답변을 입력해 주세요."
          value={currentAnswer.subjectiveText}
          onChange={(e) =>
            onAnswerChange(question.questionId, {
              ...currentAnswer,
              subjectiveText: e.target.value,
            })
          }
        />
      </div>
    );
  }

  if (question.selectionMethod === 'SINGLE') {
    return (
      <div className="flex flex-col gap-3">
        <QuestionLabel
          question={question.question}
          description={question.description}
          isRequired={isRequired}
        />
        <div className="flex flex-col gap-2">
          {question.items.map((item) => (
            <div key={item.itemId} className="flex flex-col gap-2">
              <RadioButton
                color={RADIO_COLOR}
                checked={currentAnswer.selectedItemIds.includes(item.itemId)}
                label={item.value}
                onClick={() => {
                  const newAnswer: MagnetSurveyAnswer = {
                    ...currentAnswer,
                    selectedItemIds: [item.itemId],
                    otherText: item.isOther ? currentAnswer.otherText : '',
                  };
                  onAnswerChange(question.questionId, newAnswer);
                }}
              />
              {item.isOther &&
                currentAnswer.selectedItemIds.includes(item.itemId) && (
                  <LineInput
                    id={`question-${question.questionId}-other`}
                    name={`question-${question.questionId}-other`}
                    className="ml-7 mt-1 w-full max-w-sm text-xsmall14 md:text-xsmall16"
                    placeholder="기타 항목을 입력해 주세요."
                    value={currentAnswer.otherText}
                    onChange={(e) =>
                      onAnswerChange(question.questionId, {
                        ...currentAnswer,
                        otherText: e.target.value,
                      })
                    }
                  />
                )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // MULTIPLE selection
  return (
    <div className="flex flex-col gap-3">
      <QuestionLabel
        question={question.question}
        description={question.description}
        isRequired={isRequired}
      />
      <div className="flex flex-col gap-2">
        {question.items.map((item) => {
          const isSelected = currentAnswer.selectedItemIds.includes(
            item.itemId,
          );
          return (
            <div key={item.itemId} className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  const newIds = isSelected
                    ? currentAnswer.selectedItemIds.filter(
                        (id) => id !== item.itemId,
                      )
                    : [...currentAnswer.selectedItemIds, item.itemId];
                  onAnswerChange(question.questionId, {
                    ...currentAnswer,
                    selectedItemIds: newIds,
                    otherText:
                      item.isOther && !isSelected
                        ? currentAnswer.otherText
                        : item.isOther && isSelected
                          ? ''
                          : currentAnswer.otherText,
                  });
                }}
                className="flex w-full items-center gap-1 text-xsmall14"
              >
                <CheckBox
                  checked={isSelected}
                  width="w-6"
                  showCheckIcon
                />
                <span className="text-xsmall14 md:text-xsmall16">
                  {item.value}
                </span>
              </button>
              {item.isOther && isSelected && (
                <LineInput
                  id={`question-${question.questionId}-other`}
                  name={`question-${question.questionId}-other`}
                  className="ml-7 mt-1 w-full max-w-sm text-xsmall14 md:text-xsmall16"
                  placeholder="기타 항목을 입력해 주세요."
                  value={currentAnswer.otherText}
                  onChange={(e) =>
                    onAnswerChange(question.questionId, {
                      ...currentAnswer,
                      otherText: e.target.value,
                    })
                  }
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function QuestionLabel({
  question,
  description,
  isRequired,
}: {
  question: string;
  description: string | null;
  isRequired: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xsmall14 md:text-xsmall16">
        {question}
        {isRequired && <span className="pl-1 text-requirement">*</span>}
      </label>
      {description && (
        <p className="break-keep text-xsmall14 text-neutral-40 md:text-xsmall16">
          {description}
        </p>
      )}
    </div>
  );
}

export default MagnetSurveySection;
