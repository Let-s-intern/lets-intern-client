import { Button } from '@mui/material';
import { clsx } from 'clsx';
import { useRef, useState } from 'react';

interface FileUploadProps {
  name?: string;
  disabled?: boolean;
  helperText?: string;
  accept?: string;
  maxFileSizeBytes?: number;
  onFileSelect: (file: File | null) => void;
  onUploadClick: (file: File | null) => void;
}

const FileUpload = ({
  name,
  disabled,
  helperText,
  accept,
  maxFileSizeBytes,
  onFileSelect,
  onUploadClick,
}: FileUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    if (file && maxFileSizeBytes != null && file.size > maxFileSizeBytes) {
      const maxMb = Math.round(maxFileSizeBytes / 1024 / 1024);
      alert(`${maxMb}MB 이하의 파일만 업로드할 수 있습니다.`);
      onFileSelect(null);
      setSelectedFile(null);
      if (inputRef.current) inputRef.current.value = '';
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleUploadClick = () => {
    if (disabled) return;
    onUploadClick?.(selectedFile);
  };

  return (
    <div className="flex w-full flex-col items-start gap-2">
      <div className="flex w-full items-center gap-2">
        <Button
          component="label"
          variant="outlined"
          disabled={disabled}
          className="flex-1 justify-start"
          sx={{
            px: 1.7,
            py: 0.75,
            fontSize: 16,
            borderColor: '#c4c4c4',
            '&.Mui-disabled': {
              backgroundColor: '#f9f9f9',
              cursor: 'not-allowed',
            },
          }}
        >
          <span
            className={clsx(
              'w-full text-left',
              disabled ? 'text-[#9a9a9a]' : 'text-[#666666]',
            )}
          >
            {helperText ?? '파일을 추가해주세요.'}
          </span>
          <input
            ref={inputRef}
            type="file"
            name={name}
            accept={accept}
            hidden
            onChange={handleChange}
            disabled={disabled}
          />
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={disabled || !selectedFile}
          onClick={handleUploadClick}
          sx={{ whiteSpace: 'nowrap' }}
        >
          업로드
        </Button>
      </div>
    </div>
  );
};

export default FileUpload;
