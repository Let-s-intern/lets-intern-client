import { useGetAllInOnePassListQuery } from '@/api/all-in-one-pass/usePassList';
import dayjs from '@/lib/dayjs';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { useEffect, useState } from 'react';

interface Props {
  open: boolean;
  /** 현재 노출 중인 패스 id (프리필) */
  initialSelectedIds: number[];
  isSaving: boolean;
  onSave: (membershipIds: number[]) => void;
  onClose: () => void;
}

const formatPeriod = (start: string | null, end: string | null) => {
  if (!start && !end) return '-';
  const s = start ? dayjs(start).format('YYYY.MM.DD') : '-';
  const e = end ? dayjs(end).format('YYYY.MM.DD') : '-';
  return `${s} ~ ${e}`;
};

/**
 * 노출 영역 관리(공지·자료집 공용): 체크한 올인원패스에만 노출.
 * 저장 로직(뮤테이션·스낵바)은 래퍼가 onSave 로 주입.
 */
export default function ExposureModal({
  open,
  initialSelectedIds,
  isSaving,
  onSave,
  onClose,
}: Props) {
  const { data } = useGetAllInOnePassListQuery();
  const passes = data ?? [];
  const allIds = passes.map((p) => p.id);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    if (open) setSelectedIds(initialSelectedIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const isAllSelected =
    allIds.length > 0 && allIds.every((id) => selectedIds.includes(id));
  const isSomeSelected =
    !isAllSelected && allIds.some((id) => selectedIds.includes(id));

  const toggle = (id: number, checked: boolean) =>
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((v) => v !== id),
    );
  const toggleAll = (checked: boolean) =>
    setSelectedIds(checked ? [...allIds] : []);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>노출 영역 관리</DialogTitle>
      <DialogContent dividers className="p-0">
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 96 }}>노출 여부</TableCell>
              <TableCell>올인원패스 제목</TableCell>
              <TableCell sx={{ width: 200 }}>운영 기간</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isSomeSelected}
                  onChange={(e) => toggleAll(e.target.checked)}
                />
              </TableCell>
              <TableCell colSpan={2} className="text-neutral-0 font-medium">
                전체선택
              </TableCell>
            </TableRow>
            {passes.map((pass) => (
              <TableRow key={pass.id} hover>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(pass.id)}
                    onChange={(e) => toggle(pass.id, e.target.checked)}
                  />
                </TableCell>
                <TableCell className="text-neutral-10">
                  {pass.title || '-'}
                </TableCell>
                <TableCell align="right" className="text-neutral-40">
                  {formatPeriod(pass.purchaseStartDate, pass.purchaseEndDate)}
                </TableCell>
              </TableRow>
            ))}
            {passes.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={3}
                  align="center"
                  className="text-neutral-40 py-20"
                >
                  개설된 올인원패스가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          취소하기
        </Button>
        <Button
          variant="contained"
          onClick={() => onSave(selectedIds)}
          disabled={isSaving}
        >
          저장하기
        </Button>
      </DialogActions>
    </Dialog>
  );
}
