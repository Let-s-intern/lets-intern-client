import { ChallengeVersion, MissionContentsReq } from '@/schema';
import { Content } from '@/types/interface';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  IconButton,
  MenuItem,
  Select,
} from '@mui/material';
import { useRef, useState } from 'react';
import { FaTrashCan } from 'react-icons/fa6';

// MUI Select 는 null 을 값으로 쓸 수 없어 공통(버전 null)을 문자열로 대신한다
const COMMON_VALUE = 'COMMON';

const TYPE_LABEL = {
  ESSENTIAL: '필수 자료',
  ADDITIONAL: '추가 자료',
} as const;

type DraftRow = {
  key: number;
  challengeVersionId: number | null;
  contentsId: number | null;
};

interface MissionContentsVersionDialogProps {
  open: boolean;
  th: number;
  type: keyof typeof TYPE_LABEL;
  versions: Pick<ChallengeVersion, 'challengeVersionId' | 'title'>[];
  contentsOptions: Content[];
  initialValue: MissionContentsReq[];
  onClose: () => void;
  onSave: (value: MissionContentsReq[]) => void;
}

/** 미션 자료를 버전별로 거는 다이얼로그. 같은 자료를 두 버전에 걸면 행이 두 개다 (설계안 D5) */
export default function MissionContentsVersionDialog({
  open,
  ...formProps
}: MissionContentsVersionDialogProps) {
  return (
    <Dialog open={open} onClose={formProps.onClose} fullWidth maxWidth="md">
      {/* 닫히면 언마운트돼 다시 열 때 initialValue 로 새로 시작한다 */}
      <MissionContentsVersionForm {...formProps} />
    </Dialog>
  );
}

function MissionContentsVersionForm({
  th,
  type,
  versions,
  contentsOptions,
  initialValue,
  onClose,
  onSave,
}: Omit<MissionContentsVersionDialogProps, 'open'>) {
  const [rows, setRows] = useState<DraftRow[]>(() =>
    initialValue.map((item, index) => ({
      key: index,
      challengeVersionId: item.challengeVersionId,
      contentsId: item.contentsId,
    })),
  );
  const nextKey = useRef(initialValue.length);

  // 자료를 고르지 않은 행은 저장 값에서 뺀다
  const selected = rows.flatMap(({ contentsId, challengeVersionId }) =>
    contentsId === null ? [] : [{ contentsId, challengeVersionId }],
  );
  const hasDuplicate =
    new Set(
      selected.map((item) => `${item.challengeVersionId}-${item.contentsId}`),
    ).size < selected.length;

  const updateRow = (key: number, patch: Partial<Omit<DraftRow, 'key'>>) => {
    setRows((prev) =>
      prev.map((row) => (row.key === key ? { ...row, ...patch } : row)),
    );
  };

  const addRow = () => {
    const key = nextKey.current++;
    setRows((prev) => [
      ...prev,
      { key, challengeVersionId: null, contentsId: null },
    ]);
  };

  const removeRow = (key: number) => {
    setRows((prev) => prev.filter((row) => row.key !== key));
  };

  return (
    <>
      <DialogTitle>{`${th}회차 ${TYPE_LABEL[type]}`}</DialogTitle>
      <DialogContent>
        <ul className="flex flex-col gap-2 pt-1">
          {rows.map((row) => (
            <li key={row.key} className="flex items-center gap-2">
              <Select<string | number>
                size="small"
                value={row.challengeVersionId ?? COMMON_VALUE}
                onChange={(e) =>
                  updateRow(row.key, {
                    challengeVersionId:
                      e.target.value === COMMON_VALUE
                        ? null
                        : Number(e.target.value),
                  })
                }
                inputProps={{ 'aria-label': '버전' }}
                sx={{ minWidth: 140, fontSize: '14px' }}
              >
                <MenuItem value={COMMON_VALUE}>공통</MenuItem>
                {versions.map((version) => (
                  <MenuItem
                    key={version.challengeVersionId}
                    value={version.challengeVersionId}
                  >
                    {version.title}
                  </MenuItem>
                ))}
              </Select>
              <Select<number | ''>
                size="small"
                displayEmpty
                value={row.contentsId ?? ''}
                onChange={(e) =>
                  updateRow(row.key, { contentsId: Number(e.target.value) })
                }
                inputProps={{ 'aria-label': '자료' }}
                sx={{ flex: 1, fontSize: '14px' }}
              >
                <MenuItem value="" disabled>
                  자료 선택
                </MenuItem>
                {contentsOptions.map((contents) => (
                  <MenuItem key={contents.id} value={contents.id}>
                    ({contents.id}) {contents.title}
                  </MenuItem>
                ))}
              </Select>
              <IconButton
                aria-label="삭제"
                color="error"
                size="small"
                onClick={() => removeRow(row.key)}
              >
                <FaTrashCan />
              </IconButton>
            </li>
          ))}
        </ul>
        <Button variant="outlined" size="small" onClick={addRow} sx={{ mt: 2 }}>
          행 추가
        </Button>
        {hasDuplicate ? (
          <FormHelperText error>
            같은 버전에 같은 자료가 두 번 걸려 있습니다
          </FormHelperText>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button
          variant="contained"
          disabled={hasDuplicate}
          onClick={() => onSave(selected)}
        >
          저장
        </Button>
      </DialogActions>
    </>
  );
}
