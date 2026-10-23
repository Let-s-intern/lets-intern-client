import { Button } from '@mui/material';
import { useState } from 'react';

import { uploadFile } from '@/api/file';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

interface Props {
  label: string;
  value: string | null;
  onChange: (url: string | null) => void;
}

/** 이미지 한 장. `POST /file` 로 올리고 받은 주소를 돌려준다. 멘토 앱과 같은 파일 타입을 쓴다 */
export default function ImageField({ label, value, onChange }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      setError('파일 크기는 5MB 이하여야 합니다.');
      return;
    }
    setError(null);
    setIsUploading(true);
    try {
      onChange(await uploadFile({ file, type: 'USER_PROFILE' }));
    } catch {
      setError('이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xsmall14 text-neutral-30 font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <div className="border-neutral-80 bg-neutral-95 flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded border">
          {value ? (
            <img
              src={value}
              alt={label}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-xxsmall12 text-neutral-40">없음</span>
          )}
        </div>
        <Button
          component="label"
          variant="outlined"
          size="small"
          disabled={isUploading}
        >
          {isUploading ? '올리는 중...' : '업로드'}
          <input
            type="file"
            accept="image/*"
            hidden
            aria-label={`${label} 업로드`}
            onChange={handleFile}
          />
        </Button>
        {value ? (
          <Button
            variant="text"
            size="small"
            color="inherit"
            onClick={() => onChange(null)}
          >
            삭제
          </Button>
        ) : null}
      </div>
      {error ? (
        <p role="alert" className="text-system-error text-xs">
          {error}
        </p>
      ) : null}
    </div>
  );
}
