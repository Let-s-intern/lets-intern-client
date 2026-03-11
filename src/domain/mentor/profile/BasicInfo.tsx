'use client';

import { useRef, useState } from 'react';
import { uploadFile } from '@/api/file';

export interface BasicInfoFormData {
  name: string;
  nickname: string;
  phoneNum: string;
  sns: string;
  email: string;
  profileImgUrl: string;
}

interface BasicInfoProps {
  formData: BasicInfoFormData;
  onChange: (data: BasicInfoFormData) => void;
}

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const FIELDS: { key: keyof Omit<BasicInfoFormData, 'profileImgUrl'>; label: string }[] = [
  { key: 'name', label: '이름' },
  { key: 'nickname', label: '활동명' },
  { key: 'phoneNum', label: '전화번호' },
  { key: 'sns', label: 'SNS' },
  { key: 'email', label: 'e-mail' },
];

export default function BasicInfo({ formData, onChange }: BasicInfoProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (key: keyof BasicInfoFormData, value: string) => {
    onChange({ ...formData, [key]: value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      alert(`파일 크기는 ${MAX_FILE_SIZE_MB}MB 이하여야 합니다.`);
      return;
    }

    setIsUploading(true);
    try {
      const fileUrl = await uploadFile({ file, type: 'USER_PROFILE' });
      onChange({ ...formData, profileImgUrl: fileUrl });
    } catch {
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageDelete = () => {
    onChange({ ...formData, profileImgUrl: '' });
  };

  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold">기본 정보</h2>
      <div className="flex flex-col gap-6 md:flex-row md:gap-8">
        {/* Profile Image */}
        <div className="relative mx-auto flex h-48 w-48 flex-shrink-0 items-center justify-center overflow-hidden rounded border border-gray-300 bg-gray-200 md:mx-0 md:h-60 md:w-60">
          {formData.profileImgUrl ? (
            <img
              src={formData.profileImgUrl}
              alt="프로필 이미지"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-sm text-gray-500">프로필 이미지</span>
          )}

          {/* Upload / Delete buttons */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 bg-black/40 py-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="rounded bg-white/90 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-white disabled:opacity-50"
            >
              {isUploading ? '업로드 중...' : '업로드'}
            </button>
            {formData.profileImgUrl && (
              <button
                type="button"
                onClick={handleImageDelete}
                className="rounded bg-white/90 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-white"
              >
                삭제
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          {!formData.profileImgUrl && (
            <p className="absolute bottom-8 text-[10px] text-gray-400">
              권장 600px (5MB 이하)
            </p>
          )}
        </div>

        {/* Input Fields */}
        <div className="flex flex-1 flex-col justify-center gap-4">
          {FIELDS.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-3">
              <label className="w-16 flex-shrink-0 text-left text-sm font-medium text-gray-700 md:w-20 md:text-right">
                {label}:
              </label>
              <input
                type="text"
                value={formData[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                className="flex-1 rounded border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-gray-500"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
