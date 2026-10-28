import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type FieldErrors } from 'react-hook-form';

import {
  MENTOR_APPLY_FIELD_ORDER,
  mentorApplyDefaultValues,
  mentorApplyFormSchema,
  type MentorApplyFormValues,
} from '../schema';

/** 에러가 난 필드 중 화면에서 가장 위에 있는 것으로 스크롤하고 포커스를 옮긴다 */
function scrollToFirstError(errors: FieldErrors<MentorApplyFormValues>) {
  const first = MENTOR_APPLY_FIELD_ORDER.find((name) => errors[name]);
  if (!first) return;

  const field = document.querySelector<HTMLElement>(`[data-field="${first}"]`);
  field?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  field
    ?.querySelector<HTMLElement>('input, textarea')
    ?.focus({ preventScroll: true });
}

export function useMentorApplyForm(
  onValid: (values: MentorApplyFormValues) => void | Promise<void>,
) {
  const form = useForm<MentorApplyFormValues>({
    resolver: zodResolver(mentorApplyFormSchema),
    defaultValues: mentorApplyDefaultValues,
    // 포커스는 scrollToFirstError 가 옮긴다. 기본 포커스는 스크롤을 즉시 튀게 만든다
    shouldFocusError: false,
  });

  return {
    form,
    onSubmit: form.handleSubmit(onValid, scrollToFirstError),
  };
}
