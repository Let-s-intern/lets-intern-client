import { usePostDocumentMutation } from '@/api/mission/mission';
import { DocumentType } from '@/api/mission/missionSchema';
import { convertReportTypeToPathname } from '@/api/report';
import {
  useDeleteUserDocMutation,
  useGetUserDocumentListQuery,
} from '@/api/user/user';
import {
  getPresignedUrl,
  uploadToS3,
} from '@/domain/challenge/api/presignedUrl';
import { useEffect, useRef, useState } from 'react';
import { UploadedFiles } from '../mission/talent/MissionSubmitTalentPoolSection';

const MAX_FILE_SIZE = 50 * 1024 * 1024;

interface UseMyDocUploadParams {
  uploadedFiles: UploadedFiles;
  onFilesChange: (files: UploadedFiles) => void;
  isSubmitted: boolean;
}

export function useMyDocUpload({
  uploadedFiles,
  onFilesChange,
  isSubmitted,
}: UseMyDocUploadParams) {
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

    const file = files[0];

    if (
      file.type !== 'application/pdf' ||
      !file.name.toLowerCase().endsWith('.pdf')
    ) {
      alert('PDF 파일만 업로드할 수 있습니다.');
      resetInput(type);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      alert('50MB 이하의 PDF 파일만 업로드할 수 있습니다.');
      resetInput(type);
      return;
    }

    setUploadingType(type);
    setUploadingFiles((prev) => ({ ...prev, [type]: file }));

    try {
      const fileNameWithApiUrl = `user-document/${convertReportTypeToPathname(type)}/${file.name}`;
      const presignedUrl = await getPresignedUrl(type, fileNameWithApiUrl);

      await uploadToS3(presignedUrl, file);

      const requestData = {
        documentType: type,
        fileUrl: presignedUrl.split('?')[0],
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

  return {
    isLoading,
    resumeInputRef,
    portfolioInputRef,
    personalStatementInputRef,
    uploadingType,
    uploadingFiles,
    handleFileUpload,
    handleFileDelete,
  };
}
