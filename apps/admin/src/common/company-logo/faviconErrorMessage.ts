const FAVICON_ERROR_MESSAGES: Record<string, string> = {
  COMPANY_LOGO_FAVICON_INVALID_URL: '사이트 주소를 확인해 주세요.',
  COMPANY_LOGO_FAVICON_FETCH_FAILED:
    '파비콘을 가져오지 못했습니다. 이미지를 직접 올려 주세요.',
  COMPANY_LOGO_FAVICON_TOO_LARGE: '파비콘 파일이 너무 큽니다.',
};

/** 파비콘 후보 찾기·올리기 실패 문구. 등록 창과 일괄 등록이 같은 문구를 쓴다 */
export const faviconErrorMessage = (error: unknown) =>
  FAVICON_ERROR_MESSAGES[(error as { code?: string } | null)?.code ?? ''] ??
  '파비콘을 가져오지 못했습니다.';
