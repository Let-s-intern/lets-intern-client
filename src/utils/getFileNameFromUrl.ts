import { DocumentType } from '@/api/missionSchema';

// 타입에 따라 파일명에서 접두사 제거
const removeTypePrefixFromFileName = (
  type: DocumentType,
  fileName: string,
): string => {
  const typeLower = type.toLowerCase();
  const fileNameLower = fileName.toLowerCase();

  // 파일명이 타입으로 시작하는 경우
  if (fileNameLower.startsWith(typeLower)) {
    // 접두사 + 언더스코어 또는 공백 제거
    const prefixPattern = new RegExp(`^${typeLower}[_-]?`, 'i');
    return fileName.replace(prefixPattern, '');
  }

  return fileName;
};

// URL에서 파일 이름 추출
export const getFileNameFromUrl = (type: DocumentType, url: string): string => {
  let fileName = '';

  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    fileName = pathname.substring(pathname.lastIndexOf('/') + 1);
    // URL 디코딩 (특수문자 처리)
    fileName = decodeURIComponent(fileName);
  } catch {
    console.error('URL 파싱 실패:', url);
    return 'FILE_NAME_PARSING_FAILED';
  }

  // 타입 접두사 제거
  return removeTypePrefixFromFileName(type, fileName);
};
