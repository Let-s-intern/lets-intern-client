'use client';

import { uploadFile } from '@/api/file';
import { useRef, useState } from 'react';

export interface BasicInfoFormData {
  name: string;
  nickname: string;
  phoneNum: string;
  sns: string[];
  email: string;
  profileImgUrl: string;
}

interface BasicInfoSectionProps {
  formData: BasicInfoFormData;
  onChange: (data: BasicInfoFormData) => void;
  showAlert: (opts: {
    title: string;
    variant?: 'info' | 'success' | 'error' | 'confirm';
  }) => void;
}

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const FIELDS: {
  key: keyof Omit<BasicInfoFormData, 'profileImgUrl' | 'sns'>;
  label: string;
}[] = [
  { key: 'name', label: '이름' },
  { key: 'nickname', label: '활동명' },
  { key: 'phoneNum', label: '전화번호' },
  { key: 'email', label: '이메일' },
];

export default function BasicInfoSection({
  formData,
  onChange,
  showAlert,
}: BasicInfoSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (key: keyof BasicInfoFormData, value: string) => {
    onChange({ ...formData, [key]: value });
  };

  const handleSnsChange = (index: number, value: string) => {
    onChange({
      ...formData,
      sns: formData.sns.map((v, i) => (i === index ? value : v)),
    });
  };

  const handleSnsAdd = () => {
    onChange({ ...formData, sns: [...formData.sns, ''] });
  };

  const handleSnsRemove = (index: number) => {
    onChange({
      ...formData,
      sns: formData.sns.filter((_, i) => i !== index),
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      showAlert({
        title: `파일 크기는 ${MAX_FILE_SIZE_MB}MB 이하여야 합니다.`,
        variant: 'error',
      });
      return;
    }

    setIsUploading(true);
    try {
      const fileUrl = await uploadFile({ file, type: 'USER_PROFILE' });
      onChange({ ...formData, profileImgUrl: fileUrl });
    } catch {
      showAlert({
        title: '이미지 업로드에 실패했습니다.',
        variant: 'error',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageDelete = () => {
    onChange({ ...formData, profileImgUrl: '' });
  };

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 md:p-6">
      <h2 className="text-small18 mb-5 font-medium text-gray-900">기본 정보</h2>
      <div className="flex flex-col gap-6 md:flex-row md:gap-8">
        {/* Profile Image */}
        <div className="relative mx-auto flex h-48 w-48 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-100 md:mx-0 md:h-60 md:w-60">
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
              className="rounded-lg bg-white/90 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-white disabled:opacity-50"
            >
              {isUploading ? '업로드 중...' : '업로드'}
            </button>
            {formData.profileImgUrl && (
              <button
                type="button"
                onClick={handleImageDelete}
                className="rounded-lg bg-white/90 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-white"
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
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-4">
          {FIELDS.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-3">
              <label className="text-xsmall14 w-16 flex-shrink-0 text-left font-medium text-gray-700 md:w-20 md:text-right">
                {label}
              </label>
              <input
                type="text"
                value={formData[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                className="focus:border-primary min-w-0 flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm outline-none transition-colors"
              />
            </div>
          ))}

          {/* SNS (여러 개 입력 가능) */}
          <div className="flex items-start gap-3">
            <label className="text-xsmall14 text-neutral-20 w-16 flex-shrink-0 pt-2 text-left font-medium md:w-20 md:text-right">
              SNS
            </label>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              {formData.sns.map((url, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => handleSnsChange(index, e.target.value)}
                    placeholder="https://..."
                    className="focus:border-primary text-xsmall14 border-neutral-80 min-w-0 flex-1 rounded-md border px-3 py-2 outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => handleSnsRemove(index)}
                    aria-label="SNS 삭제"
                    className="flex-shrink-0 p-1 opacity-60 transition-opacity hover:opacity-100"
                  >
                    <img
                      src="/icons/x.svg"
                      alt=""
                      className="h-[18px] w-[18px]"
                    />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleSnsAdd}
                className="text-primary text-xsmall14 border-neutral-80 hover:bg-neutral-95 w-full rounded-md border border-dashed px-3 py-2 font-medium transition-colors"
              >
                + 추가
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
