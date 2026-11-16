import { QuestionType } from '@/api/review/review';
import { twMerge } from '@/lib/twMerge';
import { questionTypeToText } from '@/utils/convert';
import ExpandableParagraph from './ExpandableParagraph';

interface Props {
  answer?: string | null;
  questionType?: QuestionType | null;
  lineClamp?: 1 | 2 | 3 | 4 | 5;
  /** 이게 있을 경우 우선함. */
  questionText?: string;
  expandable?: boolean;
}

const LINE_CLAMP_CLASS = {
  1: 'line-clamp-1',
  2: 'line-clamp-2',
  3: 'line-clamp-3',
  4: 'line-clamp-4',
  5: 'line-clamp-5',
} as const;

const ReviewItemBlock = (props: Props) => {
  const questionText =
    props.questionText ||
    (props.questionType ? questionTypeToText[props.questionType] : '');

  return (
    <div>
      <div className="flex w-fit items-center gap-1">
        <span className="text-xsmall14 font-semibold text-neutral-10">
          {questionText}
        </span>
      </div>
      {props.expandable ? (
        <ExpandableParagraph
          content={props.answer ?? ''}
          lineClamp={props.lineClamp}
          className={twMerge('text-xsmall14 font-normal text-neutral-20')}
        />
      ) : (
        <p
          className={twMerge(
            'text-xsmall14 font-normal tracking-[-0.028px] text-neutral-20',
            props.lineClamp ? LINE_CLAMP_CLASS[props.lineClamp] : '',
          )}
        >
          {props.answer}
        </p>
      )}
    </div>
  );
};

export default ReviewItemBlock;
