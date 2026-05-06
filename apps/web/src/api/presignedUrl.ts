import { ApiError } from '@letscareer/api';
import axios from '@/utils/axios';

const getPresignedUrl = async (
  docType: string,
  fileName: string,
): Promise<string> => {
  const res = await axios.get(`/s3/upload-url?filename=${fileName}`);
  return res.data.data;
};

const uploadToS3 = async (presignedUrl: string, file: File): Promise<void> => {
  const response = await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
  });

  if (!response.ok) {
    throw new ApiError({
      code: 'PRESIGNED_URL_FAILED',
      message: '업로드 URL 발급에 실패했습니다.',
      status: response.status,
      endpoint: presignedUrl,
      method: 'PUT',
      context: { statusText: response.statusText },
    });
  }
};

export { getPresignedUrl, uploadToS3 };
