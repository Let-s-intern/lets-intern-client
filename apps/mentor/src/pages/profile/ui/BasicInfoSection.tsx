'use client';

import { useState } from 'react';

import { toSnsUrl } from '@/utils/sns';
import ProfileImageUploadModal from './ProfileImageUploadModal';

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
}

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
}: BasicInfoSectionProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

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

  const handleImageDelete = () => {
    onChange({ ...formData, profileImgUrl: '' });
  };

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 md:p-6">
      <h2 className="text-small18 mb-5 font-medium text-gray-900">기본 정보</h2>
      <div className="flex flex-col gap-6 md:flex-row md:gap-8">
        {/* Profile Image */}
        <div className="mx-auto flex flex-shrink-0 flex-col items-center gap-2 md:mx-0">
          <div className="relative flex h-48 w-48 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-100 md:h-60 md:w-60">
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
                onClick={() => setIsUploadModalOpen(true)}
                className="rounded-lg bg-white/90 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-white"
              >
                업로드
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
          </div>

          {/*
            용량 안내는 이미지가 있든 없든 늘 보여야 한다. 예전에는 이미지 박스 **안에**
            10px 회색 글씨로 있어서, 사진을 한 장 올리고 나면 아예 사라졌다. 5MB 를 넘겨
            거절당하는 순간에야 한도를 알게 되는 자리였다.
          */}
          <p className="text-xs text-neutral-500">
            JPG, PNG 파일을 5MB까지 올릴 수 있어요.
          </p>
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
              {formData.sns.map((url, index) => {
                // 빈 줄은 저장할 때 빠지므로 오류로 보지 않는다
                const isInvalid = url.trim() !== '' && toSnsUrl(url) === null;
                return (
                  <div key={index}>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={url}
                        onChange={(e) => handleSnsChange(index, e.target.value)}
                        placeholder="https://..."
                        aria-invalid={isInvalid}
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
                    {isInvalid ? (
                      <p
                        role="alert"
                        className="text-system-error mt-1 text-xs"
                      >
                        주소 형식이 아니에요. 예) instagram.com/아이디
                      </p>
                    ) : null}
                  </div>
                );
              })}
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

      <ProfileImageUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploaded={(url) => onChange({ ...formData, profileImgUrl: url })}
      />
    </section>
  );
}
