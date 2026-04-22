export const typeToBank: Record<string, string> = {
  KB: 'KB국민은행',
  HANA: '하나은행',
  WOORI: '우리은행',
  SHINHAN: '신한은행',
  NH: 'NH농협은행',
  SH: 'SH수협은행',
  IBK: 'IBK기업은행',
  MG: '새마을금고',
  KAKAO: '카카오뱅크',
  TOSS: '토스뱅크',
};

export const convertTypeToBank = (type: string) => {
  return typeToBank[type];
};
