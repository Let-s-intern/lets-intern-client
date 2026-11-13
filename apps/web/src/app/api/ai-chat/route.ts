import {
  AI_CHAT_HISTORY_MAX_LENGTH,
  AI_CHAT_HISTORY_MAX_MESSAGES,
  AI_CHAT_QUERY_MAX_LENGTH,
} from '@/domain/ai-chat/constants/aiChat';
import { answerAiChat } from '@/domain/ai-chat/server/aiChat.server';
import { logAiChat } from '@/domain/ai-chat/server/log.server';
import {
  AiChatLogMeta,
  AiChatMessage,
  AiChatUserSnapshot,
} from '@/domain/ai-chat/types/aiChat';
import { after } from 'next/server';

const LOG_FIELD_MAX_LENGTH = 200;

function str(value: unknown) {
  return typeof value === 'string' && value
    ? value.slice(0, LOG_FIELD_MAX_LENGTH)
    : null;
}

/** 클라이언트가 보낸 로그용 값은 아는 필드만 골라 길이를 자른다 */
function parseUser(raw: unknown): AiChatUserSnapshot | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const u = raw as Record<string, unknown>;
  return {
    userId: typeof u.userId === 'number' ? u.userId : null,
    name: str(u.name),
    email: str(u.email),
    contactEmail: str(u.contactEmail),
    phoneNum: str(u.phoneNum),
    nickname: str(u.nickname),
    university: str(u.university),
    major: str(u.major),
    grade: str(u.grade),
    careerType: str(u.careerType),
    wishField: str(u.wishField),
    wishJob: str(u.wishJob),
    wishIndustry: str(u.wishIndustry),
    wishEmploymentType: str(u.wishEmploymentType),
    wishCompany: str(u.wishCompany),
    inflowPath: str(u.inflowPath),
    authProvider: str(u.authProvider),
    marketingAgree:
      typeof u.marketingAgree === 'boolean' ? u.marketingAgree : null,
  };
}

function parseMeta(raw: unknown): AiChatLogMeta {
  const m = (typeof raw === 'object' && raw !== null ? raw : {}) as Record<
    string,
    unknown
  >;
  return {
    conversationId: str(m.conversationId),
    turnIndex: typeof m.turnIndex === 'number' ? m.turnIndex : null,
    anonId: str(m.anonId),
    device: m.device === 'mobile' || m.device === 'desktop' ? m.device : null,
  };
}

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

  const startedAt = Date.now();
  const result = await answerAiChat(query, history).catch(() => null);
  const latencyMs = Date.now() - startedAt;

  // 응답을 보낸 뒤에 저장해서 사용자 대기 시간에 영향을 주지 않는다
  after(() =>
    logAiChat({
      query,
      result,
      meta: parseMeta(body?.meta),
      user: parseUser(body?.user),
      latencyMs,
    }),
  );

  if (!result) {
    return Response.json(
      { message: '답변을 만들지 못했습니다.' },
      { status: 500 },
    );
  }
  return Response.json(result);
}
