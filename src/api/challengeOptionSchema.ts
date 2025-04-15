import { z } from 'zod';

// 챌린지 옵션
export const challengeOptionSchema = z.object({
  challengeOptionId: z.number(),
  title: z.string().optional().nullable(),
  code: z.string().optional().nullable(),
  price: z.number().optional().nullable(),
  discountPrice: z.number().optional().nullable(),
});

export type ChallengeOption = z.infer<typeof challengeOptionSchema>;

// GET 챌린지 옵션 전체 목록
export const challengeOptionsSchema = z.object({
  challengeOptionList: z.array(challengeOptionSchema),
});
export type ChallengeOptions = z.infer<typeof challengeOptionsSchema>;

// POST 챌린지 옵션 생성 Request
export interface PostChallengeOptionReq {
  title: string;
  code: string;
  price: number;
  discountPrice: number;
}

// PATCH 챌린지 옵션 수정 Request
export interface PatchChallengeOptionReq {
  challengeOptionId: number | string;
  title?: string;
  code?: string;
  price?: number;
  discountPrice?: number;
}
