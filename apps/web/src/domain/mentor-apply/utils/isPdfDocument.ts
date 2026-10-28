import type { UserDocument } from '@/api/user/userSchema';

const PDF_EXTENSION = /\.pdf$/i;

/** 쿼리스트링과 해시를 뗀 URL 경로 */
const urlPath = (url: string) => url.split(/[?#]/)[0];

/** 서류 정리 문서 중 PDF 인지. 파일 이름이나 파일 URL 경로의 확장자로 판단한다 */
export function isPdfDocument({
  fileName,
  fileUrl,
}: Pick<UserDocument, 'fileName' | 'fileUrl'>): boolean {
  return (
    (!!fileName && PDF_EXTENSION.test(fileName.trim())) ||
    (!!fileUrl && PDF_EXTENSION.test(urlPath(fileUrl)))
  );
}

/** 목록에 보일 이름. 파일 이름이 없으면 URL 의 마지막 경로 조각을 쓴다 */
export function documentLabel({
  fileName,
  fileUrl,
}: Pick<UserDocument, 'fileName' | 'fileUrl'>): string {
  if (fileName) return fileName;
  const last = fileUrl ? urlPath(fileUrl).split('/').pop() : '';
  return last ? decodeURIComponent(last) : '이름 없는 문서';
}
