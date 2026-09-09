'use client';

import { useEffect, useState } from 'react';

import { uploadFile } from '@/api/file';
import BaseModal from '@/common/modal/BaseModal';
import { blurImageFile } from '../blurImage';

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

interface ProfileImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** 업로드가 끝나 받은 이미지 URL. 상위 폼에만 넣고 서버 저장은 하지 않는다. */
  onUploaded: (url: string) => void;
}

/**
 * 프로필 이미지 업로드 모달.
 *
 * **여기서 누르는 "저장하기" 는 프로필 저장이 아니다.** 이미지를 올려 URL 을 받아 상위 폼에
 * 넣을 뿐이고, 서버 반영은 프로필 화면 하단의 플로팅 저장 바 하나가 담당한다(LC-3266 이
 * 저장 경로를 그 하나로 합쳐 놓았다). 그래서 모달 안에 그 사실을 한 줄로 적어 둔다.
 *
 * 블러 토글은 저장되는 설정이 아니라 **굽는 시점의 옵션**이다. 이미 올라간 이미지에는
 * 소급 적용되지 않으므로 모달을 열 때마다 꺼진 상태로 시작한다.
 */
const ProfileImageUploadModal = ({
  isOpen,
  onClose,
  onUploaded,
}: ProfileImageUploadModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isBlurred, setIsBlurred] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 미리보기와 업로드는 **같은 File 하나**를 쓴다.
   *
   * 미리보기용으로 따로 굽고 업로드는 다시 구우면, 둘이 어긋났을 때 멘토는 흐린 화면을
   * 보고 저장했는데 선명한 사진이 올라간 것을 알 방법이 없다. (파일, 토글) 이 바뀔 때 한 번
   * 구워서 그 결과를 화면에도 쓰고 서버에도 보낸다.
   */
  const [processed, setProcessed] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!file) {
      setProcessed(null);
      setPreviewUrl(null);
      return;
    }

    let cancelled = false;
    let url: string | null = null;

    const run = async () => {
      setIsProcessing(true);
      setError(null);
      try {
        const next = isBlurred ? await blurImageFile(file) : file;
        if (cancelled) return;
        url = URL.createObjectURL(next);
        setProcessed(next);
        setPreviewUrl(url);
      } catch {
        if (cancelled) return;
        /*
         * 블러에 실패하면 원본으로 되돌리지 않는다. 그러면 흐릴 줄 알았던 사진이 그대로
         * 올라간다. 미리보기도 업로드 대상도 비워 두고 왜 안 되는지 말한다.
         */
        setProcessed(null);
        setPreviewUrl(null);
        setError(
          '이미지를 처리하지 못했어요. 다른 형식(JPG, PNG)으로 다시 시도해주세요.',
        );
      } finally {
        if (!cancelled) setIsProcessing(false);
      }
    };

    run();

    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [file, isBlurred]);

  const reset = () => {
    setFile(null);
    setIsBlurred(false);
    setIsDragging(false);
    setError(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSelect = (selected: File | undefined) => {
    if (!selected) return;

    if (!selected.type.startsWith('image/')) {
      setError('이미지 파일만 올릴 수 있어요.');
      return;
    }
    // 왜 안 됐는지, 얼마까지 되는지, 지금 파일이 얼마인지를 한 줄에 담는다.
    if (selected.size > MAX_FILE_SIZE_BYTES) {
      const sizeMb = (selected.size / 1024 / 1024).toFixed(1);
      setError(
        `용량이 너무 커요. ${MAX_FILE_SIZE_MB}MB까지 올릴 수 있는데 이 이미지는 ${sizeMb}MB예요.`,
      );
      return;
    }

    setError(null);
    setFile(selected);
  };

  const handleSave = async () => {
    if (!processed) return;

    setIsSaving(true);
    setError(null);
    try {
      const url = await uploadFile({ file: processed, type: 'USER_PROFILE' });
      onUploaded(url);
      reset();
      onClose();
    } catch {
      setError('업로드에 실패했어요. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      className="max-w-[20rem] md:max-w-[28rem]"
    >
      <div className="px-6 py-5">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xsmall16 font-semibold">프로필 이미지</span>
          <button
            type="button"
            onClick={handleClose}
            aria-label="닫기"
            className="p-1 opacity-60 transition-opacity hover:opacity-100"
          >
            <img src="/icons/x.svg" alt="" className="h-[18px] w-[18px]" />
          </button>
        </div>

        <label
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleSelect(e.dataTransfer.files?.[0]);
          }}
          className={`flex aspect-[4/3] w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-colors ${
            isDragging
              ? 'border-primary bg-primary-5'
              : 'border-neutral-80 bg-neutral-95 hover:bg-neutral-90'
          }`}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="프로필 이미지 미리보기"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-xsmall14 px-6 text-center text-neutral-500">
              {isProcessing
                ? '이미지를 처리하고 있어요...'
                : '드래그해서 이미지를 올리거나 클릭하여 이미지를 올려 주세요'}
            </span>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              handleSelect(e.target.files?.[0]);
              // 같은 파일을 다시 골라도 change 가 나게 한다.
              e.target.value = '';
            }}
            className="hidden"
          />
        </label>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-xsmall14 font-medium">
              이미지 블러처리하기
            </span>
            <p className="mt-0.5 text-xs text-neutral-500">
              흐리게 만든 사진이 저장돼요. 원본은 올라가지 않아요.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={isBlurred}
            aria-label="이미지 블러처리하기"
            disabled={isProcessing}
            onClick={() => setIsBlurred((prev) => !prev)}
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              isBlurred ? 'bg-primary' : 'bg-neutral-70'
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
                isBlurred ? 'left-[1.375rem]' : 'left-0.5'
              }`}
            />
          </button>
        </div>

        {error && <p className="mt-3 text-xs text-red-500">{error}</p>}

        <button
          type="button"
          onClick={handleSave}
          disabled={!processed || isProcessing || isSaving}
          className="bg-primary hover:bg-primary-hover text-xsmall14 mt-5 w-full rounded-lg py-3 font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? '저장 중...' : '저장하기'}
        </button>

        <p className="mt-2 text-center text-xs text-neutral-500">
          프로필 하단의 저장까지 눌러야 반영돼요.
        </p>
      </div>
    </BaseModal>
  );
};

export default ProfileImageUploadModal;
