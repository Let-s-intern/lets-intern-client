import { NextRequest } from 'next/server';

const DIGEST_TOP_N = 10;
const SENTRY_API_BASE = 'https://sentry.io/api/0';
const SENTRY_QUERY_LIMIT = 100;
const STATS_PERIOD = '24h';

/**
 * 누적된 에러 통계를 Slack 으로 발송하는 cron 엔드포인트.
 * Vercel Cron 이 `vercel.json` 의 schedule 에 따라 GET 으로 호출.
 *
 * 데이터 소스: **Sentry Issues API** (in-memory dedupe 가 아님)
 *  - Sentry 가 이미 fingerprint 로 grouping 하고 24h 기간 stats/level/tags 보관.
 *  - Vercel lambda 격리·인스턴스 분리 무관하게 정확한 통계.
 *
 * 인증:
 *  - production: `CRON_SECRET` 환경변수 필수. 미설정 시 500.
 *  - non-production: 미설정도 통과 (테스트 편의).
 *  - Vercel Cron 은 자동으로 `Authorization: Bearer <CRON_SECRET>` 헤더 주입.
 *
 * 필요 env:
 *  - `SENTRY_AUTH_TOKEN` (Settings → Account → API → Auth Tokens, 권한 event:read)
 *  - `SENTRY_ORG_SLUG` (예: 'letsintern')
 *  - `SENTRY_PROJECT_SLUG` 또는 `SENTRY_PROJECT_ID`
 *  - `ERROR_WEBHOOK_URL` 또는 `NEXT_PUBLIC_ERROR_WEBHOOK_URL` (Slack incoming)
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

  const sentryToken = process.env.SENTRY_AUTH_TOKEN;
  const orgSlug = process.env.SENTRY_ORG_SLUG;
  const projectSlug = process.env.SENTRY_PROJECT_SLUG;
  const projectId = process.env.SENTRY_PROJECT_ID;

  if (!sentryToken || !orgSlug) {
    return Response.json(
      {
        success: false,
        message: 'SENTRY_AUTH_TOKEN 또는 SENTRY_ORG_SLUG 미설정',
      },
      { status: 500 },
    );
  }

  let issues: SentryIssue[];
  try {
    issues = await fetchSentryIssues({
      token: sentryToken,
      orgSlug,
      projectSlug,
      projectId,
    });
  } catch (e) {
    console.error('[Digest] Sentry API 호출 실패', e);
    return Response.json(
      {
        success: false,
        error: e instanceof Error ? e.message : String(e),
        message: 'Sentry API 조회 실패',
      },
      { status: 500 },
    );
  }

  if (issues.length === 0) {
    return Response.json({
      success: true,
      count: 0,
      message: '24시간 내 unresolved issue 없음',
    });
  }

  const webhookUrl =
    process.env.NEXT_PUBLIC_ERROR_WEBHOOK_URL || process.env.ERROR_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn('[Digest] ERROR_WEBHOOK_URL 미설정 — digest 발송 불가');
    return Response.json({
      success: false,
      count: issues.length,
      message: 'webhook 미설정',
    });
  }

  const message = formatDigestForSlack(issues);

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });
    if (!res.ok) {
      throw new Error(`Slack ${res.status} ${res.statusText}`);
    }
    return Response.json({ success: true, count: issues.length });
  } catch (e) {
    console.error('[Digest] Slack 발송 실패', e);
    return Response.json(
      {
        success: false,
        count: issues.length,
        error: e instanceof Error ? e.message : String(e),
      },
      { status: 500 },
    );
  }
}

type SentryIssue = {
  id: string;
  shortId?: string;
  title: string;
  culprit?: string;
  level?: string;
  count: string | number;
  userCount?: number;
  firstSeen: string;
  lastSeen: string;
  permalink?: string;
  metadata?: { type?: string; value?: string };
  // tags 는 issues list endpoint 에선 포함되지 않을 수 있음. 필요 시 별도 호출.
};

async function fetchSentryIssues({
  token,
  orgSlug,
  projectSlug,
  projectId,
}: {
  token: string;
  orgSlug: string;
  projectSlug?: string;
  projectId?: string;
}): Promise<SentryIssue[]> {
  const params = new URLSearchParams({
    statsPeriod: STATS_PERIOD,
    query: 'is:unresolved',
    environment: 'production',
    limit: String(SENTRY_QUERY_LIMIT),
    sort: 'freq',
  });
  // project 필터: id 우선, 없으면 slug.
  if (projectId) {
    params.append('project', projectId);
  } else if (projectSlug) {
    params.append('project', projectSlug);
  }

  const url = `${SENTRY_API_BASE}/organizations/${encodeURIComponent(orgSlug)}/issues/?${params.toString()}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Sentry ${res.status} ${res.statusText}: ${body.slice(0, 200)}`);
  }
  return (await res.json()) as SentryIssue[];
}

const escapeSlack = (s: string): string =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/@/g, '(at)');

const todayKst = (): string =>
  new Date().toLocaleDateString('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

const hhmmKst = (iso: string): string =>
  new Date(iso).toLocaleTimeString('ko-KR', {
    timeZone: 'Asia/Seoul',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

/**
 * 백분율 → block 문자 막대 (최대 width 25칸).
 */
