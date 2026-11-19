import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
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
import {
  useMoveProgramCategory,
  type ProgramCategory,
  type ProgramCategoryGroup,
} from '../programCategoryApi';
import { filterRowsOf } from '../utils/tagUtils';

/** 분류를 다른 필터 줄로. 상품 연결과 페이지는 그대로다 */
const MoveTagDialog = ({
  tag,
  currentRowId,
  groups,
  onClose,
}: {
  tag: ProgramCategory;
  currentRowId: number;
  groups: ProgramCategoryGroup[];
  onClose: () => void;
}) => {
  const { snackbar } = useAdminSnackbar();
  const move = useMoveProgramCategory();
  const rows = filterRowsOf(groups).filter((r) => r.id !== currentRowId);
  const [rowId, setRowId] = useState<number | ''>(rows[0]?.id ?? '');

  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{tag.title} 다른 줄로 옮기기</DialogTitle>
      <DialogContent className="flex flex-col gap-2 !pt-2">
        <Select
          size="small"
          displayEmpty
          value={rowId}
          onChange={(e) => setRowId(e.target.value as number | '')}
        >
          <MenuItem value="" disabled>
            옮길 필터 줄
          </MenuItem>
          {rows.map((r) => (
            <MenuItem key={r.id} value={r.id}>
              {r.title}
              {r.isVisible ? '' : ' (숨김)'}
            </MenuItem>
          ))}
        </Select>
        <p className="text-xxsmall12 text-neutral-40">
          상품 연결과 이 분류의 페이지는 그대로예요. /program 필터에서 보이는
          줄만 바뀌어요.
        </p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button
          variant="contained"
          disabled={rowId === '' || move.isPending}
          onClick={async () => {
            if (rowId === '') return;
            try {
              await move.mutateAsync({
                id: tag.id,
                programCategoryGroupId: rowId,
              });
              onClose();
            } catch {
              snackbar('옮기지 못했습니다.');
            }
          }}
        >
          옮기기
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MoveTagDialog;
