import { http, HttpResponse } from 'msw';

import type { SsoRedirectWhitelist } from '@/api/ssoSchema';

import { seedSsoRedirectWhitelists } from '../seed/sso';

/**
 * SSO 리다이렉트 화이트리스트 MSW 핸들러 (LC-3208).
 *
 * server Push 1 이 아직 없어 이 목이 유일한 백엔드다. 목록·추가·토글·삭제가 한 흐름으로
 * 이어져야 화면을 실제로 확인할 수 있으므로 시드를 메모리에서 변경한다(읽기 전용 목과 다름).
 *
 * 서버 응답은 `SuccessResponse<T>` 라 본문이 `{ status, message, data }` 다.
 * 화면은 `res.data.data` 만 보므로 여기서도 `data` 로 감싼다.
 *
 * 목록 응답은 **배열을 그대로** 내려보낸다. 래퍼 키 이름은 서버가 정하기 전까지 지어낼 수
 * 없고, 스키마가 두 모양을 모두 받는다(`ssoRedirectWhitelistListSchema`).
 */

const BASE = '*/api/v2';
const PATH = `${BASE}/admin/sso/redirect-whitelist`;

let whitelists: SsoRedirectWhitelist[] = [...seedSsoRedirectWhitelists];
let nextId = Math.max(...seedSsoRedirectWhitelists.map((item) => item.id)) + 1;

/** 테스트가 서로의 변경을 물려받지 않게 되돌린다. */
export const resetSsoRedirectWhitelists = () => {
  whitelists = [...seedSsoRedirectWhitelists];
  nextId = Math.max(...seedSsoRedirectWhitelists.map((item) => item.id)) + 1;
};

export const ssoHandlers = [
  http.get(PATH, () => HttpResponse.json({ data: whitelists })),

  http.post(PATH, async ({ request }) => {
    const body = (await request.json()) as {
      serviceName?: string;
      allowedRedirectUri?: string;
    };

    if (!body.serviceName || !body.allowedRedirectUri) {
      return HttpResponse.json(
        { status: 400, message: '서비스명과 허용 URL 은 필수입니다.' },
        { status: 400 },
      );
    }

    /*
      같은 URI 를 두 번 등록하면 어느 행을 꺼야 접근이 막히는지 알 수 없다.
      서버도 중복 URI 를 거부한다(server Push 1 `SsoErrorCode`).
    */
    if (
      whitelists.some(
        (item) => item.allowedRedirectUri === body.allowedRedirectUri,
      )
    ) {
      return HttpResponse.json(
        { status: 409, message: '이미 등록된 URL 입니다.' },
        { status: 409 },
      );
    }

    const created: SsoRedirectWhitelist = {
      id: nextId++,
      serviceName: body.serviceName,
      allowedRedirectUri: body.allowedRedirectUri,
      // 등록 즉시 열린다. 꺼진 채로 만들면 등록했는데 로그인이 안 된다는 문의가 늘 붙는다.
      isActive: true,
      createDate: new Date().toISOString(),
    };
    whitelists = [...whitelists, created];

    return HttpResponse.json({ data: created }, { status: 201 });
  }),

  http.patch(`${PATH}/:id`, async ({ params, request }) => {
    const id = Number(params.id);
    const body = (await request.json()) as { isActive?: boolean };
    const target = whitelists.find((item) => item.id === id);

    if (!target) return new HttpResponse(null, { status: 404 });

    const updated = { ...target, isActive: body.isActive ?? target.isActive };
    whitelists = whitelists.map((item) => (item.id === id ? updated : item));

    return HttpResponse.json({ data: updated });
  }),

  http.delete(`${PATH}/:id`, ({ params }) => {
    const id = Number(params.id);

    if (!whitelists.some((item) => item.id === id)) {
      return new HttpResponse(null, { status: 404 });
    }

    whitelists = whitelists.filter((item) => item.id !== id);

    return HttpResponse.json({ data: null });
  }),
];