function bar(percent: number, width = 25): string {
  const filled = Math.max(0, Math.min(width, Math.round((percent / 100) * width)));
  return '█'.repeat(filled) + '░'.repeat(width - filled);
}

function formatDigestForSlack(issues: SentryIssue[]) {
  const today = todayKst();

  // 1) 발생 요약
  const totalEvents = issues.reduce((s, i) => s + Number(i.count ?? 0), 0);
  const totalUsers = issues.reduce((s, i) => s + (i.userCount ?? 0), 0);
  const uniqueIssues = issues.length;

  // 2) Level 별 분포
  const byLevel = new Map<string, number>();
  for (const i of issues) {
    const level = i.level ?? 'unknown';
    byLevel.set(level, (byLevel.get(level) ?? 0) + Number(i.count ?? 0));
  }
  const levelLines = [...byLevel.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([level, cnt]) => {
      const pct = totalEvents === 0 ? 0 : (cnt / totalEvents) * 100;
      return `${level.padEnd(8)} ${bar(pct)} ${pct.toFixed(1)}% (${cnt}회)`;
    });

  // 3) Type 별 분포 (metadata.type 또는 title 첫 단어)
  const byType = new Map<string, number>();
  for (const i of issues) {
    const type = i.metadata?.type ?? extractType(i.title) ?? 'Unknown';
    byType.set(type, (byType.get(type) ?? 0) + Number(i.count ?? 0));
  }
  const typeLines = [...byType.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([type, cnt]) => {
      const pct = totalEvents === 0 ? 0 : (cnt / totalEvents) * 100;
      return `${type.slice(0, 16).padEnd(16)} ${bar(pct, 20)} ${pct.toFixed(1)}% (${cnt}회)`;
    });

  // 4) Top N 상세
  const topIssues = issues.slice(0, DIGEST_TOP_N);

  const blocks: Array<Record<string, unknown>> = [
    {
      type: 'header',
      text: { type: 'plain_text', text: `📊 일일 에러 디제스트 (${today})` },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text:
          `📈 *발생 요약 (최근 24시간 / production)*\n` +
          `• 고유 이슈 *${uniqueIssues}건*\n` +
          `• 총 이벤트 *${totalEvents}회*\n` +
          `• 영향 사용자 약 *${totalUsers}명*`,
      },
    },
  ];

  if (levelLines.length > 0) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `🏷️ *Level 분포*\n\`\`\`\n${levelLines.join('\n')}\n\`\`\``,
      },
    });
  }

  if (typeLines.length > 0) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `🔥 *에러 종류 Top 5*\n\`\`\`\n${typeLines.join('\n')}\n\`\`\``,
      },
    });
  }

  blocks.push({ type: 'divider' });
  blocks.push({
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `🏆 *상위 ${Math.min(DIGEST_TOP_N, topIssues.length)} 이슈 상세*`,
    },
  });

  topIssues.forEach((i, idx) => {
    const titleSafe = escapeSlack((i.title || '(no title)').slice(0, 200));
    const culprit = i.culprit ? escapeSlack(i.culprit.slice(0, 100)) : '-';
    const link = i.permalink
      ? ` (<${i.permalink}|${i.shortId ?? i.id}>)`
      : '';
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text:
          `*${idx + 1}.* ${titleSafe}${link}\n` +
          `📊 *${i.count}회* / 사용자 *${i.userCount ?? 0}명* | level: \`${i.level ?? '-'}\`\n` +
          `📍 ${culprit}\n` +
          `🕒 첫: ${hhmmKst(i.firstSeen)} / 마지막: ${hhmmKst(i.lastSeen)}`,
      },
    });
  });

  if (issues.length > DIGEST_TOP_N) {
    blocks.push({
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `상위 ${DIGEST_TOP_N}건만 표시 — 전체 ${issues.length}건은 Sentry 대시보드 참조`,
        },
      ],
    });
  }

  return {
    text: `📊 일일 에러 디제스트 (${today}) — 고유 ${uniqueIssues}건 / 총 ${totalEvents}회`,
    blocks,
  };
}

function extractType(title: string | undefined): string | undefined {
  if (!title) return undefined;
  // "TypeError: foo" 또는 "TypeError" 패턴에서 타입명만 추출
  const m = title.match(/^([A-Z][A-Za-z0-9_]*Error|[A-Z][A-Za-z0-9_]+):/);
  return m?.[1];
}
