import { useRef, useState } from 'react';

import { AI_CHAT_API_PATH } from '../constants/aiChat';
import { AiChatMessage, AiChatResponse, AiChatTurn } from '../types/aiChat';

async function postAiChat(params: {
  query: string;
  history: AiChatMessage[];
}): Promise<AiChatResponse> {
  const res = await fetch(AI_CHAT_API_PATH, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('AI 응답을 가져오지 못했어요.');
  return res.json();
}

/** 답이 온 턴만 대화 이력으로 서버에 보낸다 */
function toHistory(turns: AiChatTurn[]): AiChatMessage[] {
  return turns.flatMap((turn) =>
    turn.status === 'done' && turn.result?.answer
      ? [
          { role: 'user' as const, content: turn.query },
          { role: 'assistant' as const, content: turn.result.answer },
        ]
      : [],
  );
}

export default function useAiChat() {
  const [turns, setTurns] = useState<AiChatTurn[]>([]);
  const nextId = useRef(0);
  // 새 대화를 시작하면 이전 대화의 늦은 응답은 버린다
  const conversationId = useRef(0);

  const ask = async (query: string, prevTurns: AiChatTurn[]) => {
    const id = nextId.current++;
    const conversation = conversationId.current;
    setTurns([...prevTurns, { id, query, status: 'pending' }]);

    const update = (patch: Partial<AiChatTurn>) => {
      if (conversation !== conversationId.current) return;
      setTurns((prev) =>
        prev.map((turn) => (turn.id === id ? { ...turn, ...patch } : turn)),
      );
    };

    try {
      const result = await postAiChat({ query, history: toHistory(prevTurns) });
      update({ status: 'done', result });
    } catch {
      update({ status: 'error' });
    }
  };

  const isPending = turns.at(-1)?.status === 'pending';

  return {
    turns,
    isPending,
    /** 새 대화를 시작한다 */
    start: (query: string) => {
      conversationId.current++;
      ask(query, []);
    },
    /** 지금 대화에 이어서 묻는다 */
    followUp: (query: string) => ask(query, turns),
    reset: () => {
      conversationId.current++;
      setTurns([]);
    },
  };
}
