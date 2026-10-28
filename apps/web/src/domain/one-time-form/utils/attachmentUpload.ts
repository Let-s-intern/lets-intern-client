import {
  ATTACHMENT_NAME_MAX_LENGTH,
  FILE_EXTENSIONS,
  IMAGE_EXTENSIONS,
  extensionOf,
} from './answerValidation';

export type AttachmentKind = 'IMAGE' | 'FILE';

const MB = 1024 * 1024;

/** 계약 5.3: 확장자와 용량. 용량은 서명 PUT 이 막지 못해 화면에서만 검사한다(계약 17절) */
export const ATTACHMENT_RULES: Record<
  AttachmentKind,
  { extensions: string[]; maxMegabytes: number }
> = {
  IMAGE: { extensions: IMAGE_EXTENSIONS, maxMegabytes: 10 },
  FILE: { extensions: FILE_EXTENSIONS, maxMegabytes: 20 },
};

/**
 * 업로드 URL 을 받기 전에 확장자·용량·이름 길이를 본다.
 * 통과하면 null, 아니면 칸 아래에 띄울 문구.
 */
export const precheckAttachmentFile = (
  kind: AttachmentKind,
  file: { name: string; size: number },
): string | null => {
  const { extensions, maxMegabytes } = ATTACHMENT_RULES[kind];
  if (!extensions.includes(extensionOf(file.name)))
    return `${extensions.join(', ')} 파일만 올릴 수 있어요.`;
  if (file.size > maxMegabytes * MB)
    return `${maxMegabytes}MB 이하 파일만 올릴 수 있어요.`;
  if (file.name.trim().length > ATTACHMENT_NAME_MAX_LENGTH)
    return `파일 이름은 ${ATTACHMENT_NAME_MAX_LENGTH}자 이하여야 해요.`;
  return null;
};

const UPLOAD_FAILED_MESSAGE = '업로드하지 못했어요. 다시 시도해 주세요.';
/** U4 가 401·403 일 때. 비로그인 U4 에 실제 서버는 403 을 준다 */
export const LOGIN_REQUIRED_UPLOAD_MESSAGE = '로그인 후 다시 시도해 주세요.';

/** U4 에러 코드(계약 8절 U4, 10절)를 화면 문구로. 코드가 없으면(네트워크·PUT 실패) 다시 시도 안내 */
export const uploadErrorMessage = (
  kind: AttachmentKind,
  code: string | undefined,
): string => {
  switch (code) {
    case 'ONE_TIME_FORM_NOT_IN_PERIOD':
      return '신청 기간이 아니어서 올릴 수 없어요.';
    case 'ONE_TIME_FORM_INVALID_ANSWER':
      return `${ATTACHMENT_RULES[kind].extensions.join(', ')} 파일만 올릴 수 있어요.`;
    case 'ONE_TIME_FORM_UNKNOWN_QUESTION':
    case 'ONE_TIME_FORM_NOT_FOUND':
      return '이 질문에는 파일을 올릴 수 없어요.';
    case 'UNAUTHORIZED':
      return LOGIN_REQUIRED_UPLOAD_MESSAGE;
    default:
      return UPLOAD_FAILED_MESSAGE;
  }
};

const FINAL_UPLOAD_ERROR_CODES = new Set([
  'ONE_TIME_FORM_NOT_IN_PERIOD',
  'ONE_TIME_FORM_INVALID_ANSWER',
  'ONE_TIME_FORM_UNKNOWN_QUESTION',
  'ONE_TIME_FORM_NOT_FOUND',
]);

/** 같은 파일로 다시 시도해 볼 만한 실패인가. 기간·형식·질문 오류는 다시 해도 같다 */
export const isRetryableUploadError = (code: string | undefined): boolean =>
  code === undefined || !FINAL_UPLOAD_ERROR_CODES.has(code);

/** 칩에 붙는 크기 표시. 시안 sizeText 와 같다 */
export const formatFileSize = (bytes: number): string =>
  bytes > MB
    ? `${(bytes / MB).toFixed(1)}MB`
    : `${Math.max(1, Math.round(bytes / 1024))}KB`;
