import { getPresignedUrl, uploadToS3 } from '@/api/presignedUrl';
import Input from '@/common/input/v1/Input';
import FileUpload from '@/domain/admin/program/ui/form/FileUpload';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import type { CreateGuidebookReq } from '@/schema';
import { generateRandomString } from '@/utils/random';
import { Checkbox, FormControlLabel } from '@mui/material';
import type React from 'react';
import { useCallback, useState } from 'react';

interface GuidebookResourceSectionProps {
  input: CreateGuidebookReq;
  setInput: React.Dispatch<React.SetStateAction<CreateGuidebookReq>>;
  source: 'url' | 'file';
  onChangeSource: (source: 'url' | 'file') => void;
}

const FILE_SIZE = 50 * 1024 * 1024;

const buildGuidebookObjectKey = (fileName: string) => {
  const randomPrefix = generateRandomString();
  const timestamp = Date.now().toString(36);
  return `guidebook/${timestamp}_${randomPrefix}_${fileName}`;
};

const getGuidebookDisplayFileName = ({
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

  if (parts.length >= 3) {
    return parts.slice(2).join('_');
  }

  return decoded;
};

const GuidebookResourceSection: React.FC<GuidebookResourceSectionProps> = ({
  input,
  setInput,
  source,
  onChangeSource,
}) => {
  const { snackbar } = useAdminSnackbar();
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
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

  const isUrl = source === 'url';

  const handleGuidebookUpload = useCallback(
    async (file: File | null) => {
      const targetFile = file ?? pendingFile;
      if (!targetFile) return;

      try {
        const fileNameWithApiUrl = buildGuidebookObjectKey(targetFile.name);
        const presignedUrl = await getPresignedUrl(
          'GUIDEBOOK',
          fileNameWithApiUrl,
        );
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
    [pendingFile, setInput, snackbar],
  );

  const helperFileName = getGuidebookDisplayFileName({
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
          onUploadClick={handleGuidebookUpload}
        />
      </div>
    </section>
  );
};

export default GuidebookResourceSection;
