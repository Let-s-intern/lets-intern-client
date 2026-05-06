import { ApiError } from '@letscareer/api';
import axios from '@/utils/axios';

const getPresignedUrl = async (
  docType: string,
  fileName: string,
): Promise<string> => {
  const res = await axios.get(`/s3/upload-url?filename=${fileName}`);
  return res.data.data;
};

// presigned URL의 쿼리 스트링은 AWS Signature/Expires/AccessKeyId 등 자격증명을 포함.
// Sentry tag/extra로 흘러가면 시크릿 leak이 되므로 origin+path 만 남기고 쿼리 제거.
const stripPresignedQuery = (presignedUrl: string): string => {
  try {
    const u = new URL(presignedUrl);
    return `${u.origin}${u.pathname}`;
  } catch {
    return presignedUrl.split('?')[0];
  }
};

const uploadToS3 = async (presignedUrl: string, file: File): Promise<void> => {
  const response = await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
  });

  if (!response.ok) {
    throw new ApiError({
      code: 'S3_UPLOAD_FAILED',
      message: '파일 업로드에 실패했습니다.',
      status: response.status,
      endpoint: stripPresignedQuery(presignedUrl),
      method: 'PUT',
      context: { statusText: response.statusText },
    });
  }
};

export { getPresignedUrl, uploadToS3 };
