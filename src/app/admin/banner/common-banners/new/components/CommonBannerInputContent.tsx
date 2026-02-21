'use client';

import { CommonBannerType } from '@/api/banner';
import { useRef } from 'react';

export type CommonBannerFormValue = {
  title: string;
  landingUrl: string;
  isVisible: boolean;
  startDate: string;
  endDate: string;
  types: Record<CommonBannerType, boolean>;
  homePcFile: File | null;
  homeMobileFile: File | null;
  programPcFile: File | null;
  programMobileFile: File | null;
};

interface Props {
  value: CommonBannerFormValue;
  onChange: (value: CommonBannerFormValue) => void;
}

const BANNER_TYPE_LABELS: Record<CommonBannerType, string> = {
  HOME_TOP: '홈 상단',
  HOME_BOTTOM: '홈 하단',
  PROGRAM: '프로그램 페이지',
  MY_PAGE: '마이페이지',
};

const BANNER_TYPES: CommonBannerType[] = [
  'HOME_TOP',
  'HOME_BOTTOM',
  'PROGRAM',
  'MY_PAGE',
];

const ImageUploadBox = ({
  label,
  file,
  previewUrl,
  onChange,
}: {
  label: string;
  file: File | null;
  previewUrl?: string | null;
  onChange: (file: File | null) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const preview = file ? URL.createObjectURL(file) : previewUrl;

  return (
    <div className="flex flex-col gap-2">
      <span className="flex items-center gap-1 text-sm text-gray-700">
        {label}
      </span>
      <div
        className="relative flex h-[160px] w-[280px] cursor-pointer items-center justify-center rounded-xxs border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt={label}
              className="h-full w-full rounded-xxs object-cover"
            />
            <button
              type="button"
              className="absolute right-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
            >
              ✕
            </button>
          </>
        ) : (
          <span className="text-2xl text-gray-400">+</span>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0] ?? null;
            onChange(f);
            // reset so same file can be re-selected
            e.target.value = '';
          }}
        />
      </div>
    </div>
  );
};

const FormRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-start gap-8">
    <span className="w-24 shrink-0 pt-1 text-sm font-medium text-gray-800">
      {label}
    </span>
    <div className="flex-1">{children}</div>
  </div>
);

