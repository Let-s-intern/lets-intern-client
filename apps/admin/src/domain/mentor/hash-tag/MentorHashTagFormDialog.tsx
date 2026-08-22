import { useEffect, useState } from 'react';
import { ApiError } from '@letscareer/api';
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  TextField,
} from '@mui/material';

import {
  usePatchAdminMentorHashTag,
  usePostAdminMentorHashTag,
} from '@/api/mentor/mentor';
import type {
  MentorHashTagItem,
  MentorHashTagReq,
} from '@/api/mentor/mentorSchema';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof ApiError ? error.message : fallback;

interface MentorHashTagFormDialogProps {
  open: boolean;
  /** null이면 생성 모드, 값이 있으면 해당 항목 수정 모드 */
  item: MentorHashTagItem | null;
  existingTypes: string[];
  onClose: () => void;
}

export default function MentorHashTagFormDialog({
  open,
  item,
  existingTypes,
  onClose,
}: MentorHashTagFormDialogProps) {
  const { snackbar } = useAdminSnackbar();
  const postMutation = usePostAdminMentorHashTag();
  const patchMutation = usePatchAdminMentorHashTag();

  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [isNewType, setIsNewType] = useState(false);

  useEffect(() => {
    if (!open) return;
    setType(item?.type ?? '');
    setTitle(item?.title ?? '');
    setIsNewType(false);
  }, [open, item]);

  const handleToggleNewType = (checked: boolean) => {
    setIsNewType(checked);
    setType('');
  };

  const handleSubmit = async () => {
    const body: MentorHashTagReq = { type, title };

    try {
      if (item) {
        await patchMutation.mutateAsync({ mentorHashTagId: item.id, ...body });
        snackbar('키워드가 수정되었습니다.');
      } else {
        await postMutation.mutateAsync(body);
        snackbar('키워드가 생성되었습니다.');
      }
      onClose();
    } catch (error) {
      snackbar(
        getErrorMessage(
          error,
          item ? '키워드 수정에 실패했습니다.' : '키워드 생성에 실패했습니다.',
        ),
      );
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{item ? '키워드 수정' : '키워드 생성'}</DialogTitle>
      <DialogContent className="flex flex-col gap-4">
        <div className="flex items-center gap-5">
          {isNewType ? (
            <TextField
              label="새 타입 생성"
              value={type}
              onChange={(e) => setType(e.target.value)}
              fullWidth
              margin="dense"
            />
          ) : (
            <TextField
              select
              label="타입 선택"
              value={type}
              onChange={(e) => setType(e.target.value)}
              fullWidth
              margin="dense"
            >
              {existingTypes.map((existingType) => (
                <MenuItem key={existingType} value={existingType}>
                  {existingType}
                </MenuItem>
              ))}
            </TextField>
          )}
          <FormControlLabel
            control={
              <Checkbox
                checked={isNewType}
                onChange={(e) => handleToggleNewType(e.target.checked)}
              />
            }
            label="새 타입"
            className="shrink-0 whitespace-nowrap"
          />
        </div>

        <TextField
          label="키워드명"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
        />

        <div className="mt-2 flex gap-2 pb-2">
          <Button
            variant="outlined"
            size="large"
            onClick={onClose}
            className="flex-1"
          >
            취소
          </Button>
          <Button
            variant="contained"
            size="large"
            className="flex-1 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={!type.trim() || !title.trim()}
          >
            저장
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
