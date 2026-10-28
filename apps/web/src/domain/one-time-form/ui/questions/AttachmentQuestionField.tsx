import type { OneTimeFormAttachmentAnswer } from '@/api/one-time-form/oneTimeFormSchema';
import { twMerge } from '@/lib/twMerge';
import { X } from 'lucide-react';
import { DragEvent, useEffect, useRef, useState } from 'react';
import { useAttachmentUpload } from '../../hooks/useAttachmentUpload';
import { extensionOf } from '../../utils/answerValidation';
import { ATTACHMENT_RULES, formatFileSize } from '../../utils/attachmentUpload';

export interface AttachmentQuestionFieldProps {
  id: string;
  slug: string;
  questionId: number;
  kind: 'IMAGE' | 'FILE';
  value: OneTimeFormAttachmentAnswer | undefined;
  hasError: boolean;
  onChange: (value: OneTimeFormAttachmentAnswer | undefined) => void;
  onBlur: () => void;
}

/** 고른 이미지의 로컬 미리보기 주소. 파일이 바뀌거나 사라지면 해제한다 */
const useObjectUrl = (file: File | undefined) => {
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => {
      URL.revokeObjectURL(objectUrl);
      setUrl(undefined);
    };
  }, [file]);

  return url;
};

interface FileChipProps {
  id: string;
  name: string;
  size?: number;
  thumbnailFile?: File;
  progress?: number;
  hasError: boolean;
  onRemove: () => void;
  onBlur: () => void;
}

/** 시안 .file-chip: 확장자(이미지는 썸네일), 이름·크기, 올리는 중이면 진행 막대, 삭제 버튼 */
const FileChip = ({
  id,
  name,
  size,
  thumbnailFile,
  progress,
  hasError,
  onRemove,
  onBlur,
}: FileChipProps) => {
  const thumbnailUrl = useObjectUrl(thumbnailFile);

  return (
    <div
      id={id}
      tabIndex={-1}
      aria-invalid={hasError}
      onBlur={onBlur}
      className={twMerge(
        'border-neutral-80 flex items-center gap-3 rounded-sm border py-2.5 pl-3 pr-2 outline-none',
        hasError && 'border-requirement',
      )}
    >
      <div className="bg-primary-10 text-xxsmall10 text-primary rounded-xs grid h-9 w-9 flex-none place-items-center overflow-hidden font-bold uppercase">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={`${name} 미리보기`}
            className="h-full w-full object-cover"
          />
        ) : (
          extensionOf(name).slice(0, 4)
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xsmall14 truncate font-medium">
          {name}
          {size === undefined ? null : (
            <span className="text-xxsmall12 text-neutral-40 font-normal">
              {` · ${formatFileSize(size)}`}
            </span>
          )}
        </p>
        {progress === undefined ? null : (
          <div
            role="progressbar"
            aria-label={`${name} 업로드 중`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            className="bg-neutral-90 mt-1 h-[3px] overflow-hidden rounded-full"
          >
            <div
              className="bg-primary h-full transition-[width]"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
      <button
        type="button"
        aria-label="파일 삭제"
        onClick={onRemove}
        className="text-neutral-35 hover:bg-neutral-95 grid h-10 w-10 flex-none place-items-center rounded-sm"
      >
        <X size={18} strokeWidth={1.8} />
      </button>
    </div>
  );
};

/**
 * 이미지·파일 질문(계약 5.3, 8절 U4). 질문마다 1개.
 * 고르거나 끌어다 놓으면 사전 검사 후 바로 올리고, 올린 뒤에는 파일 칩과 삭제 버튼을 보여 준다.
 */
const AttachmentQuestionField = ({
  id,
  slug,
  questionId,
  kind,
  value,
  hasError,
  onChange,
  onBlur,
}: AttachmentQuestionFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { state, upload, retry, reset } = useAttachmentUpload({
    slug,
    questionId,
    kind,
    onUploaded: onChange,
  });

  const remove = () => {
    reset();
    onChange(undefined);
  };

  const pick = (file: File | undefined) => {
    if (file) void upload(file);
  };

  const handleDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    pick(event.dataTransfer.files[0]);
  };

  if (state.status === 'uploading') {
    return (
      <FileChip
        id={id}
        name={state.file.name}
        size={state.file.size}
        progress={state.progress}
        hasError={false}
        onRemove={remove}
        onBlur={onBlur}
      />
    );
  }

  if (value) {
    // 이번에 올린 파일이면 크기와 썸네일을 안다. 임시 저장에서 되살린 답이면 이름만 있다
    const uploadedFile =
      state.status === 'done' && state.value.key === value.key
        ? state.file
        : undefined;
    return (
      <FileChip
        id={id}
        name={value.name}
        size={uploadedFile?.size}
        thumbnailFile={kind === 'IMAGE' ? uploadedFile : undefined}
        hasError={hasError}
        onRemove={remove}
        onBlur={onBlur}
      />
    );
  }

  const uploadError = state.status === 'error' ? state : null;

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        hidden
        accept={ATTACHMENT_RULES[kind].extensions
          .map((extension) => `.${extension}`)
          .join(',')}
        onChange={(event) => {
          pick(event.target.files?.[0]);
          event.target.value = '';
        }}
      />
      <button
        id={id}
        type="button"
        onClick={() => inputRef.current?.click()}
        onBlur={onBlur}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        className={twMerge(
          'border-neutral-70 bg-neutral-95 hover:border-primary hover:bg-primary-5 flex min-h-[104px] w-full flex-col items-center justify-center gap-1 rounded-sm border-[1.5px] border-dashed p-4 text-center outline-none transition-colors',
          (hasError || uploadError) && 'border-requirement',
        )}
      >
        <span className="text-xsmall14 text-neutral-20 font-semibold">
          <span className="text-primary">
            {kind === 'IMAGE' ? '이미지 선택' : '파일 선택'}
          </span>{' '}
          또는 끌어다 놓기
        </span>
        <span className="text-xxsmall12 text-neutral-40">1개까지</span>
      </button>
      {uploadError ? (
        <p
          role="alert"
          className="text-xxsmall12 text-requirement mt-1.5 flex items-center gap-2"
        >
          {uploadError.message}
          {uploadError.retryFile ? (
            <button
              type="button"
              onClick={retry}
              className="text-neutral-20 font-semibold underline"
            >
              다시 시도
            </button>
          ) : null}
        </p>
      ) : null}
    </>
  );
};

export default AttachmentQuestionField;
