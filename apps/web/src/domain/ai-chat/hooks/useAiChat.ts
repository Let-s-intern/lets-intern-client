import { User, useUserQuery } from '@/api/user/user';
import { useRef, useState } from 'react';

import { AI_CHAT_API_PATH } from '../constants/aiChat';
import {
  AiChatLogMeta,
  AiChatMessage,
  AiChatResponse,
  AiChatTurn,
  AiChatUserSnapshot,
} from '../types/aiChat';

const ANON_ID_STORAGE_KEY = 'ai_chat_anon_id';

/** 비로그인 사용자도 같은 브라우저의 질문을 묶어 보려고 익명 id 를 둔다 */
function getAnonId() {
  try {
    const saved = localStorage.getItem(ANON_ID_STORAGE_KEY);
    if (saved) return saved;
    const created = crypto.randomUUID();
    localStorage.setItem(ANON_ID_STORAGE_KEY, created);
    return created;
  } catch {
    return null;
  }
}

/** 로그용 프로필. 계좌·관리자 메모는 보내지 않는다 */
function toUserSnapshot(user: User | undefined): AiChatUserSnapshot | null {
  if (!user) return null;
  return {
    userId: user.userId,
    name: user.name,
    email: user.email,
    contactEmail: user.contactEmail,
    phoneNum: user.phoneNum,
    nickname: user.nickname ?? null,
    university: user.university,
    major: user.major,
    grade: user.grade,
    careerType: user.careerType,
    wishField: user.wishField,
    wishJob: user.wishJob,
    wishIndustry: user.wishIndustry,
    wishEmploymentType: user.wishEmploymentType,
    wishCompany: user.wishCompany,
    inflowPath: user.inflowPath,
    authProvider: user.authProvider,
    marketingAgree: user.marketingAgree,
  };
}

async function postAiChat(params: {
  query: string;
  history: AiChatMessage[];
  meta: AiChatLogMeta;
  user: AiChatUserSnapshot | null;
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
  const { data: user } = useUserQuery();
  const conversationKey = useRef<string | null>(null);
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
      const result = await postAiChat({
        query,
        history: toHistory(prevTurns),
        meta: {
          conversationId: conversationKey.current,
          turnIndex: prevTurns.length,
          anonId: getAnonId(),
          device: window.matchMedia('(min-width: 768px)').matches
            ? 'desktop'
            : 'mobile',
        },
        user: toUserSnapshot(user),
      });
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
      conversationKey.current = crypto.randomUUID();
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
