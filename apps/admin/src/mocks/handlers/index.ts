import type { RequestHandler } from 'msw';

import { adminFeedbackHandlers } from './adminFeedback';

/**
 * MSW 핸들러 집합.
 *
 * 핸들러는 도메인별 파일로 분리하고 여기서 합친다.
 * (예: adminFeedback.ts → adminFeedbackHandlers)
 * BE 미병합 API를 목으로 동작시키기 위한 용도이며,
 * VITE_ENABLE_MSW=true 일 때만 활성화된다.
 */
export const handlers: RequestHandler[] = [...adminFeedbackHandlers];
