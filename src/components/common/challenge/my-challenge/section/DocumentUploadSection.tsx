import { clsx } from 'clsx';
import { RefreshCw, Trash2, Upload } from 'lucide-react';
import { useRef, useState } from 'react';

interface DocumentUploadSectionProps {
  className?: string;
  onFilesChange?: (files: {
    resume: File | null;
    portfolio: File | null;
    selfIntroduction: File | null;
  }) => void;
}

const DocumentUploadSection = ({
  className,
  onFilesChange,
}: DocumentUploadSectionProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<{
    resume: File | null;
    portfolio: File | null;
    selfIntroduction: File | null;
  }>({
    resume: null,
    portfolio: null,
    selfIntroduction: null,
  });

  const resumeInputRef = useRef<HTMLInputElement>(null);
  const portfolioInputRef = useRef<HTMLInputElement>(null);
  const selfIntroductionInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (
    type: 'resume' | 'portfolio' | 'selfIntroduction',
    files: FileList | null,
  ) => {
    if (!files || files.length === 0) return;

    // TODO: pdf 형식, 50MB 이하 유효성 검사
    const file = files[0]; // 첫 번째 파일만 사용

    setUploadedFiles((prev) => {
      const updated = {
        ...prev,
        [type]: file,
      };

      // 부모 컴포넌트에 파일 변경 알림
      onFilesChange?.({
        resume: updated.resume,
        portfolio: updated.portfolio,
        selfIntroduction: updated.selfIntroduction,
      });

      return updated;
    });
  };

  const handleFileDelete = (
    type: 'resume' | 'portfolio' | 'selfIntroduction',
  ) => {
    // input value 초기화
    const inputRef =
      type === 'resume'
        ? resumeInputRef
        : type === 'portfolio'
          ? portfolioInputRef
          : selfIntroductionInputRef;

    if (inputRef.current) {
      inputRef.current.value = '';
    }

    setUploadedFiles((prev) => {
      const updated = {
        ...prev,
        [type]: null,
      };

      // 부모 컴포넌트에 파일 변경 알림
      onFilesChange?.({
        resume: updated.resume,
        portfolio: updated.portfolio,
        selfIntroduction: updated.selfIntroduction,
      });

      return updated;
    });
  };

  const handleLoadDocument = (
    type: 'resume' | 'portfolio' | 'selfIntroduction',
  ) => {
    // TODO: db에서 서류 불러오기
    // onFilesChange?.({})
  };

  const renderFileList = (
    type: 'resume' | 'portfolio' | 'selfIntroduction',
    file: File | null,
    isRequired: boolean,
  ) => {
    const inputRef =
      type === 'resume'
        ? resumeInputRef
        : type === 'portfolio'
          ? portfolioInputRef
          : selfIntroductionInputRef;
    const label =
      type === 'resume'
        ? '이력서 첨부'
        : type === 'portfolio'
          ? '포트폴리오 첨부'
          : '자기소개서 첨부';
    const requiredText = isRequired ? '(필수제출)' : '';

    return (
      <div className="mb-6">
        <div className="mb-3">
          <span className="text-xsmall16 font-medium text-neutral-20">
            {label}
          </span>
          {isRequired && (
            <span className="ml-1 text-xsmall16 font-normal text-primary-90">
              {requiredText}
            </span>
          )}
        </div>

        {file ? (
          <div className="flex items-center">
            {/* TODO: 클릭시 미리보기 */}
            <span className="truncate text-xsmall14 font-normal text-neutral-0 underline">
              {file.name}
            </span>
            <button
              type="button"
              onClick={() => handleFileDelete(type)}
              className="ml-2 flex-shrink-0 text-red-500 hover:text-red-700"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            {/* 파일 업로드 버튼 */}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-2 rounded-xs bg-primary-10 px-4 py-2 text-xsmall14 font-medium text-primary transition hover:bg-primary-20"
            >
              <Upload size={16} />
              파일 업로드
            </button>

            {/* 서류 불러오기 버튼*/}
            {/* TODO: db에 서류 있는 경우 불러오기 */}
            <button
              type="button"
              onClick={() => handleLoadDocument(type)}
              className="flex items-center gap-2 rounded-xs border-[1px] border-neutral-80 bg-white px-4 py-[.375rem] text-xsmall14 font-medium text-neutral-20 transition enabled:hover:bg-neutral-95 disabled:text-neutral-50"
            >
              <RefreshCw size={16} />
              서류 불러오기
            </button>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => handleFileUpload(type, e.target.files)}
        />
      </div>
    );
  };

  return (
    <div className={clsx('', className)}>
      <h2 className="mb-1 text-small18 font-semibold text-neutral-0">
        서류 제출
      </h2>
      <p className="mb-6 text-xsmall14 text-neutral-30">
        PDF 형식만 지원하며, 파일 용량은 500MB 이하로 업로드해 주세요.
      </p>

      {renderFileList('resume', uploadedFiles.resume, true)}
      {renderFileList('portfolio', uploadedFiles.portfolio, true)}
      {renderFileList(
        'selfIntroduction',
        uploadedFiles.selfIntroduction,
        false,
      )}
    </div>
  );
};

export default DocumentUploadSection;
