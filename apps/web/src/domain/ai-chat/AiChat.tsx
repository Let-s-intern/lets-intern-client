'use client';

import { ArrowUp, Sparkles, X } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';

import { twMerge } from '@/lib/twMerge';

import {
  AI_CHAT_PLACEHOLDER_EXAMPLES,
  AI_CHAT_PLACEHOLDER_INTERVAL_MS,
  AI_CHAT_QUERY_MAX_LENGTH,
} from './constants/aiChat';
import useAiChat from './hooks/useAiChat';
import ChatPanel from './ui/ChatPanel';
import ComparePanel from './ui/ComparePanel';
import RecommendPanel from './ui/RecommendPanel';

interface AiChatProps {
  /** 대화 시작·종료를 바깥(배치하는 화면)에 알린다. 스크롤·제목 축소 등에 쓴다 */
  onChattingChange?: (isChatting: boolean) => void;
  /**
   * 대화 영역 높이. 배치하는 화면의 헤더 높이에 따라 달라서 바깥에서 받는다.
   * 모바일은 패널이 대화창 아래로 내려가므로 대화창에만, 데스크톱은 대화창+패널 전체에 준다.
   */
  mobileHeightClassName?: string;
  desktopHeightClassName?: string;
}

/** 입력이 비어 있는 동안 placeholder 예시를 돌린다 */
function useRotatingPlaceholder(enabled: boolean) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % AI_CHAT_PLACEHOLDER_EXAMPLES.length),
      AI_CHAT_PLACEHOLDER_INTERVAL_MS,
    );
    return () => clearInterval(timer);
  }, [enabled]);
  return AI_CHAT_PLACEHOLDER_EXAMPLES[index];
}

/**
 * 렛츠커리어 AI 상담 입력창 + 대화 영역.
 * 패널(추천·비교)은 AI 가 도구를 호출한 마지막 답변에서만 연다.
 */
const AiChat = ({
  onChattingChange,
  mobileHeightClassName,
  desktopHeightClassName,
}: AiChatProps) => {
  const [query, setQuery] = useState('');
  const placeholder = useRotatingPlaceholder(!query);
  const { turns, isPending, start, followUp, reset } = useAiChat();
  const isChatting = turns.length > 0;

  useEffect(() => {
    onChattingChange?.(isChatting);
  }, [isChatting, onChattingChange]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed || isPending) return;
    start(trimmed);
  };

  const handleClear = () => {
    setQuery('');
    reset();
  };

  // 패널은 마지막으로 답이 온 턴 기준. 그 턴이 도구를 쓰지 않았으면 닫는다
  const lastDone = turns.findLast((turn) => turn.status === 'done');
  const panel = lastDone?.result?.panel ?? null;

  return (
    <div className="flex w-full flex-col items-center">
      <form
        onSubmit={handleSubmit}
        className={twMerge(
          'border-primary shadow-03 mt-8 flex h-14 w-full max-w-[600px] items-center gap-3 rounded-full border-2 bg-white pl-5 pr-2 md:mt-10 md:h-[60px] md:pl-6',
          isChatting && 'mt-4 md:mt-5',
        )}
      >
        <span className="text-primary text-xsmall14 md:text-xsmall16 flex shrink-0 items-center gap-1 font-semibold">
          <Sparkles size={18} />
          AI
        </span>
        <span className="bg-neutral-80 h-5 w-px shrink-0" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          maxLength={AI_CHAT_QUERY_MAX_LENGTH}
          placeholder={`예) ${placeholder}`}
          aria-label="AI 에게 질문하기"
          className="text-xsmall16 text-neutral-0 md:text-small18 min-w-0 flex-1 bg-transparent outline-none placeholder:text-neutral-50"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="새 대화"
            className="p-1 text-neutral-50"
          >
            <X size={20} />
          </button>
        )}
        <button
          type="submit"
          disabled={!query.trim() || isPending}
          aria-label="물어보기"
          className="ai_chat_submit bg-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white disabled:opacity-40 md:h-11 md:w-11"
          data-text={query}
        >
          <ArrowUp size={20} />
        </button>
      </form>

      {isChatting && !panel && (
        <div
          className={twMerge(
            'mt-4 w-full max-w-[760px] text-left md:mt-5',
            mobileHeightClassName,
            desktopHeightClassName,
          )}
        >
          <ChatPanel turns={turns} isPending={isPending} onAsk={followUp} />
        </div>
      )}

      {isChatting && panel && (
        <div
          className={twMerge(
            'mt-4 grid w-full grid-cols-1 gap-6 text-left md:mt-5 md:grid-cols-[3fr_2fr] md:gap-8',
            desktopHeightClassName,
          )}
        >
          <div
            className={twMerge(mobileHeightClassName, 'md:h-auto md:min-h-0')}
          >
            <ChatPanel turns={turns} isPending={isPending} onAsk={followUp} />
          </div>
          {panel.type === 'compare' ? (
            <ComparePanel items={panel.items} />
          ) : (
            <RecommendPanel items={panel.items} />
          )}
        </div>
      )}
    </div>
  );
};

export default AiChat;
