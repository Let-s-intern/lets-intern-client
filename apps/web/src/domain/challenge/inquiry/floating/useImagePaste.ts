'use client';

import {
  getPresignedUrl,
  uploadToS3,
} from '@/domain/challenge/api/presignedUrl';
import { useCallback, useState } from 'react';

const MAX_IMAGE_COUNT = 5;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/** 클립보드·드래그에서 이미지 파일만 골라낸다 */
const pickImageFiles = (list: FileList | DataTransferItemList | null) => {
  if (!list) return [];
  const files: File[] = [];
  for (let i = 0; i < list.length; i += 1) {
    const entry = list[i];
    const file = 'getAsFile' in entry ? entry.getAsFile() : (entry as File);
    if (file && file.type.startsWith('image/')) files.push(file);
  }
  return files;
};

/**
 * 문의 본문에 붙여넣은 이미지를 S3 에 올리고 URL 을 모은다.
 * 본문은 평문 그대로 두고 이미지 URL 만 따로 보낸다.
 */
export const useImagePaste = () => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;
      setError(null);

      const room = MAX_IMAGE_COUNT - imageUrls.length;
      if (room <= 0) {
        setError(`이미지는 최대 ${MAX_IMAGE_COUNT}장까지 첨부할 수 있어요.`);
        return;
      }

      const targets = files.slice(0, room);
      if (targets.some((file) => file.size > MAX_IMAGE_BYTES)) {
        setError('이미지 한 장당 5MB까지 올릴 수 있어요.');
        return;
      }

      setIsUploading(true);
      try {
        const uploaded = await Promise.all(
          targets.map(async (file) => {
            // 클립보드 이미지는 이름이 대부분 image.png 라 그대로 쓰면 서로 덮어쓴다
            const objectKey = `challenge-question/${Date.now()}-${Math.random()
              .toString(36)
              .slice(2, 8)}-${file.name}`;
            const presignedUrl = await getPresignedUrl('challenge', objectKey);
            await uploadToS3(presignedUrl, file);
            return presignedUrl.split('?')[0];
          }),
        );
        setImageUrls((prev) => [...prev, ...uploaded]);
      } catch {
        setError('이미지 업로드에 실패했어요. 다시 시도해 주세요.');
      } finally {
        setIsUploading(false);
      }
    },
    [imageUrls.length],
  );

  const onPaste = useCallback(
    (e: React.ClipboardEvent) => {
      const files = pickImageFiles(e.clipboardData?.items ?? null);
      if (files.length === 0) return;
      // 이미지가 붙을 때만 기본 동작을 막는다. 글자 붙여넣기는 그대로 둔다
      e.preventDefault();
      void upload(files);
    },
    [upload],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      const files = pickImageFiles(e.dataTransfer?.files ?? null);
      if (files.length === 0) return;
      e.preventDefault();
      void upload(files);
    },
    [upload],
  );

  const removeImage = useCallback((url: string) => {
    setImageUrls((prev) => prev.filter((item) => item !== url));
  }, []);

  const reset = useCallback(() => {
    setImageUrls([]);
    setError(null);
  }, []);

  return { imageUrls, isUploading, error, onPaste, onDrop, removeImage, reset };
};
