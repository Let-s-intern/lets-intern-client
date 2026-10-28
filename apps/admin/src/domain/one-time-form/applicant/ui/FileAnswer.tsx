import { Button } from '@mui/material';
import { useState } from 'react';

import { getOneTimeFormFileUrl } from '@/api/one-time-form/oneTimeForm';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { download } from '@/lib/download';

interface FileAnswerProps {
  applicationId: number;
  questionId: number;
  name: string;
}

/** 서명 URL 은 10분 뒤 만료되므로 누를 때마다 A10 으로 새로 받아 연다 */
const FileAnswer = ({ applicationId, questionId, name }: FileAnswerProps) => {
  const { snackbar } = useAdminSnackbar();
  const [isOpening, setIsOpening] = useState(false);

  const open = async () => {
    setIsOpening(true);
    try {
      const { url } = await getOneTimeFormFileUrl(applicationId, questionId);
      download(url);
    } catch {
      snackbar('파일을 열지 못했습니다.');
    } finally {
      setIsOpening(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className="min-w-0 break-all">{name}</span>
      <Button
        size="small"
        variant="outlined"
        onClick={open}
        disabled={isOpening}
        aria-label={`${name} 열기`}
      >
        열기
      </Button>
    </div>
  );
};

export default FileAnswer;
