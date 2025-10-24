import { DocumentType } from '@/api/missionSchema';
import { useGetUserDocumentListQuery } from '@/api/user';
import { UserDocument } from '@/api/userSchema';
import { clsx } from 'clsx';
import { RefreshCw, Trash2, Upload } from 'lucide-react';
import { useRef } from 'react';
import { UploadedFiles } from './MissionSubmitTalentPoolSection';

interface DocumentUploadSectionProps {
  className?: string;
  uploadedFiles: UploadedFiles;
  onFilesChange: (files: UploadedFiles) => void;
}

const DocumentUploadSection = ({
  className,
  uploadedFiles,
  onFilesChange,
}: DocumentUploadSectionProps) => {
  const { data: userDocumentList, isLoading: isUserDocumentListLoading } =
    useGetUserDocumentListQuery();

  const resumeInputRef = useRef<HTMLInputElement>(null);
  const portfolioInputRef = useRef<HTMLInputElement>(null);
  const selfIntroductionInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (type: DocumentType, files: FileList | null) => {
    if (!files || files.length === 0) return;

    // TODO: pdf 형식, 50MB 이하 유효성 검사
    const file = files[0]; // 첫 번째 파일만 사용

    const updatedFiles = {
      ...uploadedFiles,
      [type]: file,
    };

    // 부모 컴포넌트에 파일 변경 알림
    onFilesChange(updatedFiles);
  };

  const handleFileDelete = (type: DocumentType) => {
    // input value 초기화
    const inputRef =
      type === 'RESUME'
        ? resumeInputRef
        : type === 'PORTFOLIO'
          ? portfolioInputRef
          : selfIntroductionInputRef;

    if (inputRef.current) {
      inputRef.current.value = '';
    }

    const updatedFiles: UploadedFiles = {
      ...uploadedFiles,
      [type]: null,
    };

    // 부모 컴포넌트에 파일 변경 알림
    onFilesChange(updatedFiles);
  };

  const handleLoadDocument = (type: DocumentType) => {
    // TODO: db에서 서류 불러오기
    // onFilesChange?.({})
  };

  const handleFilePreview = (file: File | string) => {
    if (typeof file === 'string') {
      // TODO: file이 string인 경우 처리
      return;
    }

    const url = URL.createObjectURL(file);
    const newWindow = window.open(
      url,
      '_blank',
      'width=800,height=600,scrollbars=yes,resizable=yes',
    );

    // 새창이 열리지 않은 경우 URL 해제
    if (!newWindow) {
      URL.revokeObjectURL(url);
    } else {
      // 새창이 닫힐 때 URL 해제를 위한 이벤트 리스너
      newWindow.addEventListener('beforeunload', () => {
        URL.revokeObjectURL(url);
      });
    }
  };

  const renderFileList = (
    type: DocumentType,
    file: File | string | null,
    isRequired: boolean,
  ) => {
    const inputRef =
      type === 'RESUME'
        ? resumeInputRef
        : type === 'PORTFOLIO'
          ? portfolioInputRef
          : selfIntroductionInputRef;
    const label =
      type === 'RESUME'
        ? '이력서 첨부'
        : type === 'PORTFOLIO'
          ? '포트폴리오 첨부'
          : '자기소개서 첨부';
    const requiredText = isRequired ? '(필수제출)' : '';
    const isDocumentExists = userDocumentList?.userDocumentList?.some(
      (document: UserDocument) =>
        document.userDocumentType === type.toUpperCase(),
    );

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
            <button
              type="button"
              onClick={() => handleFilePreview(file)}
              className="truncate text-xsmall14 font-normal text-neutral-0 underline"
            >
              {/* TODO: file이 string인 경우 처리 */}
              {typeof file === 'string' ? file : file.name}
            </button>
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
            <button
              type="button"
              onClick={() => handleLoadDocument(type)}
              disabled={isUserDocumentListLoading || !isDocumentExists}
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

      {renderFileList('RESUME', uploadedFiles.resume, true)}
      {renderFileList('PORTFOLIO', uploadedFiles.portfolio, true)}
      {renderFileList(
        'PERSONAL_STATEMENT',
        uploadedFiles.selfIntroduction,
        false,
      )}
    </div>
  );
};

export default DocumentUploadSection;
