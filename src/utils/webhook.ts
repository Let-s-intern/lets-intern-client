/**
 * 에러 정보를 webhook으로 전송하는 유틸리티 함수
 */

interface ErrorData {
  message: string;
  name?: string;
  stack?: string;
  url?: string;
  userAgent?: string;
  timestamp: string;
  environment?: string;
  level?: 'error' | 'warning' | 'info';
  tags?: Record<string, string | number | boolean | null | undefined>;
  extra?: Record<string, unknown>;
}

interface MessageTemplate {
  basic: {
    title: string;
    message: string;
    stackTrace: string;
  };
  detailed: {
    title: string;
    message: string;
    stackTrace: string;
    url?: string;
    userAgent?: string;
    environment?: string;
    tags?: Record<string, string | number | boolean | null | undefined>;
    extra?: Record<string, unknown>;
  };
}

/**
 * 에러 데이터를 Slack 메시지 형식으로 변환합니다.
 */
function formatErrorForSlack(errorData: ErrorData): MessageTemplate {
  const stackTrace = errorData.stack
    ? errorData.stack.split('\n').slice(0, 10).join('\n') // 최대 10줄만
    : '스택 트레이스 없음';

  return {
    basic: {
      title: `🚨 ${errorData.name || 'Error'}`,
      message: errorData.message || 'Unknown error',
      stackTrace,
    },
    detailed: {
      title: `🚨 ${errorData.name || 'Error'}`,
      message: errorData.message || 'Unknown error',
      stackTrace,
      url: errorData.url,
      userAgent: errorData.userAgent,
      environment: errorData.environment,
      tags: errorData.tags,
      extra: errorData.extra,
    },
  };
}

/**
 * 텍스트를 Slack에서 안전하게 표시할 수 있도록 이스케이프합니다.
 */
function escapeSlackText(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * 코드 블록 내부에서 사용할 수 있도록 텍스트를 안전하게 처리합니다.
 * 백틱이 연속으로 3개 이상 있으면 코드 블록 파싱 오류가 발생할 수 있으므로 처리합니다.
 */
function sanitizeForCodeBlock(text: string): string {
  // 연속된 백틱 3개 이상을 2개로 변경 (코드 블록 파싱 오류 방지)
  return text.replace(/```+/g, '``');
}

/**
 * 텍스트를 길이 제한 내에서 자릅니다.
 */
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Slack Block Kit 형식으로 메시지를 생성합니다.
 */
function createSlackMessage(template: MessageTemplate) {
  const { basic, detailed } = template;

  // 기본 텍스트 (fallback) - 3000자 제한
  const text = truncateText(
    `🚨 에러 발생\n\n*${basic.title}*\n${basic.message}`,
    3000,
  );

  // 에러 메시지와 스택 트레이스를 안전하게 처리 (코드 블록용으로 길이 제한)
  const errorMessage = truncateText(sanitizeForCodeBlock(basic.message), 2700);
  const stackTrace = truncateText(sanitizeForCodeBlock(basic.stackTrace), 2700);

  // Blocks 구성 (타입을 유연하게 처리)
  const blocks: Array<Record<string, unknown>> = [
    {
      type: 'header' as const,
      text: {
        type: 'plain_text' as const,
        text: truncateText(basic.title, 150), // header는 150자 제한
        emoji: true,
      },
    },
    {
      type: 'section' as const,
      text: {
        type: 'mrkdwn' as const,
        text: `*에러 메시지:*\n\`\`\`${errorMessage}\`\`\``,
      },
    },
    {
      type: 'section' as const,
      text: {
        type: 'mrkdwn' as const,
        text: `*스택 트레이스:*\n\`\`\`${stackTrace}\`\`\``,
      },
    },
  ];

  // 상세 정보가 있는 경우 추가
  const fields: Array<{ type: 'mrkdwn'; text: string }> = [];

  if (detailed.url) {
    fields.push({
      type: 'mrkdwn',
      text: `*URL:*\n${truncateText(escapeSlackText(detailed.url), 2000)}`,
    });
  }

  if (detailed.environment) {
    fields.push({
      type: 'mrkdwn',
      text: `*Environment:*\n${escapeSlackText(detailed.environment)}`,
    });
  }

  if (detailed.userAgent) {
    fields.push({
      type: 'mrkdwn',
      text: `*User Agent:*\n${truncateText(escapeSlackText(detailed.userAgent), 2000)}`,
    });
  }

  if (fields.length > 0) {
    blocks.push({
      type: 'section',
      fields,
    });
  }

  // Tags가 있는 경우
  if (detailed.tags && Object.keys(detailed.tags).length > 0) {
    const tagsText = Object.entries(detailed.tags)
      .slice(0, 10) // 최대 10개만 (fields 제한)
      .map(([key, value]) => {
        const valueStr = String(value ?? 'null');
        return `*${escapeSlackText(key)}:* ${escapeSlackText(valueStr)}`;
      })
      .join('\n');

    blocks.push({
      type: 'section' as const,
      text: {
        type: 'mrkdwn' as const,
        text: truncateText(`*Tags:*\n${tagsText}`, 3000),
      },
    });
  }

  // Extra 정보가 있는 경우
  if (detailed.extra && Object.keys(detailed.extra).length > 0) {
    const extraText = Object.entries(detailed.extra)
      .slice(0, 5) // 최대 5개만
      .map(([key, value]) => {
        let valueStr: string;
        try {
          valueStr =
            typeof value === 'object'
              ? JSON.stringify(value, null, 2)
              : String(value);
        } catch {
          valueStr = String(value);
        }
        const escapedValue = truncateText(escapeSlackText(valueStr), 500);
        return `*${escapeSlackText(key)}:* \`\`\`${escapedValue}\`\`\``;
      })
      .join('\n');

    blocks.push({
      type: 'section' as const,
      text: {
        type: 'mrkdwn' as const,
        text: truncateText(`*추가 정보:*\n${extraText}`, 3000),
      },
    });
  }

  // 타임스탬프 추가
  blocks.push({
    type: 'context',
    elements: [
      {
        type: 'mrkdwn',
        text: `⏰ ${new Date().toLocaleString('ko-KR', {
          timeZone: 'Asia/Seoul',
        })}`,
      },
    ],
  });

  return {
    text,
    blocks,
  };
}

