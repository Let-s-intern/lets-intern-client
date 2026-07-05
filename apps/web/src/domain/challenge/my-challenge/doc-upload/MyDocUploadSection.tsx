import LoadingContainer from '@/common/loading/LoadingContainer';
import { DocumentFileItem } from '@/domain/challenge/my-challenge/doc-upload/DocumentFileItem';
import { useMyDocUpload } from '@/domain/challenge/my-challenge/doc-upload/useMyDocUpload';
import { UploadedFiles } from '@/domain/challenge/my-challenge/mission/talent/MissionSubmitTalentPoolSection';
import { clsx } from 'clsx';

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
  const {
    isLoading,
    resumeInputRef,
    portfolioInputRef,
    personalStatementInputRef,
    uploadingType,
    uploadingFiles,
    handleFileUpload,
    handleFileDelete,
  } = useMyDocUpload({ uploadedFiles, onFilesChange, isSubmitted });

  if (isLoading) return <LoadingContainer />;

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
