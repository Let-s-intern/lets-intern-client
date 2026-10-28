import axios from 'axios';

/**
 * U4 로 받은 서명 URL 에 파일을 직접 PUT 한다(계약 8절 U4, 본문은 파일).
 * 진행률이 필요해 fetch 대신 axios 를 쓴다. 서명 URL 이라 인증 헤더를 붙이는 API 인스턴스는 쓰지 않는다.
 */
export const putAttachmentFile = async ({
  uploadUrl,
  file,
  onProgress,
  signal,
}: {
  uploadUrl: string;
  file: File;
  onProgress: (percent: number) => void;
  signal: AbortSignal;
}): Promise<void> => {
  await axios.put(uploadUrl, file, {
    signal,
    onUploadProgress: ({ loaded, total }) => {
      const size = total ?? file.size;
      if (size > 0)
        onProgress(Math.min(100, Math.round((loaded / size) * 100)));
    },
  });
};
