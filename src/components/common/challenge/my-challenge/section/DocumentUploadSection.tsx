import { DocumentType } from '@/api/missionSchema';
import { useGetUserDocumentListQuery } from '@/api/user';
import { UserDocument } from '@/api/userSchema';
import { clsx } from 'clsx';
import { RefreshCw, Trash2, Upload } from 'lucide-react';
import { useRef } from 'react';
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
  const personalStatementInputRef = useRef<HTMLInputElement>(null);

  const resetInput = (type: DocumentType) => {
    // input value 초기화
    const inputRef =
      type === 'RESUME'
        ? resumeInputRef
        : type === 'PORTFOLIO'
          ? portfolioInputRef
          : personalStatementInputRef;

    if (inputRef.current) {
      inputRef.current.value = '';
    }
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

    // userDocumentList에서 해당 타입의 문서 찾기
    const document = userDocumentList.userDocumentList.find(
      (doc) => doc.userDocumentType === type,
    );

    if (!document) {
      alert(
        '저장된 서류가 없습니다. "파일 업로드" 버튼을 눌러 파일을 등록해 주세요.',
      );
      return;
    }

    // URL을 string으로 저장
    const updatedFiles = {
      ...uploadedFiles,
      [type.toLowerCase()]: document.fileUrl,
    };

    onFilesChange(updatedFiles);
  };

  const handleFilePreview = (file: File | string) => {
    let url: string;

    if (typeof file === 'string') {
      url = file;
    } else {
      url = URL.createObjectURL(file);
    }

    const newWindow = window.open(
      url,
      '_blank',
      'width=800,height=600,scrollbars=yes,resizable=yes',
    );

    // File 객체인 경우에만 URL 해제 (string인 경우는 서버 URL이므로 해제하지 않음)
    if (typeof file !== 'string' && !newWindow) {
      URL.revokeObjectURL(url);
    } else if (typeof file !== 'string' && newWindow) {
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
          : personalStatementInputRef;
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
              {typeof file === 'string'
                ? getFileNameFromUrl(type, file)
                : file.name}
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
        PDF 형식만 지원하며, 파일 용량은 50MB 이하로 업로드해 주세요.
      </p>

      {renderFileList('RESUME', uploadedFiles.resume, true)}
      {renderFileList('PORTFOLIO', uploadedFiles.portfolio, true)}
      {renderFileList(
        'PERSONAL_STATEMENT',
        uploadedFiles.personal_statement,
        false,
      )}
    </div>
  );
};

export default DocumentUploadSection;
