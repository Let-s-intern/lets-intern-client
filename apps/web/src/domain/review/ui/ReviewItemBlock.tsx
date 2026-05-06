import { QuestionType } from '@/api/review/review';
import { twMerge } from '@/lib/twMerge';
import { questionTypeToText } from '@/utils/convert';
import { ReactNode } from 'react';
import ExpandableParagraph from './ExpandableParagraph';

interface Props {
  answer?: string | null;
  questionType?: QuestionType | null;
  lineClamp?: 1 | 2 | 3 | 4 | 5;
  /** 이게 있을 경우 우선함. */
  questionText?: string;
  expandable?: boolean;
  icon?: ReactNode;
  gap?: 'normal' | 'large';
}

const ReviewItemBlock = (props: Props) => {
  const questionText =
    props.questionText ||
    (props.questionType ? questionTypeToText[props.questionType] : '');

  return (
    <div>
      <div className="flex w-fit items-center gap-1">
        {/* {props.icon && props.icon} */}
        <span className="text-xsmall14 text-neutral-10 font-semibold">
          {questionText}
        </span>
      </div>
      {props.expandable ? (
        <ExpandableParagraph
          content={props.answer ?? ''}
          lineClamp={props.lineClamp}
          className={twMerge('text-xsmall14 text-neutral-20 font-normal')}
        />
      ) : (
        <p
          className={twMerge(
            'text-xsmall14 text-neutral-20 font-normal tracking-[-0.028px]',
            props.lineClamp === 1
              ? 'line-clamp-1'
              : props.lineClamp === 2
                ? 'line-clamp-2'
                : props.lineClamp === 3
                  ? 'line-clamp-3'
                  : props.lineClamp === 4
                    ? 'line-clamp-4'
                    : props.lineClamp === 5
                      ? 'line-clamp-5'
                      : null,
          )}
        >
          {props.answer}
        </p>
      )}
    </div>
  );
};

export default ReviewItemBlock;