const CommonBannerInputContent = ({ value, onChange }: Props) => {
  const set = (partial: Partial<CommonBannerFormValue>) =>
    onChange({ ...value, ...partial });

  const setType = (type: CommonBannerType, checked: boolean) =>
    onChange({ ...value, types: { ...value.types, [type]: checked } });

  // 홈 위치(HOME_TOP | HOME_BOTTOM) 선택 여부
  const hasHome = value.types.HOME_TOP || value.types.HOME_BOTTOM;
  // 프로그램 위치 선택 여부
  const hasProgram = value.types.PROGRAM;
  // 마이페이지 선택 여부
  const hasMyPage = value.types.MY_PAGE;

  // 이미지 섹션 표시 여부
  const showHomeImages = hasHome || hasMyPage;
  const showProgramImages = hasProgram || hasMyPage;

  return (
    <div className="flex flex-col gap-6">
      {/* 제목 */}
      <FormRow label="제목">
        <input
          type="text"
          placeholder="관리자 확인용 배너 제목을 입력해주세요."
          className="w-full rounded-xxs border border-gray-300 px-4 py-2.5 outline-none focus:border-primary"
          value={value.title}
          onChange={(e) => set({ title: e.target.value })}
        />
      </FormRow>

      {/* 랜딩 URL */}
      <FormRow label="랜딩 URL">
        <input
          type="text"
          placeholder="배너 클릭시 이동할 랜딩 URL을 입력해주세요."
          className="w-full rounded-xxs border border-gray-300 px-4 py-2.5 outline-none focus:border-primary"
          value={value.landingUrl}
          onChange={(e) => set({ landingUrl: e.target.value })}
        />
      </FormRow>

      {/* 노출 여부 */}
      <FormRow label="노출 여부">
        <div className="flex items-center gap-6">
          {[
            { label: '노출함', val: true },
            { label: '노출안함', val: false },
          ].map(({ label, val }) => (
            <label
              key={String(val)}
              className="flex cursor-pointer items-center gap-2"
            >
              <input
                type="radio"
                name="isVisible"
                checked={value.isVisible === val}
                onChange={() => set({ isVisible: val })}
                className="accent-primary"
              />
              {label}
            </label>
          ))}
        </div>
      </FormRow>

      {/* 노출 기간 */}
      <FormRow label="노출 기간">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center">
            <input
              type="datetime-local"
              className="w-52 rounded-xxs border border-gray-300 px-3 py-2 outline-none focus:border-primary"
              value={value.startDate}
              onChange={(e) => set({ startDate: e.target.value })}
            />
          </div>
          <span className="text-gray-400">-</span>
          <div className="relative flex items-center">
            <input
              type="datetime-local"
              className="w-52 rounded-xxs border border-gray-300 px-3 py-2 outline-none focus:border-primary"
              value={value.endDate}
              onChange={(e) => set({ endDate: e.target.value })}
            />
          </div>
        </div>
      </FormRow>

      {/* 노출 위치 */}
      <FormRow label="노출 위치">
        <div className="flex items-center gap-5">
          {BANNER_TYPES.map((type) => (
            <label
              key={type}
              className="flex cursor-pointer items-center gap-2"
            >
              <input
                type="checkbox"
                checked={value.types[type]}
                onChange={(e) => setType(type, e.target.checked)}
                className="h-4 w-4 accent-primary"
              />
              {BANNER_TYPE_LABELS[type]}
            </label>
          ))}
        </div>
      </FormRow>

      {/* 이미지 */}
      <FormRow label="이미지">
        <div className="flex flex-col gap-6">
          {/* 홈 배너: HOME_TOP/HOME_BOTTOM 또는 MY_PAGE 선택 시 표시 */}
          {showHomeImages && (
            <div className="flex flex-wrap gap-6">
              {hasHome && (
                <ImageUploadBox
                  label="홈 배너 (PC)"
                  file={value.homePcFile}
                  onChange={(f) => set({ homePcFile: f })}
                />
              )}
              <ImageUploadBox
                label="홈 배너 (모바일)"
                file={value.homeMobileFile}
                onChange={(f) => set({ homeMobileFile: f })}
              />
            </div>
          )}

          {/* 프로그램 배너: PROGRAM 또는 MY_PAGE 선택 시 표시 */}
          {showProgramImages && (
            <div className="flex flex-wrap gap-6">
              {hasProgram && (
                <ImageUploadBox
                  label="프로그램 배너 (PC)"
                  file={value.programPcFile}
                  onChange={(f) => set({ programPcFile: f })}
                />
              )}
              <ImageUploadBox
                label="프로그램 배너 (모바일)"
                file={value.programMobileFile}
                onChange={(f) => set({ programMobileFile: f })}
              />
            </div>
          )}

          {/* 아무 위치도 선택 안 한 경우 안내 */}
          {!showHomeImages && !showProgramImages && (
            <p className="text-sm text-gray-400">
              노출 위치를 선택하면 이미지 업로드 항목이 표시됩니다.
            </p>
          )}

          {/* 마이페이지 안내 문구 */}
          {hasMyPage && (
            <div className="text-xs leading-relaxed text-gray-500">
              <p>※ 마이페이지 배너는 별도 이미지를 사용하지 않습니다.</p>
              <p>
                - 마이페이지 PC : 프로그램 배너 (모바일) 이미지가 노출됩니다.
              </p>
              <p>- 마이페이지 모바일 : 홈 배너 (모바일) 이미지가 노출됩니다.</p>
            </div>
          )}
        </div>
      </FormRow>
    </div>
  );
};

export default CommonBannerInputContent;
