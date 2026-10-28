import {
  toMentorApplicationRequest,
  type MentorApplyFormValues,
} from '../schema';

/**
 * multipart 본문. `request` 는 JSON 파트, 새 파일이 있으면 `file` 파트를 더한다.
 * 서류 정리 문서를 골랐으면 `request.userDocumentId` 로만 보내고 `file` 은 붙이지 않는다
 */
export function toMentorApplicationFormData(
  values: MentorApplyFormValues,
): FormData {
  const request = toMentorApplicationRequest(values);
  const formData = new FormData();
  formData.append(
    'request',
    new Blob([JSON.stringify(request)], {
      type: 'application/json',
    }),
  );
  if (values.attachment && request.userDocumentId === undefined) {
    formData.append('file', values.attachment);
  }
  return formData;
}
