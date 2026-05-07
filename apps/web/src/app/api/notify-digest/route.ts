import { NextRequest } from 'next/server';
import { flushAll, type DedupeEntry } from '@/utils/errorDedupe';

/**
 * 누적된 dedupe 에러를 Slack 으로 일괄 발송하는 cron 엔드포인트.
 * Vercel Cron 이 매일 새벽에 GET 으로 호출.
 *
 * 인증: `CRON_SECRET` 환경변수 설정 시 `Authorization: Bearer <secret>` 헤더 검증.
 *       (Vercel Cron 은 자동으로 이 헤더를 주입한다.)
 *
 * 한계: errorDedupe 의 Map 이 모듈 레벨이라 cron 호출 시점에 warm 상태인
 *       단일 인스턴스의 store 만 flush 된다 (apps/web/src/utils/errorDedupe.ts 의
 *       주석 참조).
 */
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${cronSecret}`) {
      return Response.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 },
      );
    }
  }

  const entries = flushAll();
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
    return Response.json({ success: true, count: entries.length });
  } catch (e) {
    console.error('[Digest] Slack 발송 실패', e);
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
    .replace(/@(channel|here|everyone)/gi, '(at)$1');

const hhmm = (iso: string): string => iso.slice(11, 16);

function formatDigestForSlack(entries: DedupeEntry[]) {
  const today = new Date().toISOString().slice(0, 10);
  const sorted = [...entries].sort((a, b) => b.count - a.count);
  const top = sorted.slice(0, 20);
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
          `*${escapeSlack(e.name)}* — ${escapeSlack(e.message.slice(0, 200))}\n` +
          `📊 *${e.count}회* (첫: ${hhmm(e.firstSeen)} / 마지막: ${hhmm(e.lastSeen)})`,
      },
    })),
  ];

  if (entries.length > 20) {
    blocks.push({
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `상위 20건만 표시 (전체 ${entries.length}건)`,
        },
      ],
    });
  }

  return {
    text: `📊 일일 에러 디제스트 (${today}) — 고유 ${entries.length}건 / 총 ${totalEvents}회`,
    blocks,
  };
}
