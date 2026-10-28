import {
  toMentorApplicationRequest,
  type MentorApplyFormValues,
} from '../schema';

/** multipart 본문. `request` 는 JSON 파트, 첨부가 있으면 `file` 파트를 더한다 */
export function toMentorApplicationFormData(
  values: MentorApplyFormValues,
): FormData {
  const formData = new FormData();
  formData.append(
    'request',
    new Blob([JSON.stringify(toMentorApplicationRequest(values))], {
      type: 'application/json',
    }),
  );
  if (values.attachment) formData.append('file', values.attachment);
  return formData;
}
