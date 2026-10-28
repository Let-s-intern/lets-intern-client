/** 조회 빈도 제한(429)인지. axios 인터셉터가 감싼 `ApiError` 의 `status` 를 본다 */
export function isRateLimited(error: unknown): boolean {
  return (error as { status?: unknown } | null)?.status === 429;
}
