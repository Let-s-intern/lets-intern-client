import { useState } from 'react';

import { uploadFile } from '@/api/file';

/**
 * 올릴 수 있는 이미지 최대 용량.
 *
 * 서버는 100MB 까지 받지만(`application.yml`), 상세 페이지에 그만한 이미지가 실리면
 * 멘티 쪽에서 화면이 뜨는 데만 한참 걸린다. 화면에 쓰이는 크기를 기준으로 여기서 막고,
 * 막는 숫자는 버튼 옆에 미리 적어 둔다 — 올리고 나서 거부당하는 것보다 낫다.
 */
const MAX_IMAGE_MB = 10;
const MAX_IMAGE_BYTES = MAX_IMAGE_MB * 1024 * 1024;

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
    setError(null);

    // 왜 안 올라갔는지, 얼마까지 되는지, 지금 파일이 얼마인지를 한 줄에 담는다.
    if (file.size > MAX_IMAGE_BYTES) {
      const sizeMb = (file.size / 1024 / 1024).toFixed(1);
      setError(
        `용량이 너무 커요. ${MAX_IMAGE_MB}MB까지 올릴 수 있는데 이 이미지는 ${sizeMb}MB예요.`,
      );
      return;
    }

    setIsUploading(true);
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
        /* 잘라내지 않는다 — 멘토가 올린 그대로가 상세에 나가므로 여기서도 전체가 보여야 한다. */
        <img
          src={value}
          alt=""
          className="mb-2 max-h-40 w-full rounded-lg object-contain"
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
        <span className="text-xs text-gray-400">
          JPG·PNG·WEBP · {MAX_IMAGE_MB}MB까지
        </span>
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default ImageField;
