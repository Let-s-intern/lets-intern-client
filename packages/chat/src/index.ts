// @letscareer/chat — 임시 멘토↔멘티 채팅 패키지 (PocketBase 기반).
// 정식 BE 채팅 전환 시 이 패키지 폴더만 삭제하면 된다 (PRD §5 삭제 용이성).
//
// 공개 API 배럴: 진입점만 노출한다. 세부 모듈은 서브경로 import 권장
// (예: `@letscareer/chat/hooks/useUnreadSummary`).
export { DEFAULT_PB_URL, COLLECTIONS } from './config';
export { getChatClient } from './client';
export { chatRoomKey, feedbackIdFromRoomKey } from './roomKey';
export {
  ChatRoleSchema,
  ChatMessageSchema,
  ChatRoomSchema,
  LAST_READ_FIELD,
  type ChatRole,
  type ChatMessage,
  type ChatRoom,
} from './schema';
export { useChatMessages } from './hooks/useChatMessages';
export { useChatRoom, type ChatRoomMeta } from './hooks/useChatRoom';
export {
  useUnreadSummary,
  isUnread,
  sumUnread,
} from './hooks/useUnreadSummary';
export { default as ChatThread } from './ui/ChatThread';
export { default as ChatComposer } from './ui/ChatComposer';
export { default as ChatModal, type ChatRoomListItem } from './ui/ChatModal';
export { default as ChatFloatingButton } from './ui/ChatFloatingButton';
export { MAX_BADGE, formatBadge } from './ui/badge';
