import { sendErrorToWebhook } from '@/utils/webhook';
import { headers } from 'next/headers';
import { NextRequest } from 'next/server';

/**
 * 클라이언트 사이드에서 발생한 에러를 webhook으로 전송하는 API 엔드포인트
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { error, url, userAgent, tags, extra } = body;

    if (!error || !error.message) {
      return Response.json(
        { success: false, message: '에러 정보가 필요합니다.' },
        { status: 400 },
      );
    }

    // 무시할 에러 메시지 목록
    const IGNORED_ERROR_MESSAGES = [
      'Minified React error #418', // React hydration error
      "null is not an object (evaluating 'b.parentNode')", // GTM script error in Mobile Safari
    ];

    if (IGNORED_ERROR_MESSAGES.some((msg) => error.message.includes(msg))) {
      return Response.json({ success: true, ignored: true });
    }

    // Error 객체 재구성
    const errorObj = new Error(error.message);
    errorObj.name = error.name || 'Error';
    errorObj.stack = error.stack;

    // 요청 정보 가져오기
    const headersList = await headers();
    const requestUserAgent =
      userAgent || headersList.get('user-agent') || undefined;
    const requestUrl = url || request.url;

    await sendErrorToWebhook(errorObj, {
      url: requestUrl,
      userAgent: requestUserAgent,
      tags,
      extra,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('[API] Webhook 전송 실패:', error);
    return Response.json(
      { success: false, message: 'Webhook 전송 실패' },
      { status: 500 },
    );
  }
}
