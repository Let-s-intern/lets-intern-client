/** 시안의 전화번호 자동 하이픈. 숫자만 남겨 11자리까지 자르고 끝 4자리를 마지막 묶음으로 둔다. */
export function formatPhone(input: string): string {
  const digits = toPhoneDigits(input).slice(0, 11);
  if (digits.length < 4) return digits;
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, -4)}-${digits.slice(-4)}`;
}

/** 서버로 보내는 전화번호는 숫자만이다. */
export function toPhoneDigits(input: string): string {
  return input.replace(/\D/g, '');
}
