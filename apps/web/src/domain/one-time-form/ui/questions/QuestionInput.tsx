import type { OneTimeFormQuestion } from '@/api/one-time-form/oneTimeFormSchema';
import {
  asAttachment,
  asText,
  asTextList,
  type RawAnswer,
} from '../../utils/rawAnswer';
import AttachmentQuestionField from './AttachmentQuestionField';
import CheckboxInput from './CheckboxInput';
import DateInput from './DateInput';
import DropdownInput from './DropdownInput';
import LongTextInput from './LongTextInput';
import NumberInput from './NumberInput';
import RadioInput from './RadioInput';
import ShortTextInput from './ShortTextInput';
import UrlInput from './UrlInput';

interface QuestionInputProps {
  id: string;
  /** 첨부 업로드 URL 발급(U4)에 쓴다 */
  slug: string;
  question: OneTimeFormQuestion;
  value: RawAnswer | undefined;
  hasError: boolean;
  onChange: (value: RawAnswer | undefined) => void;
  onBlur: () => void;
}

/** 질문 형식(계약 5.3)에 맞는 입력 하나를 고른다 */
const QuestionInput = ({
  slug,
  question,
  value,
  ...rest
}: QuestionInputProps) => {
  const choices = question.choices ?? [];

  switch (question.type) {
    case 'SHORT_TEXT':
      return <ShortTextInput value={asText(value)} {...rest} />;
    case 'LONG_TEXT':
      return <LongTextInput value={asText(value)} {...rest} />;
    case 'RADIO':
      return <RadioInput choices={choices} value={asText(value)} {...rest} />;
    case 'DROPDOWN':
      return (
        <DropdownInput choices={choices} value={asText(value)} {...rest} />
      );
    case 'CHECKBOX':
      return (
        <CheckboxInput choices={choices} value={asTextList(value)} {...rest} />
      );
    case 'DATE':
      return <DateInput value={asText(value)} {...rest} />;
    case 'NUMBER':
      return (
        <NumberInput
          value={asText(value)}
          unit={question.description}
          {...rest}
        />
      );
    case 'URL':
      return <UrlInput value={asText(value)} {...rest} />;
    case 'IMAGE':
    case 'FILE':
      return (
        <AttachmentQuestionField
          slug={slug}
          questionId={question.questionId}
          kind={question.type}
          value={asAttachment(value)}
          {...rest}
        />
      );
  }
};

/** 한 칸짜리 입력인가. 아니면(라디오·체크박스) 제목을 묶음 이름으로 쓴다 */
export const isSingleControl = (type: OneTimeFormQuestion['type']) =>
  type !== 'RADIO' && type !== 'CHECKBOX';

export default QuestionInput;
