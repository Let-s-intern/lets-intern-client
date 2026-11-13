import { ArrowUp, Sparkles } from 'lucide-react';
import { FormEvent, ReactNode, useEffect, useRef, useState } from 'react';

import { AI_CHAT_QUERY_MAX_LENGTH } from '../constants/aiChat';
import { AiChatResponse, AiChatTurn } from '../types/aiChat';
import MarkdownText from './MarkdownText';

/** 키워드 대체 응답은 AI 답변이 없어서 고정 문구로 채운다 */
function getAnswerText(result: AiChatResponse) {
  if (result.answer) return result.answer;
  return result.panel
    ? '관련된 프로그램을 찾아봤어요. 오른쪽 목록을 확인해 보세요.'
    : '딱 맞는 답을 찾지 못했어요. 지금 고민을 조금 더 자세히 말해 주세요.';
}

const AssistantBubble = ({ children }: { children: ReactNode }) => (
  <div className="flex items-start gap-2">
    <span className="bg-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white">
      <Sparkles size={14} />
    </span>
    <div className="text-xsmall14 text-neutral-10 md:text-xsmall16 max-w-[85%] rounded-md rounded-tl-none bg-white px-4 py-3">
      {children}
    </div>
  </div>
);

const ChatPanel = ({
  turns,
  isPending,
  onAsk,
}: {
  turns: AiChatTurn[];
  isPending: boolean;
  onAsk: (query: string) => void;
}) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [turns]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isPending) return;
    onAsk(trimmed);
    setInput('');
  };

  return (
    <div className="bg-primary-5 border-primary-15 flex h-full min-h-0 flex-col rounded-md border">
      <div className="border-primary-15 text-xsmall14 text-neutral-0 flex items-center gap-2 border-b px-4 py-3 font-semibold md:px-5">
        <Sparkles size={16} className="text-primary" />
        렛츠커리어 AI 상담
      </div>

      <div
        ref={scrollRef}
        className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-4 md:px-5"
      >
        {turns.map((turn) => (
          <div key={turn.id} className="flex flex-col gap-4">
            <div className="bg-primary text-xsmall14 md:text-xsmall16 ml-auto max-w-[85%] whitespace-pre-line rounded-md rounded-tr-none px-4 py-3 text-white">
              {turn.query}
            </div>
            {turn.status === 'pending' && (
              <AssistantBubble>
                <span className="text-primary animate-pulse">
                  답변을 준비하고 있어요…
                </span>
              </AssistantBubble>
            )}
            {turn.status === 'error' && (
              <AssistantBubble>
                <span className="text-system-error">
                  답변을 가져오지 못했어요. 잠시 후 다시 시도해 주세요.
                </span>
              </AssistantBubble>
            )}
            {turn.status === 'done' && turn.result && (
              <AssistantBubble>
                <MarkdownText text={getAnswerText(turn.result)} />
              </AssistantBubble>
            )}
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-primary-15 flex items-center gap-2 border-t px-3 py-3 md:px-4"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={AI_CHAT_QUERY_MAX_LENGTH}
          placeholder="이어서 물어보세요"
          aria-label="이어서 질문하기"
          className="text-xsmall14 text-neutral-0 md:text-xsmall16 min-w-0 flex-1 rounded-full bg-white px-4 py-2.5 outline-none placeholder:text-neutral-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || isPending}
          aria-label="보내기"
          className="ai_chat_follow_up bg-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white disabled:opacity-40"
        >
          <ArrowUp size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;
