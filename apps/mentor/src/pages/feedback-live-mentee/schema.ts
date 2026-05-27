import { z } from 'zod';

/**
 * 멘티 목록 행 한 건. (멘티 관리 좌측 목록)
 *
 * 실 데이터는 `GET /feedback/mentor` 의 `FeedbackMentor`(라이브 피드백) 에서
 * `menteeName`+`programTitle` 쌍으로 distinct 파생한다.
 * email·채팅 필드(unreadCount/lastMessage/lastMessageAt)는 BE에 없어 제거했다.
 * (채팅 BE 구현 시 별도 채팅 스키마로 보강 예정)
 */
export const MenteeSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatarInitial: z.string().max(2),
  challengeTitle: z.string(),
});

export type Mentee = z.infer<typeof MenteeSchema>;
