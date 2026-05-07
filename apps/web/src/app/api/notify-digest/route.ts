import { NextRequest } from 'next/server';
import { clearAll, peekAll, type DedupeEntry } from '@/utils/errorDedupe';

const DIGEST_TOP_N = 20;
const DIGEST_MESSAGE_PREVIEW_MAX = 200;

/**
 * 누적된 dedupe 에러를 Slack 으로 일괄 발송하는 cron 엔드포인트.
 * Vercel Cron 이 `vercel.json` 의 schedule 에 따라 GET 으로 호출.
 *
 * 인증:
 *  - production: `CRON_SECRET` 환경변수 필수. 미설정 시 500.
 *    (무인증 노출 시 누구나 GET 으로 store flush + Slack 스팸 발송 가능)
 *  - non-production: `CRON_SECRET` 미설정이어도 동작 (테스트 편의).
 *  - Vercel Cron 은 자동으로 `Authorization: Bearer <CRON_SECRET>` 헤더 주입.
 *
 * 발송 패턴 (peek → 성공 시 clear):
 *  - peekAll() 로 non-destructive read
 *  - webhook 성공 시에만 clearAll() — 실패 시 store 보존하여 다음 cron 재시도.
 *
 * 한계: errorDedupe 의 module Map 은 같은 lambda 인스턴스에서만 공유됨.
 *       다른 route handler(POST send-error-webhook)와 별 lambda 로 분리 deploy
 *       될 수 있어 store 비어있을 수 있음 (errorDedupe.ts 주석 참조).
 */
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';

  if (isProduction && !cronSecret) {
    console.error(
      '[Digest] production 에서 CRON_SECRET 미설정 — 무인증 위험으로 차단',
    );
    return Response.json(
      {
        success: false,
        message: 'CRON_SECRET 환경변수가 production 에서 설정되지 않았습니다.',
      },
      { status: 500 },
    );
  }

  if (cronSecret) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${cronSecret}`) {
      return Response.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 },
      );
    }
  }

  const entries = peekAll();
  if (entries.length === 0) {
    return Response.json({
      success: true,
      count: 0,
      message: '집계 항목 없음',
    });
  }

  const webhookUrl =
    process.env.NEXT_PUBLIC_ERROR_WEBHOOK_URL || process.env.ERROR_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn('[Digest] ERROR_WEBHOOK_URL 미설정 — digest 발송 불가');
    return Response.json({
      success: false,
      count: entries.length,
      message: 'webhook 미설정',
    });
  }

  const message = formatDigestForSlack(entries);

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });
    if (!res.ok) {
      throw new Error(`Slack ${res.status} ${res.statusText}`);
    }
    // 성공 시에만 store 비움 — 실패 시엔 보존하여 다음 cron / 수동 retry 가능.
    clearAll();
    return Response.json({ success: true, count: entries.length });
  } catch (e) {
    console.error('[Digest] Slack 발송 실패 — store 유지', e);
    return Response.json(
      {
        success: false,
        count: entries.length,
        error: e instanceof Error ? e.message : String(e),
      },
      { status: 500 },
    );
  }
}

const escapeSlack = (s: string): string =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // 특정 멘션(@channel/@here/@everyone) 만 막지 말고 모든 @ 를 중화하여
    // 의도치 않은 사용자 멘션·DM 트리거 방지.
    .replace(/@/g, '(at)');

// 표시 시각은 KST 기준 (운영진이 한국 시간으로 보는 게 자연스러움).
const hhmmKst = (iso: string): string =>
  new Date(iso).toLocaleTimeString('ko-KR', {
    timeZone: 'Asia/Seoul',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

const todayKst = (): string =>
  new Date().toLocaleDateString('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

function formatDigestForSlack(entries: DedupeEntry[]) {
  const today = todayKst();
  // peekAll() 가 이미 새 배열을 반환하므로 추가 복사 불필요.
  const sorted = entries.sort((a, b) => b.count - a.count);
  const top = sorted.slice(0, DIGEST_TOP_N);
  const totalEvents = entries.reduce((sum, e) => sum + e.count, 0);

  const blocks: Array<Record<string, unknown>> = [
    {
      type: 'header',
      text: { type: 'plain_text', text: `📊 일일 에러 디제스트 (${today})` },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `고유 *${entries.length}건* / 총 *${totalEvents}회* 발생`,
      },
    },
    { type: 'divider' },
    ...top.map((e) => ({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text:
          `*${escapeSlack(e.name)}* — ${escapeSlack(e.message.slice(0, DIGEST_MESSAGE_PREVIEW_MAX))}\n` +
          `📊 *${e.count}회* (첫: ${hhmmKst(e.firstSeen)} / 마지막: ${hhmmKst(e.lastSeen)})`,
      },
    })),
  ];

  if (entries.length > DIGEST_TOP_N) {
    blocks.push({
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `상위 ${DIGEST_TOP_N}건만 표시 (전체 ${entries.length}건)`,
        },
      ],
    });
  }

  return {
    text: `📊 일일 에러 디제스트 (${today}) — 고유 ${entries.length}건 / 총 ${totalEvents}회`,
    blocks,
  };
}
