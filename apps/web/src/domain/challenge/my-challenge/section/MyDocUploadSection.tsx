import { usePostDocumentMutation } from '@/api/mission/mission';
import { DocumentType } from '@/api/mission/missionSchema';
import { getPresignedUrl, uploadToS3 } from '@/api/presignedUrl';
import { convertReportTypeToPathname } from '@/api/report';
import {
  useDeleteUserDocMutation,
  useGetUserDocumentListQuery,
} from '@/api/user/user';
import LoadingContainer from '@/common/loading/LoadingContainer';
import { getFileNameFromUrl } from '@/utils/getFileNameFromUrl';
import { clsx } from 'clsx';
import { LoaderCircle, Trash2, Upload } from 'lucide-react';
import { useEffect, useRef, useState, type RefObject } from 'react';
import { UploadedFiles } from './MissionSubmitTalentPoolSection';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

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

  // 제출 완료된 경우, 저장된 서류를 찾아서 표시
  const submittedDocument =
    isSubmitted && !file
      ? uploadedFiles?.[type.toLowerCase() as keyof UploadedFiles] || null
      : null;

  // 실제로 표시할 파일 (업로드된 파일 or 제출된 서류)
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

interface MyDocUploadSectionProps {
  className?: string;
  uploadedFiles: UploadedFiles;
  onFilesChange: (files: UploadedFiles) => void;
  isSubmitted?: boolean;
}

const MyDocUploadSection = ({
  className,
  uploadedFiles,
  onFilesChange,
  isSubmitted = false,
}: MyDocUploadSectionProps) => {
  const { data: userDocumentList, isLoading } = useGetUserDocumentListQuery();
  const deleteUserDocMutation = useDeleteUserDocMutation();
  const postDocumentMutation = usePostDocumentMutation();

  const resumeInputRef = useRef<HTMLInputElement>(null);
  const portfolioInputRef = useRef<HTMLInputElement>(null);
  const personalStatementInputRef = useRef<HTMLInputElement>(null);

  const [uploadingType, setUploadingType] = useState<DocumentType | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState<
    Record<DocumentType, File | null>
  >({
    RESUME: null,
    PORTFOLIO: null,
    PERSONAL_STATEMENT: null,
  });
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // 저장된 서류 자동 로드
  useEffect(() => {
    if (!userDocumentList?.userDocumentList || isSubmitted || !isInitialLoad)
      return;

    const documentTypes: DocumentType[] = [
      'RESUME',
      'PORTFOLIO',
      'PERSONAL_STATEMENT',
    ];
    const updatedFiles: UploadedFiles = {
      resume: null,
      portfolio: null,
      personal_statement: null,
    };
    let hasChanges = false;

    documentTypes.forEach((type) => {
      const key = type.toLowerCase() as keyof UploadedFiles;

      const document = userDocumentList.userDocumentList.find(
        (doc) => doc.userDocumentType === type,
      );

      if (document?.fileUrl) {
        updatedFiles[key] = document.fileUrl;
        hasChanges = true;
      }
    });

    if (hasChanges) {
      onFilesChange(updatedFiles);
    }

    setIsInitialLoad(false);
  }, [userDocumentList, isSubmitted, onFilesChange, isInitialLoad]);

  if (isLoading) return <LoadingContainer />;

  const resetInput = (type: DocumentType) => {
    const inputRef =
      type === 'RESUME'
        ? resumeInputRef
        : type === 'PORTFOLIO'
          ? portfolioInputRef
          : personalStatementInputRef;
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleFileUpload = async (
    type: DocumentType,
    files: FileList | null,
  ) => {
    if (!files || files.length === 0) return;

    const file = files[0]; // 첫 번째 파일만 사용

    // 파일 타입 검증
    if (
      file.type !== 'application/pdf' ||
      !file.name.toLowerCase().endsWith('.pdf')
    ) {
      alert('PDF 파일만 업로드할 수 있습니다.');
      resetInput(type);
      return;
    }

    // 파일 크기 검증 (50MB 이하)
    if (file.size > MAX_FILE_SIZE) {
      alert('50MB 이하의 PDF 파일만 업로드할 수 있습니다.');
      resetInput(type);
      return;
    }

    setUploadingType(type);
    setUploadingFiles((prev) => ({ ...prev, [type]: file }));

    try {
      // 1. Presigned URL 받아오기
      const fileNameWithApiUrl = `user-document/${convertReportTypeToPathname(type)}/${file.name}`;
      const presignedUrl = await getPresignedUrl(type, fileNameWithApiUrl);

      // 2. S3에 직접 업로드
      await uploadToS3(presignedUrl, file);

      // 3. 서버에 문서 메타데이터 저장
      const requestData = {
        documentType: type,
        fileUrl: presignedUrl.split('?')[0], // query parameter 제거한 실제 S3 URL
        fileName: file.name,
        wishField: '',
        wishJob: '',
        wishIndustry: '',
      };

      await postDocumentMutation.mutateAsync(requestData);

      const updatedFiles = {
        ...uploadedFiles,
        [type.toLowerCase()]: file,
      };
      onFilesChange(updatedFiles);
    } catch (error) {
      alert('파일 업로드에 실패했습니다.');
      resetInput(type);
    } finally {
      setUploadingType(null);
      setUploadingFiles((prev) => ({ ...prev, [type]: null }));
    }
  };

  const handleFileDelete = async (type: DocumentType) => {
    const document = userDocumentList?.userDocumentList.find(
      (doc) => doc.userDocumentType === type,
    );
    // 문서가 있으면 삭제 API 호출
    if (document?.userDocumentId) {
      try {
        await deleteUserDocMutation.mutateAsync(document?.userDocumentId);
      } catch (error) {
        alert('문서 삭제에 실패했습니다.');
        return;
      }
    }
    const updatedFiles = {
      ...uploadedFiles,
      [type.toLowerCase()]: null,
    };
    onFilesChange(updatedFiles);
    resetInput(type);
  };

  const commonProps = {
    isSubmitted,
    uploadedFiles,
    onFileUpload: handleFileUpload,
    onFileDelete: handleFileDelete,
  };

  return (
    <div className={clsx('', className)}>
      <DocumentFileItem
        type="RESUME"
        file={uploadedFiles.resume}
        inputRef={resumeInputRef}
        isUploading={uploadingType === 'RESUME'}
        uploadingFile={uploadingFiles.RESUME}
        {...commonProps}
      />
      <DocumentFileItem
        type="PORTFOLIO"
        file={uploadedFiles.portfolio}
        inputRef={portfolioInputRef}
        isUploading={uploadingType === 'PORTFOLIO'}
        uploadingFile={uploadingFiles.PORTFOLIO}
        {...commonProps}
      />
      <DocumentFileItem
        type="PERSONAL_STATEMENT"
        file={uploadedFiles.personal_statement}
        inputRef={personalStatementInputRef}
        isUploading={uploadingType === 'PERSONAL_STATEMENT'}
        uploadingFile={uploadingFiles.PERSONAL_STATEMENT}
        {...commonProps}
      />
    </div>
  );
};

export default MyDocUploadSection;
