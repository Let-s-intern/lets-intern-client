import { z } from 'zod';

/**
 * SSO 리다이렉트 화이트리스트 (LC-3208, PRD 5.2).
 *
 * "SSO 로그인 성공 후 어디로 튈 수 있는가"를 서버가 판정하는 근거 테이블이다.
 * CORS 허용 origin 과는 별개다 — 이쪽은 오픈 리다이렉트 방어다.
 *
 * 서버: `GET/POST/PATCH/DELETE /api/v2/admin/sso/redirect-whitelist` (server Push 1)
 */

/**
 * 목록 한 행.
 *
 * `createDate` 만 무르게 받는다. 나머지 넷은 행을 이루는 값이라 비면 행 자체가 뜻이 없다 —
 * 서비스명 없는 화이트리스트나 URI 없는 화이트리스트는 운영이 판단할 수 없고,
 * 그런 행을 조용히 그려 두면 화면이 서버 계약 불일치를 감춘다.
 */
export const ssoRedirectWhitelistSchema = z.object({
  id: z.number(),
  serviceName: z.string(),
  allowedRedirectUri: z.string(),
  isActive: z.boolean(),
  createDate: z.string().nullable().optional(),
});

export type SsoRedirectWhitelist = z.infer<typeof ssoRedirectWhitelistSchema>;

/**
 * 목록 응답에서 배열을 꺼낸다.
 *
 * 작업 4.6에서 서버 Push 1 실제 코드(`SsoRedirectWhitelistV2AdminController.getSsoRedirectWhitelistList`)
 * 를 확인한 결과, 응답 `data` 는 래퍼 없이 **배열 그대로**다(`SuccessResponse.ok(responseDtos)`
 * 에서 `responseDtos` 가 곧바로 `List<SsoRedirectWhitelistResponseDto>`). 그래도 전처리를
 * 남겨 둔다 — 배열이면 그대로 통과시키므로 실제 계약과 다르게 동작하지 않고, 나중에 서버가
 * 래퍼 DTO 로 바뀌어도(이 저장소 다른 목록 API처럼) 화면 코드를 안 고쳐도 되게 한다.
 */
const unwrapList = (payload: unknown): unknown => {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === 'object') {
    const arrays = Object.values(payload).filter(Array.isArray);
    if (arrays.length === 1) return arrays[0];
  }
  return payload;
};

export const ssoRedirectWhitelistListSchema = z.preprocess(
  unwrapList,
  z.array(ssoRedirectWhitelistSchema),
);

/** POST 바디 (server Push 1 `CreateSsoRedirectWhitelistRequestDto`). */
export type CreateSsoRedirectWhitelistReq = {
  serviceName: string;
  allowedRedirectUri: string;
};

/**
 * PATCH 바디 (server Push 1 `UpdateSsoRedirectWhitelistRequestDto`).
 *
 * 화면이 쓰는 건 활성화 토글뿐이다. 서버는 URI 수정도 받지만, 등록된 URI 를 고치는 것은
 * 삭제 후 재등록과 위험도가 같아 이 화면에서는 열지 않는다.
 */
export type UpdateSsoRedirectWhitelistReq = {
  id: number;
  isActive: boolean;
};
