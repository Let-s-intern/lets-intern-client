import { z } from 'zod';

import { ONE_TIME_FORM_SLUG_PATTERN } from '@/api/one-time-form/oneTimeFormSchema';
import dayjs from '@/lib/dayjs';

import type {
  OneTimeFormSettingsErrors,
  OneTimeFormSettingsField,
  OneTimeFormSettingsValues,
} from '../types/oneTimeFormSettings';

/**
 * 기본 정보·결제 설정 입력 검증. 길이와 slug 형식은 계약 5.6 의 서버 조건과 같다.
 * 서버가 같은 조건을 다시 보지만, 저장 전에 칸마다 이유를 보여 주려고 여기서 먼저 본다.
 */

const maxLength = (max: number) =>
  z.string().max(max, `${max}자 이하로 입력해 주세요.`);

const settingsFieldsSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, '폼 제목을 입력해 주세요.')
    .max(100, '100자 이하로 입력해 주세요.'),
  slug: z
    .string()
    .min(1, '주소를 입력해 주세요.')
    .min(3, '3자 이상 입력해 주세요.')
    .max(50, '50자 이하로 입력해 주세요.')
    .regex(
      ONE_TIME_FORM_SLUG_PATTERN,
      '영문 소문자와 숫자를 하이픈(-) 하나로 이어 주세요. 예: portfolio-1115',
    ),
  categoryText: maxLength(30),
  scheduleText: maxLength(50),
  startDate: z.string().min(1, '신청 시작 일시를 입력해 주세요.'),
  endDate: z.string().min(1, '신청 마감 일시를 입력해 주세요.'),
  completionMessage: maxLength(1000),
  basePrice: z
    .number({ invalid_type_error: '금액을 숫자로 입력해 주세요.' })
    .int('원 단위 정수로 입력해 주세요.')
    .nonnegative('0원 이상으로 입력해 주세요.'),
  paymentProductName: maxLength(100),
});

/** 계약 A2·A4 `ONE_TIME_FORM_INVALID_PERIOD` 와 같은 조건 */
const getPeriodErrors = ({
  startDate,
  endDate,
  cancelDeadline,
}: OneTimeFormSettingsValues): OneTimeFormSettingsErrors => {
  const errors: OneTimeFormSettingsErrors = {};
  if (!startDate) return errors;

  const start = dayjs(startDate);
  if (endDate && !dayjs(endDate).isAfter(start)) {
    errors.endDate = '신청 마감은 신청 시작보다 뒤여야 합니다.';
  }
  if (cancelDeadline && !dayjs(cancelDeadline).isAfter(start)) {
    errors.cancelDeadline = '취소 마감은 신청 시작보다 뒤여야 합니다.';
  }
  return errors;
};

/** 칸마다 첫 번째 오류 문구 하나. 빈 객체면 저장할 수 있다 */
export const validateOneTimeFormSettings = (
  values: OneTimeFormSettingsValues,
): OneTimeFormSettingsErrors => {
  const fieldErrors: OneTimeFormSettingsErrors = {};
  const result = settingsFieldsSchema.safeParse(values);
  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = issue.path[0] as OneTimeFormSettingsField;
      fieldErrors[field] ??= issue.message;
    }
  }
  // 비어 있음 같은 칸 자체의 오류가 기간 오류보다 먼저다
  return { ...getPeriodErrors(values), ...fieldErrors };
};
