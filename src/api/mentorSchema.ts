import { z } from 'zod';

/** 챌린지 멘토 목록 */
// export const adminChallengeMentorListSchema = z.object({
//   applicationList: z.array(
//     z.object({
//       application: z.object({
//         id: z.number(),
//         paymentId: z.number(),
//         name: z.string().nullable().optional(),
//         email: z.string().nullable().optional(),
//         phoneNum: z.string().nullable().optional(),
//         university: z.string().nullable().optional(),
//         grade: z.string().nullable().optional(),
//         major: z.string().nullable().optional(),
//         couponName: z.string().nullable().optional(),
//         couponDiscount: z.number().default(0),
//         finalPrice: z.number().default(0),
//         programPrice: z.number().default(0),
//         programDiscount: z.number().default(0),
//         refundPrice: z.number().default(0),
//         orderId: z.string(),
//         isCanceled: z.boolean().default(false),
//         wishJob: z.string().nullable().optional(),
//         wishCompany: z.string().nullable().optional(),
//         inflowPath: z.string().nullable().optional(),
//         createDate: z.string(),
//         accountType: z.string().nullable().optional(),
//         accountNum: z.string().nullable().optional(),
//         challengePricePlanType: ChallengePricePlanEnum.default('BASIC'),
//       }),
//       optionPriceSum: z.number().default(0),
//       optionDiscountPriceSum: z.number().default(0),
//     }),
//   ),
// });

/** 멘토 전체 목록 */
export const adminUserMentorList = z.object({
  mentorList: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
    }),
  ),
});

export type AdminUserMentorList = z.infer<typeof adminUserMentorList>;
