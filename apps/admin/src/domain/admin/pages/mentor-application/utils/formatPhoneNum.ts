/** 숫자만 저장된 전화번호에 하이픈을 넣는다. 형식이 맞지 않으면 그대로 돌려준다 */
export function formatPhoneNum(phoneNum: string) {
  const digits = phoneNum.replace(/\D/g, '');
  if (digits.length === 11) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    const areaLength = digits.startsWith('02') ? 2 : 3;
    return `${digits.slice(0, areaLength)}-${digits.slice(areaLength, -4)}-${digits.slice(-4)}`;
  }
  return phoneNum;
}
