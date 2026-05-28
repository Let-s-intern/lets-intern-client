/**
 * 채팅방 키 생성/파싱.
 *
 * 방 키 = `feedback_{feedbackId}`. 멘토/멘티가 BE 조인 없이 공유하는 유일한 숫자 ID인
 * `feedbackId`로 합성하므로, 양쪽이 동일 feedbackId면 반드시 동일 방으로 수렴한다 (PRD §3).
 */
const ROOM_PREFIX = 'feedback_';

export function chatRoomKey(feedbackId: number): string {
  return `${ROOM_PREFIX}${feedbackId}`;
}

export function feedbackIdFromRoomKey(room: string): number | null {
  if (!room.startsWith(ROOM_PREFIX)) return null;
  const raw = room.slice(ROOM_PREFIX.length);
  if (raw === '') return null;
  const id = Number(raw);
  return Number.isInteger(id) ? id : null;
}
