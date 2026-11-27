import { handlers as sharedHandlers } from '@letscareer/mocks';
import { HttpResponse, http, type RequestHandler } from 'msw';

/** 서버 검증 범위. 30분 1,000~100,000원, 60분 1,000~200,000원. */
const MIN_PRICE = 1_000;
const MAX_PRICE_BY_DURATION: Record<number, number> = {
  30: 100_000,
  60: 200_000,
};

/**
 * PUT /admin/live-mentoring/mentors/:mentorId/prices — 멘토별 가격 조정.
 *
 * 공유 목에는 가격 조정이 없어 여기서 받는다. 서버와 같은 범위 검증만 흉내내고
 * 상태는 저장하지 않는다(목록 응답은 공유 목이 서빙한다).
 */
const adminLiveMentoringPriceHandlers: RequestHandler[] = [
  http.put(
    '*/admin/live-mentoring/mentors/:mentorId/prices',
    async ({ request }) => {
      const body = (await request.json().catch(() => ({}))) as {
        prices?: { duration: number; price: number }[];
      };
      const prices = body.prices ?? [];
      const durations = prices.map(({ duration }) => duration);
      const invalid =
        new Set(durations).size !== durations.length ||
        prices.some(
          ({ duration, price }) =>
            !(duration in MAX_PRICE_BY_DURATION) ||
            price < MIN_PRICE ||
            price > MAX_PRICE_BY_DURATION[duration],
        );
      if (invalid) {
        return HttpResponse.json(
          {
            status: 400,
            code: 'INVALID_VALUE',
            message: '가격 범위를 확인해주세요.',
          },
          { status: 400 },
        );
      }
      return HttpResponse.json({ status: 200, data: null });
    },
  ),
];

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
export const adminLiveMentoringHandlers: RequestHandler[] = [
  ...adminLiveMentoringPriceHandlers,
  ...sharedHandlers.filter((handler) =>
    String(
      (handler as { info?: { path?: unknown } }).info?.path ?? '',
    ).includes('live-mentoring'),
  ),
];
