import { afterEach, describe, expect, it, vi } from 'vitest';

const autoCancellation = vi.fn();

vi.mock('pocketbase', () => ({
  default: class PocketBaseMock {
    baseUrl: string;
    autoCancellation = autoCancellation;
    constructor(url: string) {
      this.baseUrl = url;
    }
  },
}));

import { __resetChatClient, getChatClient } from './client';
import { DEFAULT_PB_URL } from './config';

describe('getChatClient', () => {
  afterEach(() => {
    __resetChatClient();
    autoCancellation.mockClear();
  });

  it('여러 번 호출해도 동일 인스턴스를 반환한다 (싱글톤)', () => {
    const a = getChatClient();
    const b = getChatClient();
    expect(a).toBe(b);
  });

  it('기본 URL은 config 상수를 사용한다', () => {
    const client = getChatClient() as unknown as { baseUrl: string };
    expect(client.baseUrl).toBe(DEFAULT_PB_URL);
  });

  it('생성 시 autoCancellation(false)로 realtime 충돌을 차단한다', () => {
    getChatClient();
    expect(autoCancellation).toHaveBeenCalledWith(false);
    expect(autoCancellation).toHaveBeenCalledTimes(1);
  });

  it('최초 호출의 override URL만 반영된다 (이후 호출은 무시)', () => {
    const first = getChatClient('https://custom.example.com') as unknown as {
      baseUrl: string;
    };
    expect(first.baseUrl).toBe('https://custom.example.com');
    const second = getChatClient('https://other.example.com');
    expect(second).toBe(first as unknown as typeof second);
  });
});
