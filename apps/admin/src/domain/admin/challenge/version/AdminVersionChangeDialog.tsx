import { usePatchAdminApplicationVersion } from '@/api/challenge/challenge';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { ChallengeApplication, ChallengeVersion } from '@/schema';
import { ApiError } from '@letscareer/api';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
} from '@mui/material';
import { useState } from 'react';

const getErrorMessage = (error: unknown) =>
  error instanceof ApiError ? error.message : '버전 변경에 실패했습니다.';

interface AdminVersionChangeDialogProps {
  challengeId?: string;
  application: Pick<
    ChallengeApplication['application'],
    'id' | 'name' | 'challengeVersionId'
  >;
  versions: Pick<ChallengeVersion, 'challengeVersionId' | 'title'>[];
  onClose: () => void;
}

/** 운영진이 참여자 버전을 바꾸는 다이얼로그. 마감·횟수 제한이 없다 (설계안 D3) */
export default function AdminVersionChangeDialog({
  challengeId,
  application,
  versions,
  onClose,
}: AdminVersionChangeDialogProps) {
  const { snackbar } = useAdminSnackbar();
  const { mutateAsync, isPending } =
    usePatchAdminApplicationVersion(challengeId);
  // MUI Select 는 null 을 값으로 쓸 수 없어 미선택을 빈 문자열로 둔다
  const [selectedId, setSelectedId] = useState<number | ''>(
    application.challengeVersionId ?? '',
  );

  const isSaveDisabled =
    selectedId === '' ||
    selectedId === application.challengeVersionId ||
    isPending;

  const handleSave = async () => {
    if (selectedId === '') return;
    try {
      await mutateAsync({
        applicationId: application.id,
        challengeVersionId: selectedId,
      });
      snackbar('버전이 변경되었습니다.');
      onClose();
    } catch (error) {
      snackbar(getErrorMessage(error));
    }
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>버전 변경</DialogTitle>
      <DialogContent className="flex flex-col gap-3">
        <p className="text-xsmall14 text-neutral-40">
          {application.name ?? '-'} 님의 버전을 변경합니다.
        </p>
        <Select<number | ''>
          size="small"
          displayEmpty
          value={selectedId}
          onChange={(e) => setSelectedId(Number(e.target.value))}
          inputProps={{ 'aria-label': '버전' }}
        >
          <MenuItem value="" disabled>
            버전 선택
          </MenuItem>
          {versions.map((version) => (
            <MenuItem
              key={version.challengeVersionId}
              value={version.challengeVersionId}
            >
              {version.title}
            </MenuItem>
          ))}
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button
          variant="contained"
          disabled={isSaveDisabled}
          onClick={handleSave}
        >
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
}
