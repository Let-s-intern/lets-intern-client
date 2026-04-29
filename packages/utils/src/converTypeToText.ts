export const typeToText: Record<string, string> = {
  CHALLENGE_FULL: '챌린지',
  CHALLENGE_HALF: '챌린지',
  BOOTCAMP: '부트캠프',
  LETS_CHAT: '렛츠챗',
};

export const convertTypeToText = (type: string, full: boolean) => {
  if (!full) {
    return typeToText[type];
  }
  if (type === 'CHALLENGE_FULL') {
    return '챌린지(풀)';
  } else if (type === 'CHALLENGE_HALF') {
    return '챌린지(반)';
  }
  return typeToText[type];
};
