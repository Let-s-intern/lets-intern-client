import PocketBase from 'pocketbase';

import { DEFAULT_PB_URL } from './config';

/**
 * PocketBase 클라이언트 싱글톤.
 *
 * - 단일 인스턴스를 재사용해 realtime 연결(SSE)을 공유한다.
 * - `autoCancellation(false)`: 동일 컬렉션에 대한 동시 요청이 서로를 취소하지 않게 한다
 *   (realtime 구독 + 목록 fetch 충돌 방지).
 */
let instance: PocketBase | null = null;

export function getChatClient(url: string = DEFAULT_PB_URL): PocketBase {
  if (!instance) {
    instance = new PocketBase(url);
    instance.autoCancellation(false);
  }
  return instance;
}

/** 테스트 전용 — 싱글톤 초기화. */
export function __resetChatClient(): void {
  instance = null;
}
