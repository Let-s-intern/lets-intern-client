import type { AdminOneTimeFormApplicationQuestion } from '@/api/one-time-form/oneTimeFormSchema';

import { toAnswerDisplay } from '../utils/answerDisplay';
import FileAnswer from './FileAnswer';
import ImageAnswer from './ImageAnswer';

interface AnswerValueProps {
  applicationId: number;
  question: Pick<AdminOneTimeFormApplicationQuestion, 'questionId' | 'type'>;
  value: unknown;
}

/** 질문 형식별 답 하나(계약 5.3). 미응답은 `-` */
const AnswerValue = ({ applicationId, question, value }: AnswerValueProps) => {
  const display = toAnswerDisplay(question.type, value);

  switch (display.kind) {
    case 'EMPTY':
      return <span className="text-neutral-40">-</span>;
    case 'LINK':
      return (
        <a
          href={display.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary break-all underline"
        >
          {display.href}
        </a>
      );
    case 'IMAGE':
      return (
        <ImageAnswer
          applicationId={applicationId}
          questionId={question.questionId}
          name={display.name}
        />
      );
    case 'FILE':
      return (
        <FileAnswer
          applicationId={applicationId}
          questionId={question.questionId}
          name={display.name}
        />
      );
    case 'TEXT':
      return <p className="whitespace-pre-wrap break-words">{display.text}</p>;
  }
};

export default AnswerValue;
