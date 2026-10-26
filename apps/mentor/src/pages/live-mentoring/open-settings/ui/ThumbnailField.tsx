import { useState } from 'react';

import { uploadFile } from '@/api/file';

/** 상세 이미지 필드(`settings/ui/ImageField`)와 같은 제한이다. */
const MAX_IMAGE_MB = 10;
const MAX_IMAGE_BYTES = MAX_IMAGE_MB * 1024 * 1024;

interface ThumbnailFieldProps {
  value: string | null;
  /** 썸네일이 없을 때 공개 화면에 대신 나가는 이미지. 흐리게 보여준다. */
  profileImage: string | null;
  onChange: (url: string | null) => void;
}

/**
 * 1:1 멘토링 썸네일 업로드(선택).
 *
 * 영역 비율은 공개 리스트 카드(`aspect-[540/421]`)와 같다. 여기서 보이는 모양이 리스트에
 * 그대로 나간다. 올리지 않으면 프로필 사진이 대신 나가므로, 그 사진을 흐리게 깔아
 * 지금 무엇이 노출되는지 보여준다.
 */
const ThumbnailField = ({
  value,
  profileImage,
  onChange,
}: ThumbnailFieldProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = async (file: File | undefined) => {
    if (!file) return;
    setError(null);

    if (file.size > MAX_IMAGE_BYTES) {
      const sizeMb = (file.size / 1024 / 1024).toFixed(1);
      setError(
        `용량이 너무 커요. ${MAX_IMAGE_MB}MB까지 올릴 수 있는데 이 이미지는 ${sizeMb}MB예요.`,
      );
      return;
    }

    setIsUploading(true);
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
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[540/421] w-full max-w-sm overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
        {value ? (
          <img
            src={value}
            alt="썸네일"
            className="h-full w-full object-cover"
          />
        ) : (
          <>
            {profileImage && (
              <img
                src={profileImage}
                alt="썸네일 대신 표시되는 프로필 사진"
                className="h-full w-full object-cover opacity-40"
              />
            )}
            <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-500">
              프로필 사진이 표시돼요
            </span>
          </>
        )}
      </div>

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
            삭제
          </button>
        )}
      </div>

      <ul className="flex flex-col gap-0.5 text-xs text-gray-500">
        <li>썸네일을 올리지 않으면 프로필 사진이 표시돼요.</li>
        <li>권장 1080 x 842 px · JPG, PNG, WEBP · 최대 {MAX_IMAGE_MB}MB</li>
        <li>중요한 내용은 가운데에 두세요. 화면에 따라 가장자리가 잘릴 수 있어요.</li>
      </ul>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default ThumbnailField;
