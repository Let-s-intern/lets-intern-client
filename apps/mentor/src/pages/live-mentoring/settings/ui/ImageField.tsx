import { useState } from 'react';

import { uploadFile } from '@/api/file';

interface ImageFieldProps {
  /** 없으면 라벨을 그리지 않는다 — 부모가 이미 라벨을 두는 경우가 있다. */
  label?: string;
  value: string | null;
  onChange: (url: string | null) => void;
}

/**
 * 이미지 1장 업로드 필드.
 *
 * 기존 `POST /file`(multipart) 업로드를 그대로 쓴다 — 새 인프라를 만들 이유가 없다.
 * `FileType` 에 멘토링 전용 값이 아직 없어 `USER_PROFILE` 로 올린다.
 * TODO(BE): 멘토링 상세 페이지용 FileType 이 생기면 교체할 것.
 */
const ImageField = ({ label, value, onChange }: ImageFieldProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = async (file: File | undefined) => {
    if (!file) return;
    setIsUploading(true);
    setError(null);
    try {
      const url = await uploadFile({ file, type: 'USER_PROFILE' });
      onChange(url);
    } catch {
      setError('업로드에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      {label ? (
        <span className="mb-1 block text-xs font-medium text-gray-600">
          {label}
        </span>
      ) : null}

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
            accept="image/jpeg,image/png,image/webp"
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
