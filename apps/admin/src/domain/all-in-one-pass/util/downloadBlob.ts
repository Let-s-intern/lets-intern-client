/** 문자열 콘텐츠를 Blob 으로 만들어 파일 다운로드 (CSV/텍스트 공용) */
export const downloadBlob = (
  fileName: string,
  content: string,
  mime = 'text/plain',
) => {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
