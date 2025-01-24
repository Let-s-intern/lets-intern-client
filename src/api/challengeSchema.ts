import { z } from 'zod';

export const challengeGoalSchema = z.object({
  goal: z.string().nullable(),
});
