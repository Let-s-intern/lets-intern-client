import {
  AI_CHAT_HISTORY_MAX_LENGTH,
  AI_CHAT_HISTORY_MAX_MESSAGES,
  AI_CHAT_QUERY_MAX_LENGTH,
} from '@/domain/ai-chat/constants/aiChat';
import { answerAiChat } from '@/domain/ai-chat/server/aiChat.server';
import { AiChatMessage } from '@/domain/ai-chat/types/aiChat';

function isChatMessage(value: unknown): value is AiChatMessage {
  const m = value as AiChatMessage;
  return (
    typeof m === 'object' &&
    m !== null &&
    (m.role === 'user' || m.role === 'assistant') &&
    typeof m.content === 'string'
  );
}

/** 렛츠커리어 AI 상담 대화. 홈 상단 AI 입력창에서 쓴다. */
export async function POST(request: Request) {
  // 유료 AI 호출이라 다른 사이트·스크립트에서의 직접 호출을 막는다.
  // 남용 방어의 본체는 Vercel Firewall 의 경로별 rate limit 이다.
  const origin = request.headers.get('origin');
  if (!origin || origin !== new URL(request.url).origin) {
    return Response.json(
      { message: '허용되지 않은 요청입니다.' },
      { status: 403 },
    );
  }

  const body = await request.json().catch(() => null);
  const query =
    typeof body?.query === 'string'
      ? body.query.trim().slice(0, AI_CHAT_QUERY_MAX_LENGTH)
      : '';
  if (!query) {
    return Response.json({ message: '질문을 입력해 주세요.' }, { status: 400 });
  }

  const history: AiChatMessage[] = (
    Array.isArray(body?.history) ? body.history : []
  )
    .filter(isChatMessage)
    .slice(-AI_CHAT_HISTORY_MAX_MESSAGES)
    .map((m: AiChatMessage) => ({
      role: m.role,
      content: m.content.slice(0, AI_CHAT_HISTORY_MAX_LENGTH),
    }));

  return Response.json(await answerAiChat(query, history));
}
