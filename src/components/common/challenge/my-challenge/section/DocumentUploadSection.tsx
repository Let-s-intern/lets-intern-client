import { DocumentType } from '@/api/missionSchema';
import { useGetUserDocumentListQuery } from '@/api/user';
import { UserDocument } from '@/api/userSchema';
import { clsx } from 'clsx';
import { RefreshCw, Trash2, Upload } from 'lucide-react';
import { useRef, type RefObject } from 'react';
import { UploadedFiles } from './MissionSubmitTalentPoolSection';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

// 타입에 따라 파일명에서 접두사 제거
const removeTypePrefixFromFileName = (
  type: DocumentType,
  fileName: string,
): string => {
  const typeLower = type.toLowerCase();
  const fileNameLower = fileName.toLowerCase();

  // 파일명이 타입으로 시작하는 경우
  if (fileNameLower.startsWith(typeLower)) {
    // 접두사 + 언더스코어 또는 공백 제거
    const prefixPattern = new RegExp(`^${typeLower}[_-]?`, 'i');
    return fileName.replace(prefixPattern, '');
  }

  return fileName;
};

// URL에서 파일 이름 추출
const getFileNameFromUrl = (type: DocumentType, url: string): string => {
  let fileName = '';

  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    fileName = pathname.substring(pathname.lastIndexOf('/') + 1);
    // URL 디코딩 (특수문자 처리)
    fileName = decodeURIComponent(fileName);
  } catch {
    console.error('URL 파싱 실패:', url);
    return 'FILE_NAME_PARSING_FAILED';
  }

  // 타입 접두사 제거
  return removeTypePrefixFromFileName(type, fileName);
};

// 파일 미리보기 처리
const handleFilePreview = (file: File | string) => {
  const url = typeof file === 'string' ? file : URL.createObjectURL(file);
  const newWindow = window.open(
    url,
    '_blank',
    'width=800,height=600,scrollbars=yes,resizable=yes',
  );

  // File 객체인 경우에만 URL 해제 (string인 경우는 서버 URL이므로 해제하지 않음)
  if (typeof file === 'string' || !newWindow) {
    if (typeof file !== 'string') URL.revokeObjectURL(url);
    return;
  }

  // 새창이 닫힐 때 URL 해제를 위한 이벤트 리스너
  newWindow.addEventListener('beforeunload', () => {
    URL.revokeObjectURL(url);
  });
};

interface DocumentFileItemProps {
  type: DocumentType;
  file: File | string | null;
  isRequired: boolean;
  isSubmitted: boolean;
  inputRef: RefObject<HTMLInputElement>;
  userDocumentList: UserDocument[] | undefined;
  uploadedFiles: UploadedFiles;
  isLoading: boolean;
  onFileUpload: (type: DocumentType, files: FileList | null) => void;
  onFileDelete: (type: DocumentType) => void;
  onLoadDocument: (type: DocumentType) => void;
}

