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
    throw new Error(
      `S3 업로드 실패: ${response.status} ${response.statusText}`,
    );
  }
};

export { getPresignedUrl, uploadToS3 };
