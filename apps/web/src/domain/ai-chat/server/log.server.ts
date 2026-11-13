import 'server-only';

import {
  AiChatLogMeta,
  AiChatResponse,
  AiChatUserSnapshot,
} from '../types/aiChat';

const POCKETBASE_URL = process.env.POCKETBASE_URL;
const POCKETBASE_LOG_KEY = process.env.POCKETBASE_LOG_KEY;
const LOG_TIMEOUT_MS = 5_000;

/**
 * 사용자가 어떻게 묻는지 파악하려는 단기 수집. PocketBase `ai_chat_logs` 에 한 줄씩 쌓는다.
 * 환경변수가 없으면 아무것도 하지 않고, 실패해도 상담 응답에는 영향을 주지 않는다.
 */
export async function logAiChat({
  query,
  result,
  meta,
  user,
  latencyMs,
}: {
  query: string;
  result: AiChatResponse | null;
  meta: AiChatLogMeta;
  user: AiChatUserSnapshot | null;
  latencyMs: number;
}) {
  if (!POCKETBASE_URL || !POCKETBASE_LOG_KEY) return;

  const panel = result?.panel ?? null;
  const items =
    panel?.type === 'detail' ? [panel.detail.item] : (panel?.items ?? []);

  try {
    await fetch(`${POCKETBASE_URL}/api/collections/ai_chat_logs/records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-log-key': POCKETBASE_LOG_KEY,
      },
      body: JSON.stringify({
        query,
        answer: result?.answer ?? '',
        mode: result?.mode ?? 'error',
        panel_type: panel?.type ?? 'none',
        item_keys: items.map((i) => i.key),
        item_titles: items.map((i) => i.title),
        conversation_id: meta.conversationId ?? '',
        turn_index: meta.turnIndex,
        anon_id: meta.anonId ?? '',
        device: meta.device ?? '',
        latency_ms: latencyMs,
        user_id: user?.userId != null ? String(user.userId) : '',
        user_name: user?.name ?? '',
        user_email: user?.email ?? '',
        user_contact_email: user?.contactEmail ?? '',
        user_phone: user?.phoneNum ?? '',
        user_nickname: user?.nickname ?? '',
        university: user?.university ?? '',
        major: user?.major ?? '',
        grade: user?.grade ?? '',
        career_type: user?.careerType ?? '',
        wish_field: user?.wishField ?? '',
        wish_job: user?.wishJob ?? '',
        wish_industry: user?.wishIndustry ?? '',
        wish_employment_type: user?.wishEmploymentType ?? '',
        wish_company: user?.wishCompany ?? '',
        inflow_path: user?.inflowPath ?? '',
        auth_provider: user?.authProvider ?? '',
        marketing_agree: user?.marketingAgree ?? false,
      }),
      signal: AbortSignal.timeout(LOG_TIMEOUT_MS),
    });
  } catch (error) {
    console.error('[ai-chat] PocketBase 로그 저장 실패', error);
  }
}
