export function resolveErrorMessage(
  status: number | undefined,
  serverMessage: string | undefined,
): { message: string; isCredentialError: boolean } {
  if (status === 400 || status === 404) {
    // 자격증명 불일치 — 서버가 이메일/비밀번호 중 무엇이 틀렸는지 구분해주지 않으므로 중립 문구.
    return {
      message: '이메일 또는 비밀번호가 일치하지 않습니다.',
      isCredentialError: true,
    };
  }
  if (status === 401) {
    return {
      message:
        '인증에 실패했어요. 다시 시도하거나 비밀번호 찾기를 이용해주세요.',
      isCredentialError: false,
    };
  }
  if (status === 429) {
    return {
      message: '로그인 시도가 너무 많아요. 잠시 뒤에 다시 시도해주세요.',
      isCredentialError: false,
    };
  }
  if (status && status >= 500) {
    return {
      message: '서버에 일시적인 문제가 발생했어요. 잠시 후 다시 시도해주세요.',
      isCredentialError: false,
    };
  }
  return {
    message:
      serverMessage ??
      '로그인에 실패했어요. 네트워크 상태를 확인하고 다시 시도해주세요.',
    isCredentialError: false,
  };
}
