import { FormControlLabel, MenuItem, Switch, TextField } from '@mui/material';
import type { HTMLAttributes } from 'react';

import type { OneTimeFormQuestionType } from '@/api/one-time-form/oneTimeFormSchema';

import {
  isChoiceQuestionType,
  QUESTION_TYPE_LABELS,
  QUESTION_TYPES,
} from '../constants/questionTypes';
import type {
  QuestionDraft,
  QuestionDraftErrors,
} from '../types/questionDraft';
import type { QuestionListAction } from '../utils/questionListReducer';
import ChoiceListEditor from './ChoiceListEditor';

interface QuestionCardProps {
  question: QuestionDraft;
  index: number;
  total: number;
  errors?: QuestionDraftErrors;
  edit: (action: QuestionListAction) => void;
  onDelete: () => void;
  handleProps: HTMLAttributes<HTMLSpanElement>;
  dropProps: HTMLAttributes<HTMLLIElement>;
}

const TYPE_LOCKED_HELPER =
  '저장된 질문은 형식을 바꿀 수 없습니다. 바꾸려면 지우고 새로 만드세요.';

const QuestionCard = ({
  question,
  index,
  total,
  errors,
  edit,
  onDelete,
  handleProps,
  dropProps,
}: QuestionCardProps) => {
  const { key } = question;
  const isSaved = question.questionId !== null;

  return (
    <li
      className="border-neutral-80 flex flex-col gap-4 rounded-md border p-5"
      {...dropProps}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="text-neutral-40 cursor-grab select-none px-1"
            aria-label={`질문 ${index + 1} 끌어서 순서 바꾸기`}
            {...handleProps}
          >
            ::
          </span>
          <h4 className="text-xsmall16 text-neutral-0 font-bold">
            질문 {index + 1}
          </h4>
        </div>
        <div className="text-xxsmall12 text-neutral-40 flex gap-2">
          <button
            type="button"
            aria-label={`질문 ${index + 1} 위로`}
            disabled={index === 0}
            onClick={() => edit({ type: 'move', from: index, to: index - 1 })}
          >
            위로
          </button>
          <button
            type="button"
            aria-label={`질문 ${index + 1} 아래로`}
            disabled={index === total - 1}
            onClick={() => edit({ type: 'move', from: index, to: index + 1 })}
          >
            아래로
          </button>
          <button
            type="button"
            aria-label={`질문 ${index + 1} 삭제`}
            onClick={onDelete}
          >
            삭제
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <TextField
          className="flex-1"
          select
          label="형식"
          value={question.type}
          disabled={isSaved}
          helperText={isSaved ? TYPE_LOCKED_HELPER : undefined}
          onChange={(e) =>
            edit({
              type: 'changeType',
              key,
              questionType: e.target.value as OneTimeFormQuestionType,
            })
          }
        >
          {QUESTION_TYPES.map((type) => (
            <MenuItem key={type} value={type}>
              {QUESTION_TYPE_LABELS[type]}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          className="flex-[2]"
          label="질문 문구"
          required
          value={question.title}
          onChange={(e) =>
            edit({ type: 'update', key, patch: { title: e.target.value } })
          }
          error={!!errors?.title}
          helperText={errors?.title}
        />
      </div>

      <TextField
        label="설명"
        multiline
        minRows={2}
        value={question.description}
        onChange={(e) =>
          edit({ type: 'update', key, patch: { description: e.target.value } })
        }
        error={!!errors?.description}
        helperText={errors?.description}
      />

      <FormControlLabel
        label="필수"
        control={
          <Switch
            checked={question.isRequired}
            onChange={(e) =>
              edit({
                type: 'update',
                key,
                patch: { isRequired: e.target.checked },
              })
            }
          />
        }
      />

      {isChoiceQuestionType(question.type) && (
        <ChoiceListEditor
          choices={question.choices}
          error={errors?.choices}
          onAdd={() => edit({ type: 'addChoice', key })}
          onChange={(i, value) =>
            edit({ type: 'updateChoice', key, index: i, value })
          }
          onRemove={(i) => edit({ type: 'removeChoice', key, index: i })}
          onMove={(from, to) => edit({ type: 'moveChoice', key, from, to })}
        />
      )}
    </li>
  );
};

export default QuestionCard;
