import { z } from 'zod';

import { toPhoneDigits } from '../utils/formatPhone';

/** 서버 `/status` 의 전화번호 검증과 같은 규칙. 숫자만 남긴 값으로 검사한다 */
const PHONE_PATTERN = /^01[0-9]{8,9}$/;

export const guestLookupSchema = z.object({
  name: z.string().trim().min(1, '성함을 입력해 주세요.'),
  phoneNum: z
    .string()
    .trim()
    .min(1, '연락처를 입력해 주세요.')
    .refine(
      (v) => PHONE_PATTERN.test(toPhoneDigits(v)),
      '올바른 연락처를 입력해 주세요.',
    ),
});

export type GuestLookupValues = z.infer<typeof guestLookupSchema>;
