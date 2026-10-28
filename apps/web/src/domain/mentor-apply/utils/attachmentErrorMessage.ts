/** 서버 첨부 검증 실패 코드와 첨부 필드에 띄울 문구. 문구는 스키마의 클라이언트 검증과 같다 */
const ATTACHMENT_ERROR_MESSAGES: Record<string, string> = {
  MENTOR_APPLICATION_ATTACHMENT_NOT_PDF: 'PDF 파일만 첨부해 주세요.',
  MENTOR_APPLICATION_ATTACHMENT_TOO_LARGE: '10MB 이하 파일만 첨부해 주세요.',
};

/**
 * 제출 에러가 첨부 검증 실패면 그 문구, 아니면 undefined.
 * axios 인터셉터가 응답 에러를 서버 `code` 를 담은 `ApiError` 로 감싸므로 `code` 만 본다
 */
export function attachmentErrorMessage(error: unknown): string | undefined {
  const code = (error as { code?: unknown } | null)?.code;
  return typeof code === 'string' ? ATTACHMENT_ERROR_MESSAGES[code] : undefined;
}
