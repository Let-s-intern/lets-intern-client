/** 새 탭이 window.opener 로 어드민 탭을 조작하지 못하게 noopener 로 연다 */
export const openAttachment = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer');
};
