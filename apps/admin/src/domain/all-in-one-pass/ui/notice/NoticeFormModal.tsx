import { NoticeFormValues } from '@/api/all-in-one-pass/useNoticeList';
import { AllInOnePassNotice } from '@/domain/all-in-one-pass/types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';

interface Props {
  notice: AllInOnePassNotice | null;
  isEdit: boolean;
  onSubmit: (values: NoticeFormValues) => void;
  onClose: () => void;
  isLoading?: boolean;
}

/** A-3 공지·가이드 추가/수정 모달 */
export default function NoticeFormModal({
  notice,
  isEdit,
  onSubmit,
  onClose,
  isLoading,
}: Props) {
  const open = notice !== null;

  const [type, setType] = useState<NoticeFormValues['type']>('NOTICE');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (!notice) return;
    setType(notice.type);
    setTitle(notice.title);
    setContent(notice.content);
  }, [notice]);

  const canSave = title.trim() !== '' && content.trim() !== '';

  const handleSubmit = () => {
    if (!canSave) return;
    onSubmit({ type, title: title.trim(), content: content.trim() });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {isEdit ? '공지/가이드 수정' : '공지/가이드 추가'}
      </DialogTitle>
      <DialogContent dividers className="flex flex-col gap-4">
        <TextField
          select
          label="유형"
          value={type}
          onChange={(e) => setType(e.target.value as NoticeFormValues['type'])}
          size="small"
          fullWidth
        >
          <MenuItem value="NOTICE">공지</MenuItem>
          <MenuItem value="GUIDE">가이드</MenuItem>
        </TextField>
        <TextField
          label="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          size="small"
          fullWidth
        />
        <TextField
          label="내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          size="small"
          fullWidth
          multiline
          minRows={4}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          취소하기
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!canSave || isLoading}
        >
          저장하기
        </Button>
      </DialogActions>
    </Dialog>
  );
}
