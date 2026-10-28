import { Button } from '@mui/material';
import { useRef, type ChangeEvent } from 'react';

import { THUMBNAIL_ACCEPT } from '../utils/thumbnailFile';
import ProductThumbnail from './ProductThumbnail';

interface ThumbnailFieldProps {
  url: string | null;
  error?: string;
  isUploading: boolean;
  onUpload: (file: File) => void;
  onDelete: () => void;
}

const ThumbnailField = ({
  url,
  error,
  isUploading,
  onUpload,
  onDelete,
}: ThumbnailFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // 같은 파일을 다시 골라도 change 가 일어나게 비운다
    e.target.value = '';
    if (file) onUpload(file);
  };

  return (
    <div>
      <span className="text-xsmall14 text-neutral-0 font-medium">썸네일</span>
      <div className="mt-2 flex items-center gap-4">
        <ProductThumbnail url={url} className="h-24 w-24 rounded-md" />
        <div>
          <p className="text-xxsmall12 text-neutral-40">
            1:1 비율, 400x400 이상 권장 · jpg, png, webp · 2MB 이하
          </p>
          <div className="mt-2 flex gap-2">
            <Button
              variant="outlined"
              size="small"
              disabled={isUploading}
              onClick={() => inputRef.current?.click()}
            >
              {isUploading ? '올리는 중' : url ? '이미지 변경' : '이미지 등록'}
            </Button>
            {url ? (
              <Button
                variant="outlined"
                size="small"
                color="inherit"
                disabled={isUploading}
                onClick={onDelete}
              >
                삭제
              </Button>
            ) : null}
          </div>
          {error ? (
            <p role="alert" className="text-xxsmall12 text-system-error mt-1">
              {error}
            </p>
          ) : null}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={THUMBNAIL_ACCEPT}
        className="hidden"
        aria-label="썸네일 파일"
        onChange={handleChange}
      />
    </div>
  );
};

export default ThumbnailField;
