import { DocumentType } from '@/api/mission/missionSchema';
import { getFileNameFromUrl } from '@/utils/getFileNameFromUrl';
import { LoaderCircle, Trash2, Upload } from 'lucide-react';
import { type RefObject } from 'react';
import { UploadedFiles } from '../mission/talent/MissionSubmitTalentPoolSection';

const handleFilePreview = (file: File | string) => {
  const url = typeof file === 'string' ? file : URL.createObjectURL(file);
  const newWindow = window.open(
    url,
    '_blank',
    'width=800,height=600,scrollbars=yes,resizable=yes',
  );

  if (typeof file === 'string' || !newWindow) {
    if (typeof file !== 'string') URL.revokeObjectURL(url);
    return;
  }

  newWindow.addEventListener('beforeunload', () => {
    URL.revokeObjectURL(url);
  });
};

interface DocumentFileItemProps {
  type: DocumentType;
  file: File | string | null;
  uploadingFile: File | null;
  isSubmitted: boolean;
  isUploading: boolean;
  inputRef: RefObject<HTMLInputElement>;
  uploadedFiles: UploadedFiles;
  onFileUpload: (type: DocumentType, files: FileList | null) => void;
  onFileDelete: (type: DocumentType) => void;
}

export const DocumentFileItem = ({
  type,
  file,
  uploadingFile,
  isSubmitted,
  isUploading,
  inputRef,
  uploadedFiles,
  onFileUpload,
  onFileDelete,
}: DocumentFileItemProps) => {
  const label =
    type === 'RESUME'
      ? '이력서'
      : type === 'PORTFOLIO'
        ? '포트폴리오'
        : '자기소개서';

  const submittedDocument =
    isSubmitted && !file
      ? uploadedFiles?.[type.toLowerCase() as keyof UploadedFiles] || null
      : null;

  const displayFile = uploadingFile || file || submittedDocument || null;
  const hasFile = !!displayFile;
  const canEdit = !isSubmitted;

  return (
    <div className="border-b border-neutral-90 pb-5">
      <div className="mb-2">
        <span className="text-xsmall14 text-neutral-35">{label}</span>
      </div>

      {hasFile || isUploading ? (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => displayFile && handleFilePreview(displayFile)}
            className="truncate text-xsmall14 font-normal text-neutral-0 underline"
          >
            {typeof displayFile === 'string'
              ? getFileNameFromUrl(type, displayFile)
              : displayFile?.name}
          </button>
          {isUploading && (
            <div className="flex items-center text-xsmall14 text-neutral-35">
              <span>업로드 중...</span>
              <LoaderCircle
                size={16}
                className="flex-shrink-0 animate-spin text-primary"
              />
            </div>
          )}
          {canEdit && file && !isUploading && (
            <button
              type="button"
              onClick={() => onFileDelete(type)}
              className="ml-2 flex-shrink-0 text-red-500 hover:text-red-700"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isSubmitted}
          className="flex items-center gap-1 rounded-xs bg-primary-10 px-3 py-2 text-xsmall14 font-medium text-primary transition hover:bg-primary-15 disabled:cursor-not-allowed disabled:bg-neutral-85 disabled:text-neutral-50"
        >
          <Upload size={16} />
          파일 업로드
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={(e) => onFileUpload(type, e.target.files)}
        disabled={isSubmitted}
      />
    </div>
  );
};