const DocumentFileItem = ({
  type,
  file,
  isRequired,
  isSubmitted,
  inputRef,
  userDocumentList,
  uploadedFiles,
  isLoading,
  onFileUpload,
  onFileDelete,
  onLoadDocument,
}: DocumentFileItemProps) => {
  const label =
    type === 'RESUME'
      ? '이력서 첨부'
      : type === 'PORTFOLIO'
        ? '포트폴리오 첨부'
        : '자기소개서 첨부';

  const isDocumentExists = userDocumentList?.some(
    (document: UserDocument) =>
      document.userDocumentType === type.toUpperCase(),
  );

  // 제출 완료된 경우, 저장된 서류를 찾아서 표시
  const submittedDocument =
    isSubmitted && !file
      ? uploadedFiles?.[type.toLowerCase() as keyof UploadedFiles] || null
      : null;

  // 실제로 표시할 파일 (업로드된 파일 or 제출된 서류)
  const displayFile = file || submittedDocument || null;
  const hasFile = !!displayFile;
  const canEdit = !isSubmitted;
  return (
    <div className="mb-6">
      <div className="mb-3">
        <span className="text-xsmall16 font-medium text-neutral-20">
          {label}
        </span>
        {isRequired && (
          <span className="ml-1 text-xsmall16 font-normal text-primary-90">
            (필수제출)
          </span>
        )}
      </div>

      {hasFile ? (
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => handleFilePreview(displayFile)}
            className="truncate text-xsmall14 font-normal text-neutral-0 underline"
          >
            {typeof displayFile === 'string'
              ? getFileNameFromUrl(type, displayFile)
              : displayFile.name}
          </button>
          {canEdit && file && (
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
        <div className="flex gap-4">
          {/* 파일 업로드 버튼 */}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isSubmitted}
            className="flex items-center gap-2 rounded-xs bg-primary-10 px-4 py-2 text-xsmall14 font-medium text-primary transition hover:bg-primary-15 disabled:cursor-not-allowed disabled:bg-neutral-85 disabled:text-neutral-50"
          >
            <Upload size={16} />
            파일 업로드
          </button>

          {/* 서류 불러오기 버튼*/}
          <button
            type="button"
            onClick={() => onLoadDocument(type)}
            disabled={isSubmitted || isLoading || !isDocumentExists}
            className="flex items-center gap-2 rounded-xs border-[1px] border-neutral-80 bg-white px-4 py-[.375rem] text-xsmall14 font-medium text-neutral-20 transition hover:bg-neutral-95 disabled:cursor-not-allowed disabled:bg-neutral-85 disabled:text-neutral-50"
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
        onChange={(e) => onFileUpload(type, e.target.files)}
        disabled={isSubmitted}
      />
    </div>
  );
};

interface DocumentUploadSectionProps {
  className?: string;
  uploadedFiles: UploadedFiles;
  onFilesChange: (files: UploadedFiles) => void;
  isSubmitted?: boolean;
}

const DocumentUploadSection = ({
  className,
  uploadedFiles,
  onFilesChange,
  isSubmitted = false,
}: DocumentUploadSectionProps) => {
  const { data: userDocumentList, isLoading } = useGetUserDocumentListQuery();
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const portfolioInputRef = useRef<HTMLInputElement>(null);
  const personalStatementInputRef = useRef<HTMLInputElement>(null);

  const resetInput = (type: DocumentType) => {
    const inputRef =
      type === 'RESUME'
        ? resumeInputRef
        : type === 'PORTFOLIO'
          ? portfolioInputRef
          : personalStatementInputRef;
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleFileUpload = (type: DocumentType, files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0]; // 첫 번째 파일만 사용

    // 파일 크기 검증 (50MB 이하)
    if (file.size > MAX_FILE_SIZE) {
      alert('50MB 이하의 PDF 파일만 업로드할 수 있습니다.');
      resetInput(type);
      return;
    }

    const updatedFiles = {
      ...uploadedFiles,
      [type.toLowerCase()]: file,
    };

    onFilesChange(updatedFiles);
  };

  const handleFileDelete = (type: DocumentType) => {
    resetInput(type);

    const updatedFiles: UploadedFiles = {
      ...uploadedFiles,
      [type.toLowerCase()]: null,
    };

    onFilesChange(updatedFiles);
  };

  const handleLoadDocument = (type: DocumentType) => {
    if (!userDocumentList?.userDocumentList) return;

    const document = userDocumentList.userDocumentList.find(
      (doc) => doc.userDocumentType === type,
    );

    if (!document) {
      alert(
        '저장된 서류가 없습니다. "파일 업로드" 버튼을 눌러 파일을 등록해 주세요.',
      );
      return;
    }

    const updatedFiles = {
      ...uploadedFiles,
      [type.toLowerCase()]: document.fileUrl,
    };

    onFilesChange(updatedFiles);
  };

  const commonProps = {
    isSubmitted,
    userDocumentList: userDocumentList?.userDocumentList,
    isLoading,
    uploadedFiles,
    onFileUpload: handleFileUpload,
    onFileDelete: handleFileDelete,
    onLoadDocument: handleLoadDocument,
  };

  return (
    <div className={clsx('', className)}>
      <h2 className="mb-1 text-small18 font-semibold text-neutral-0">
        서류 제출
      </h2>
      <p className="mb-6 text-xsmall14 text-neutral-30">
        PDF 형식만 지원하며, 파일 용량은 50MB 이하로 업로드해 주세요.
      </p>

      <DocumentFileItem
        type="RESUME"
        file={uploadedFiles.resume}
        isRequired
        inputRef={resumeInputRef}
        {...commonProps}
      />
      <DocumentFileItem
        type="PORTFOLIO"
        file={uploadedFiles.portfolio}
        isRequired
        inputRef={portfolioInputRef}
        {...commonProps}
      />
      <DocumentFileItem
        type="PERSONAL_STATEMENT"
        file={uploadedFiles.personal_statement}
        isRequired={false}
        inputRef={personalStatementInputRef}
        {...commonProps}
      />
    </div>
  );
};

export default DocumentUploadSection;
