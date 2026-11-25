import { ZodError } from 'zod';

// Import 실패 이유를 스낵바에 보여 줄 문구로 바꾼다
export const getGuidebookImportErrorMessage = (error: unknown): string => {
  if (error instanceof SyntaxError) {
    return 'Import 실패: JSON 형식이 올바르지 않습니다';
  }
  if (error instanceof ZodError) {
    const issue = error.issues[0];
    const field = issue.path.join('.') || '최상위 값';
    return `Import 실패: ${field} - ${issue.message}`;
  }
  return 'Import 실패';
};
