import { handlers as sharedHandlers } from '@letscareer/mocks';
import type { RequestHandler } from 'msw';

/**
 * 1대1 라이브 멘토링 관리자 목 핸들러.
 *
 * 계약과 상태 전이(제출 → 승인 → 개설 → 종료)는 공유 목(`@letscareer/mocks`)이
 * 이미 갖고 있으므로, 여기서 픽스처를 다시 만들지 않고 **라이브 멘토링 경로만 골라** 쓴다.
 * 목을 두 벌 두면 한쪽만 계약을 따라가 어긋나기 시작한다.
 *
 * 전체를 펼치지 않는 이유: 공유 목에는 web/mentor 용 핸들러도 들어 있어
 * 어드민과 무관한 요청까지 가로챈다.
 */
export const adminLiveMentoringHandlers: RequestHandler[] =
  sharedHandlers.filter((handler) =>
    String(
      (handler as { info?: { path?: unknown } }).info?.path ?? '',
    ).includes('live-mentoring'),
  );
