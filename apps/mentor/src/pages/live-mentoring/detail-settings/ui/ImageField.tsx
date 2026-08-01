import { useState } from 'react';

import { uploadFile } from '@/api/file';

interface ImageFieldProps {
  label: string;
  value: string | null;
  onChange: (url: string | null) => void;
}

/**
 * 이미지 1장 업로드 필드.
 *
 * 기존 `POST /file`(multipart) 업로드를 그대로 쓴다 — 새 인프라를 만들 이유가 없다.
 * 서버 `FileType.LIVE_MENTORING(18, "program/live-mentoring/")` 으로 올린다.
 */
const ImageField = ({ label, value, onChange }: ImageFieldProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = async (file: File | undefined) => {
    if (!file) return;
    setIsUploading(true);
    setError(null);
    try {
      const url = await uploadFile({ file, type: 'LIVE_MENTORING' });
      onChange(url);
    } catch {
      setError('업로드에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <span className="mb-1 block text-xs font-medium text-gray-600">
        {label}
      </span>

      {value && (
        <img
          src={value}
          alt=""
          className="mb-2 max-h-40 w-full rounded-lg object-cover"
        />
      )}

      <div className="flex items-center gap-2">
        <label className="cursor-pointer rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600">
          {isUploading
            ? '업로드 중...'
            : value
              ? '이미지 변경'
              : '이미지 업로드'}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={isUploading}
            onChange={(e) => handleSelect(e.target.files?.[0])}
          />
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="px-2 py-1 text-xs text-red-500"
          >
            제거
          </button>
        )}
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default ImageField;
