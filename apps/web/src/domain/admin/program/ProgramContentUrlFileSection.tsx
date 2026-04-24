import { getPresignedUrl, uploadToS3 } from '@/api/presignedUrl';
import Input from '@/common/input/v1/Input';
import FileUpload from '@/domain/admin/program/ui/form/FileUpload';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { generateRandomString } from '@/utils/random';
import { Checkbox, FormControlLabel } from '@mui/material';
import type React from 'react';
import { useCallback, useState } from 'react';

import type { ContentProgramFormInput } from './programContentTypes';

interface ProgramContentUrlFileSectionProps {
  input: ContentProgramFormInput;
  setInput: React.Dispatch<React.SetStateAction<ContentProgramFormInput>>;
  uploadType: string;
  source: 'url' | 'file';
  onChangeSource: (source: 'url' | 'file') => void;
}

const FILE_SIZE = 50 * 1024 * 1024;

const buildObjectKey = (uploadType: string, fileName: string) => {
  const randomPrefix = generateRandomString();
  const timestamp = Date.now().toString(36);
  return `${uploadType.toLowerCase()}/${timestamp}_${randomPrefix}_${fileName}`;
};

const getDisplayFileName = ({
  uploadedFileName,
  contentFileUrl,
}: {
  uploadedFileName: string;
  contentFileUrl?: string | null;
}) => {
  if (uploadedFileName) return uploadedFileName;
  if (!contentFileUrl) return '';

  const lastSegment = contentFileUrl.split('/').pop() ?? '';
  const decoded = (() => {
    try {
      return decodeURIComponent(lastSegment);
    } catch {
      return lastSegment;
    }
  })();

  const parts = decoded.split('_');
  return parts.length >= 3 ? parts.slice(2).join('_') : decoded;
};

const ProgramContentUrlFileSection: React.FC<
  ProgramContentUrlFileSectionProps
> = ({ input, setInput, uploadType, source, onChangeSource }) => {
  const { snackbar } = useAdminSnackbar();
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const onChangeText = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    },
    [setInput],
  );

  const handleSourceChange = useCallback(
    (nextSource: 'url' | 'file') => () => {
      onChangeSource(nextSource);
      setUploadedFileName('');
      setPendingFile(null);
      setInput((prev) => ({
        ...prev,
        ...(nextSource === 'url' ? { contentFileUrl: '' } : { contentUrl: '' }),
      }));
    },
    [onChangeSource, setInput],
  );

  const handleUpload = useCallback(
    async (file: File | null) => {
      const targetFile = file ?? pendingFile;
      if (!targetFile) return;

      try {
        const objectKey = buildObjectKey(uploadType, targetFile.name);
        const presignedUrl = await getPresignedUrl(uploadType, objectKey);
        await uploadToS3(presignedUrl, targetFile);
        const fileUrl = presignedUrl.split('?')[0];

        setInput((prev) => ({ ...prev, contentFileUrl: fileUrl }));
        setUploadedFileName(targetFile.name);
        setPendingFile(null);
        snackbar('파일이 업로드되었습니다.');
      } catch {
        alert(
          '파일 업로드에 실패했습니다. 파일 용량 또는 서버 설정을 확인해 주세요.',
        );
      }
    },
    [pendingFile, setInput, snackbar, uploadType],
  );

  const isUrl = source === 'url';
  const helperFileName = getDisplayFileName({
    uploadedFileName,
    contentFileUrl: input.contentFileUrl,
  });

  return (
    <section className="-mt-2 flex flex-col gap-3 pb-3">
      <div className="flex flex-col gap-0.5">
        <FormControlLabel
          control={
            <Checkbox checked={isUrl} onChange={handleSourceChange('url')} />
          }
          label="URL 링크"
        />
        <Input
          label="URL을 추가해주세요."
          type="text"
          name="contentUrl"
          size="small"
          disabled={!isUrl}
          value={input.contentUrl ?? ''}
          onChange={onChangeText}
        />
      </div>
      <div className="flex flex-col gap-0.5">
        <FormControlLabel
          control={
            <Checkbox checked={!isUrl} onChange={handleSourceChange('file')} />
          }
          label="파일 첨부"
        />
        <FileUpload
          name="contentFileUrl"
          disabled={isUrl}
          helperText={helperFileName || undefined}
          accept=".pdf,.doc,.docx"
          maxFileSizeBytes={FILE_SIZE}
          onFileSelect={(file) => {
            setPendingFile(file);
            setUploadedFileName(file?.name ?? '');
          }}
          onUploadClick={handleUpload}
        />
      </div>
    </section>
  );
};

export default ProgramContentUrlFileSection;
