import { z } from 'zod';

export const MenteeSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  avatarInitial: z.string().max(2),
  challengeTitle: z.string(),
  unreadCount: z.number().int().min(0),
  lastMessage: z.string().optional(),
  lastMessageAt: z.string().optional(),
});

export const MessageSchema = z.object({
  id: z.string(),
  menteeId: z.string(),
  sender: z.enum(['mentor', 'mentee']),
  text: z.string(),
  sentAt: z.string(),
});

export const ChatDataSchema = z.object({
  mentees: z.array(MenteeSchema),
  messages: z.array(MessageSchema),
});

export type Mentee = z.infer<typeof MenteeSchema>;
export type Message = z.infer<typeof MessageSchema>;
export type ChatData = z.infer<typeof ChatDataSchema>;
