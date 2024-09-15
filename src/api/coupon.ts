import dayjs from 'dayjs';
import { z } from 'zod';

const couponType = z.enum(['PARTNERSHIP', 'EVENT', 'GRADE']);
export type CouponType = z.infer<typeof couponType>;

const couponProgramType = z.enum(['ALL', 'CHALLENGE', 'LIVE', 'VOD', 'REPORT']);
export type CouponProgramType = z.infer<typeof couponProgramType>;

export const couponInfoSchema = z
  .object({
    id: z.number().nullable().optional(),
    couponType: couponType.nullable().optional(),
    couponProgramTypeList: z.array(couponProgramType).nullable().optional(),
    name: z.string().nullable().optional(),
    code: z.string().nullable().optional(),
    discount: z.number().nullable().optional(),
    time: z.number().nullable().optional(),
    startDate: z.string().nullable().optional(),
    endDate: z.string().nullable().optional(),
    createDate: z.string().nullable().optional(),
  })
  .transform((data) => {
    return {
      ...data,
      startDate: data.startDate ? dayjs(data.startDate) : null,
      endDate: data.endDate ? dayjs(data.endDate) : null,
      createDate: data.createDate ? dayjs(data.createDate) : null,
    };
  });
