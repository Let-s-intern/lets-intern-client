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
import type { AiChatItem } from './types/aiChat';
import ChatPanel from './ui/ChatPanel';
import PanelView from './ui/PanelView';

interface AiChatProps {
  /** 대화 시작·종료를 바깥(배치하는 화면)에 알린다. 제목 축소·배너 숨김 등에 쓴다 */
  onChattingChange?: (isChatting: boolean) => void;
  /** 상단 입력창으로 질문할 때마다 호출된다. 대화 영역으로 스크롤할 때 쓴다 */
  onAsk?: () => void;
  /**
   * 대화 영역 높이. 배치하는 화면의 헤더 높이에 따라 달라서 바깥에서 받는다.
   * 모바일은 패널이 대화창 아래로 내려가므로 대화창에만, 데스크톱은 대화창+패널 전체에 준다.
   */
  mobileHeightClassName?: string;
  desktopHeightClassName?: string;
  /** AI 가 추천한 상품이 바뀔 때마다 호출된다. 추천이 없어지면 빈 배열. 아래 목록과 연동할 때 쓴다 */
  onRecommend?: (items: AiChatItem[]) => void;
  /** 입력창 placeholder 를 고정한다. 없으면 예시를 돌린다 */
  placeholder?: string;
  /** 보내기 버튼에 글자를 쓴다. 없으면 화살표 아이콘 */
  submitLabel?: string;
  /** 입력창 아래 "이렇게 물어보세요" 예시 질문. 누르면 바로 묻는다 */
  suggestions?: string[];
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
  onAsk,
  mobileHeightClassName,
  desktopHeightClassName,
  placeholder: fixedPlaceholder,
  submitLabel,
  suggestions,
  onRecommend,
}: AiChatProps) => {
  const [query, setQuery] = useState('');
  const rotatingPlaceholder = useRotatingPlaceholder(
    !query && !fixedPlaceholder,
  );
  const placeholder = fixedPlaceholder ?? rotatingPlaceholder;
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
    onAsk?.();
  };

  const handleClear = () => {
    setQuery('');
    reset();
  };

  // 패널은 마지막으로 답이 온 턴 기준. 그 턴이 도구를 쓰지 않았으면 닫는다
  const lastDone = turns.findLast((turn) => turn.status === 'done');
  const panel = lastDone?.result?.panel ?? null;

  const recommended = panel?.type === 'recommend' ? panel.items : null;
  useEffect(() => {
    onRecommend?.(recommended ?? []);
  }, [recommended, onRecommend]);

  return (
    <div className="flex w-full flex-col items-center">
      <form
        onSubmit={handleSubmit}
        className={twMerge(
          'mt-8 flex h-14 w-full max-w-[600px] items-center gap-3 rounded-full border-2 border-primary bg-white pl-5 pr-2 shadow-03 md:mt-10 md:h-[60px] md:pl-6',
          isChatting && 'mt-0 md:mt-0',
        )}
      >
        <Sparkles size={18} className="shrink-0 text-primary" aria-hidden />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          maxLength={AI_CHAT_QUERY_MAX_LENGTH}
          placeholder={`예) ${placeholder}`}
          aria-label="AI 에게 질문하기"
          className="min-w-0 flex-1 bg-transparent text-xsmall16 text-neutral-0 outline-none placeholder:text-neutral-50 md:text-small18"
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
          className={twMerge(
            'ai_chat_submit flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white disabled:opacity-40 md:h-11 md:w-11',
            submitLabel &&
              'text-xsmall14 font-semibold md:w-auto md:gap-1 md:px-5',
          )}
          data-text={query}
        >
          {submitLabel && (
            <span className="hidden md:inline">{submitLabel}</span>
          )}
          <ArrowUp size={20} />
        </button>
      </form>

      {suggestions && !isChatting && (
        // 모바일은 칩이 두 줄로 쌓여 목록을 밀어내지 않게 한 줄 가로 스크롤
        <div className="-mx-5 mt-4 flex w-[calc(100%+2.5rem)] max-w-[600px] items-center gap-2 overflow-x-auto px-5 scrollbar-hide md:mx-0 md:w-full md:flex-wrap md:px-0">
          <span className="shrink-0 whitespace-nowrap text-xsmall14 text-neutral-30">
            이렇게 물어보세요
          </span>
          {suggestions.map((text) => (
            <button
              key={text}
              type="button"
              disabled={isPending}
              onClick={() => {
                setQuery(text);
                start(text);
                onAsk?.();
              }}
              className="ai_chat_suggestion shrink-0 whitespace-nowrap rounded-full border border-neutral-80 bg-white px-3 py-1.5 text-xsmall14 text-neutral-20 hover:border-neutral-60"
              data-text={text}
            >
              {text}
            </button>
          ))}
        </div>
      )}

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
            'mt-4 grid w-full grid-cols-1 gap-6 text-left md:mt-5 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:gap-8',
            desktopHeightClassName,
          )}
        >
          <div
            className={twMerge(mobileHeightClassName, 'md:h-auto md:min-h-0')}
          >
            <ChatPanel turns={turns} isPending={isPending} onAsk={followUp} />
          </div>
          {/* 모바일은 대화창 안 답변 아래에 같은 패널을 보여주므로 오른쪽 패널은 데스크톱만 */}
          <div className="hidden min-h-0 md:block md:h-full">
            <PanelView panel={panel} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AiChat;
