import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { ssoRedirectWhitelistListSchema } from '@/api/ssoSchema';

import { resetSsoRedirectWhitelists, ssoHandlers } from './sso';

/**
 * 목이 화면의 유일한 백엔드인 동안(server Push 1 이전), 목록·추가·토글·삭제가 한 흐름으로
 * 이어지는지 여기서 확인한다. 목이 상태를 안 물면 화면에서 등록해도 목록이 그대로다.
 */

const BASE = 'http://localhost/api/v2/admin/sso/redirect-whitelist';
const server = setupServer(...ssoHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();
  resetSsoRedirectWhitelists();
});
afterAll(() => server.close());

const fetchList = async () => {
  const res = await fetch(BASE);
  const body = (await res.json()) as { data: unknown };
  return ssoRedirectWhitelistListSchema.parse(body.data);
};

const create = (serviceName: string, allowedRedirectUri: string) =>
  fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ serviceName, allowedRedirectUri }),
  });

describe('SSO 리다이렉트 화이트리스트 목', () => {
  it('목록 응답이 스키마를 통과한다', async () => {
    const list = await fetchList();

    expect(list.length).toBeGreaterThan(0);
  });

  it('꺼진 항목이 처음부터 하나 있다', async () => {
    // 켜진 행만 있으면 비활성 표시를 눌러 보기 전까지 확인할 수 없다.
    const list = await fetchList();

    expect(list.some((item) => !item.isActive)).toBe(true);
  });

  it('추가하면 목록에 활성 상태로 들어온다', async () => {
    const res = await create('오공고', 'https://ogonggo.letscareer.co.kr/auth');

    expect(res.status).toBe(201);

    const added = (await fetchList()).find(
      (item) => item.serviceName === '오공고',
    );

    expect(added?.isActive).toBe(true);
  });

  it('이미 등록된 URL 은 409 로 거부한다', async () => {
    const list = await fetchList();
    const res = await create('중복 등록', list[0].allowedRedirectUri);

    expect(res.status).toBe(409);
    expect(await fetchList()).toHaveLength(list.length);
  });

  it('토글은 그 항목의 활성화 여부만 뒤집는다', async () => {
    const [target, ...others] = await fetchList();

    await fetch(`${BASE}/${target.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !target.isActive }),
    });

    const list = await fetchList();

    expect(list.find((item) => item.id === target.id)?.isActive).toBe(
      !target.isActive,
    );
    others.forEach((other) => {
      expect(list.find((item) => item.id === other.id)?.isActive).toBe(
        other.isActive,
      );
    });
  });

  it('삭제하면 목록에서 사라진다', async () => {
    const list = await fetchList();
    const res = await fetch(`${BASE}/${list[0].id}`, { method: 'DELETE' });

    expect(res.status).toBe(200);
    expect((await fetchList()).map((item) => item.id)).not.toContain(
      list[0].id,
    );
  });

  it('없는 항목을 지우면 404 다', async () => {
    const res = await fetch(`${BASE}/9999`, { method: 'DELETE' });

    expect(res.status).toBe(404);
  });
});
