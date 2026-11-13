import { ArrowUp, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { FormEvent, useEffect, useRef, useState } from 'react';

import {
  HOME_SEARCH_QUERY_MAX_LENGTH,
  HomeSearchItem,
  HomeSearchResponse,
} from './homeSearchTypes';

export interface ChatTurn {
  id: number;
  query: string;
  status: 'pending' | 'done' | 'error';
  result?: HomeSearchResponse;
}

const KIND_LABEL: Record<HomeSearchItem['kind'], string> = {
  CHALLENGE: '챌린지',
  LIVE: 'LIVE 클래스',
  LIVE_MENTORING: 'LIVE 멘토링',
  VOD: 'VOD',
  REPORT: '서류 진단',
  GUIDEBOOK: '가이드북',
  BLOG: '블로그',
};

/** 키워드 대체 검색은 AI 답변이 없어서 고정 문구로 채운다 */
function getAnswerText(result: HomeSearchResponse) {
  if (result.answer) return result.answer;
  return result.items.length > 0
    ? '관련된 프로그램을 찾아봤어요. 오른쪽 추천 목록을 확인해 보세요.'
    : '딱 맞는 결과를 찾지 못했어요. 지금 고민을 조금 더 자세히 말해 주세요.';
}

const AssistantBubble = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-start gap-2">
    <span className="bg-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white">
      <Sparkles size={14} />
    </span>
    <div className="text-xsmall14 text-neutral-10 md:text-xsmall16 max-w-[85%] whitespace-pre-line rounded-md rounded-tl-none bg-white px-4 py-3">
      {children}
    </div>
  </div>
);

const ChatPanel = ({
  turns,
  onAsk,
}: {
  turns: ChatTurn[];
  onAsk: (query: string) => void;
}) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const isPending = turns.at(-1)?.status === 'pending';

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
    <div className="bg-primary-5 border-primary-15 flex h-[420px] flex-col rounded-md border md:h-[480px]">
      <div className="border-primary-15 text-xsmall14 text-neutral-0 flex items-center gap-2 border-b px-4 py-3 font-semibold md:px-5">
        <Sparkles size={16} className="text-primary" />
        렛츠커리어 AI
      </div>

      <div
        ref={scrollRef}
        className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-4 md:px-5"
      >
        {turns.map((turn) => (
          <div key={turn.id} className="flex flex-col gap-4">
            <div className="bg-primary text-xsmall14 md:text-xsmall16 ml-auto max-w-[85%] whitespace-pre-line rounded-md rounded-tr-none px-4 py-3 text-white">
              {turn.query}
            </div>
            {turn.status === 'pending' && (
              <AssistantBubble>
                <span className="text-primary animate-pulse">
                  딱 맞는 프로그램을 찾고 있어요…
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
              <AssistantBubble>{getAnswerText(turn.result)}</AssistantBubble>
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
          maxLength={HOME_SEARCH_QUERY_MAX_LENGTH}
          placeholder="이어서 물어보세요"
          aria-label="이어서 질문하기"
          className="text-xsmall14 text-neutral-0 md:text-xsmall16 min-w-0 flex-1 rounded-full bg-white px-4 py-2.5 outline-none placeholder:text-neutral-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || isPending}
          aria-label="보내기"
          className="home_search_chat_submit bg-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white disabled:opacity-40"
        >
          <ArrowUp size={18} />
        </button>
      </form>
    </div>
  );
};

const RecommendPanel = ({ items }: { items: HomeSearchItem[] }) => {
  // 프로그램을 먼저, 블로그는 맨 뒤로. 같은 종류 안에서는 관련도 순서를 유지한다
  const sorted = [
    ...items.filter((item) => item.kind !== 'BLOG'),
    ...items.filter((item) => item.kind === 'BLOG'),
  ];

  return (
    <div className="flex flex-col md:h-[480px]">
      <h3 className="text-xsmall16 text-neutral-0 md:text-small18 font-bold">
        AI 추천 프로그램
      </h3>
      <ul className="mt-3 flex flex-col gap-2.5 md:overflow-y-auto">
        {sorted.map((item) => (
          <li key={item.key}>
            <Link
              href={item.href}
              className="home_search_result border-neutral-85 hover:border-primary flex gap-3 rounded-sm border bg-white p-3 transition-colors"
              data-url={item.href}
              data-text={item.title}
            >
              {item.thumbnail && (
                <img
                  src={item.thumbnail}
                  alt=""
                  className="rounded-xs h-16 w-16 shrink-0 object-cover"
                />
              )}
              <div className="flex min-w-0 flex-col gap-1">
                <span className="text-xxsmall12 text-primary font-semibold">
                  {KIND_LABEL[item.kind] ?? item.kind}
                </span>
                <span className="text-xsmall14 text-neutral-0 line-clamp-2 font-semibold">
                  {item.title}
                </span>
                <span className="text-xxsmall12 text-neutral-40 line-clamp-1">
                  {item.description}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const HomeSearchChat = ({
  turns,
  onAsk,
}: {
  turns: ChatTurn[];
  onAsk: (query: string) => void;
}) => {
  // AI 가 도구로 추천을 띄운 가장 최근 턴. 이후 잡담 턴이 와도 패널은 유지한다
  const panelTurn = turns.findLast(
    (turn) => turn.status === 'done' && turn.result?.showPanel,
  );

  if (!panelTurn?.result) {
    return (
      <div className="mt-8 w-full max-w-[760px] text-left md:mt-10">
        <ChatPanel turns={turns} onAsk={onAsk} />
      </div>
    );
  }

  return (
    <div className="mt-8 grid w-full grid-cols-1 gap-6 text-left md:mt-10 md:grid-cols-[3fr_2fr] md:gap-8">
      <ChatPanel turns={turns} onAsk={onAsk} />
      <RecommendPanel items={panelTurn.result.items} />
    </div>
  );
};

export default HomeSearchChat;
