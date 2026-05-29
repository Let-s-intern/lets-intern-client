/**
 * 채팅 패키지 설정 상수.
 *
 * env 크로스번들러 문제(Next `process.env` vs Vite `import.meta.env`)를 피하기 위해
 * PB URL을 **상수 기본값**으로 둔다. 앱이 다른 인스턴스를 가리켜야 하면
 * `getChatClient(url)` 의 선택적 인자로 override 한다 (client.ts 참고).
 *
 * ⚠️ 임시·내부용 공개 인스턴스. 정식 BE 전환 시 패키지째 폐기 대상.
 */
export const DEFAULT_PB_URL =
  'https://pocketbase-vwp7yn8luvxu80x8qlqg9y0l.supabin.com';

/** PocketBase 컬렉션 이름 (PRD §6). */
export const COLLECTIONS = {
  rooms: 'chat_rooms',
  messages: 'chat_messages',
} as const;