/**
 * Webhook으로 에러 정보를 전송합니다.
 * @param error - 에러 객체
 * @param additionalInfo - 추가 정보 (URL, 사용자 정보 등)
 */
export async function sendErrorToWebhook(
  error: Error,
  additionalInfo?: {
    url?: string;
    userAgent?: string;
    tags?: Record<string, string | number | boolean | null | undefined>;
    extra?: Record<string, unknown>;
  },
): Promise<void> {
  // 클라이언트와 서버 모두에서 환경 변수 확인
  const webhookUrl =
    process.env.NEXT_PUBLIC_ERROR_WEBHOOK_URL || process.env.ERROR_WEBHOOK_URL;

  // Webhook URL이 설정되지 않은 경우 로그 출력 후 실패
  if (!webhookUrl) {
    console.warn(
      '[Webhook] ERROR_WEBHOOK_URL 환경 변수가 설정되지 않았습니다.',
    );
    return;
  }

  const errorData: ErrorData = {
    message: error.message || 'Unknown error',
    name: error.name,
    stack: error.stack,
    url: additionalInfo?.url,
    userAgent: additionalInfo?.userAgent,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    level: 'error',
    tags: additionalInfo?.tags,
    extra: additionalInfo?.extra,
  };

  // Slack 메시지 형식으로 변환
  const messageTemplate = formatErrorForSlack(errorData);
  const slackMessage = createSlackMessage(messageTemplate);

  try {
    console.log('[Webhook] Slack으로 에러 전송 시도:', {
      url: webhookUrl.substring(0, 50) + '...',
      errorName: error.name,
      errorMessage: error.message,
    });

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(slackMessage),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `[Webhook] 전송 실패: ${response.status} ${response.statusText}`,
        errorText,
      );
      // 디버깅을 위해 전송하려던 메시지도 로그에 출력
      console.error(
        '[Webhook] 전송하려던 메시지:',
        JSON.stringify(slackMessage, null, 2),
      );
    } else {
      console.log('[Webhook] Slack으로 에러 전송 성공');
    }
  } catch (webhookError) {
    // Webhook 전송 실패는 조용히 로그만 남김 (무한 루프 방지)
    console.error('[Webhook] 전송 중 오류 발생:', webhookError);
  }
}
