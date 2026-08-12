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
 * `createdAt` 만 무르게 받는다. 나머지 넷은 행을 이루는 값이라 비면 행 자체가 뜻이 없다 —
 * 서비스명 없는 화이트리스트나 URI 없는 화이트리스트는 운영이 판단할 수 없고,
 * 그런 행을 조용히 그려 두면 화면이 서버 계약 불일치를 감춘다.
 */
export const ssoRedirectWhitelistSchema = z.object({
  id: z.number(),
  serviceName: z.string(),
  allowedRedirectUri: z.string(),
  isActive: z.boolean(),
  createdAt: z.string().nullable().optional(),
});

export type SsoRedirectWhitelist = z.infer<typeof ssoRedirectWhitelistSchema>;

/**
 * 목록 응답에서 배열을 꺼낸다.
 *
 * 서버 Push 1 이 아직 없어 **감싸는 키 이름이 확정되지 않았다.** 이 저장소의 다른 목록은
 * `{ bannerList: [...] }`·`{ accessLogList: [...] }` 처럼 이름 붙은 래퍼를 쓰고, 서버도
 * `GetFaqResponseDto` 처럼 래퍼 DTO 를 두는 편이지만 단순 배열로 내려올 수도 있다.
 *
 * 그래서 키 이름을 찍지 않고 "배열이면 그대로, 배열 하나만 든 객체면 그 배열" 로 푼다.
 * 둘 다 아니면 아래 `z.array` 가 그대로 실패한다 — 모양이 어긋난 응답을 빈 목록으로
 * 흘려보내지 않는다. 실제 계약은 작업 4.6(실서버 연동 확인)에서 확정한다.
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
