'use client';

import LexicalContent from '@/common/lexical/LexicalContent';
import { QuestionItem } from '@/domain/challenge/api/challengeQuestion';
import { ChevronLeft } from 'lucide-react';
import PanelCloseButton from './PanelCloseButton';

/** 답변은 Lexical JSON 이거나 일반 텍스트다 (InquiryItem 과 같은 규칙) */
const AnswerBody = ({ answer }: { answer: string }) => {
  try {
    const parsed = JSON.parse(answer);
    if (parsed?.root) {
      return <LexicalContent node={parsed.root} />;
    }
  } catch {
    // plain text fallback
  }
  return <span className="whitespace-pre-wrap">{answer}</span>;
};

interface InquiryThreadProps {
  item: QuestionItem;
  onRequestCancel: () => void;
  onBack: () => void;
  onClose: () => void;
}

const InquiryThread = ({
  item,
  onRequestCancel,
  onBack,
  onClose,
}: InquiryThreadProps) => {
  // 답변이 달렸어도 비공개면 사용자에게는 대기로 보인다
  const showAnswer =
    item.answerStatus === 'COMPLETED' && item.isVisible && item.answer;
  // 서버는 답변 전인 문의만 삭제를 허용한다
  const canCancel = item.answerStatus === 'WAITING';

  return (
    <div className="bg-neutral-95 flex flex-1 flex-col overflow-hidden">
      <header className="bg-static-100 border-neutral-85 flex shrink-0 items-center gap-2 border-b px-4 py-4">
        <button
          type="button"
          aria-label="뒤로"
          onClick={onBack}
          className="text-neutral-40 hover:text-neutral-0 shrink-0"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <p className="text-xsmall16 text-neutral-0 flex-1 truncate font-bold">
          {item.title}
        </p>
        <span className="md:hidden">
          <PanelCloseButton onClose={onClose} />
        </span>
      </header>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-5">
        {/* 내가 보낸 문의 */}
        <div className="flex justify-end">
          <div className="bg-primary max-w-[80%] rounded-md px-4 py-3 text-sm text-white">
            <p className="mb-1 font-bold">{item.title}</p>
            <p className="whitespace-pre-wrap">{item.content}</p>
          </div>
        </div>

        {/* 본문에 붙여넣은 이미지 */}
        {item.imageUrls.length > 0 && (
          <ul className="flex flex-wrap justify-end gap-2">
            {item.imageUrls.map((url) => (
              <li key={url}>
                <a href={url} target="_blank" rel="noreferrer">
                  <img
                    src={url}
                    alt="첨부 이미지"
                    className="rounded-xxs border-neutral-85 h-24 w-24 border object-cover"
                  />
                </a>
              </li>
            ))}
          </ul>
        )}

        {/* 렛츠커리어 답변 */}
        {showAnswer ? (
          <div className="flex items-start gap-2">
            <img
              src="/logo/logo-simple.svg"
              alt=""
              className="bg-static-100 h-8 w-8 shrink-0 rounded-sm p-1"
            />
            <div className="text-neutral-0 bg-static-100 max-w-[80%] rounded-md px-4 py-3 text-sm">
              <AnswerBody answer={item.answer as string} />
            </div>
          </div>
        ) : (
          <p className="text-xsmall14 text-neutral-45 py-4 text-center">
            답변을 준비하고 있어요. 조금만 기다려 주세요.
          </p>
        )}
      </div>

      {canCancel && (
        <div className="shrink-0 px-4 pb-5">
          <button
            type="button"
            onClick={onRequestCancel}
            className="text-xxsmall12 text-neutral-45 hover:text-neutral-30 mx-auto block underline underline-offset-2"
          >
            문의 취소하기
          </button>
        </div>
      )}
    </div>
  );
};

export default InquiryThread;
