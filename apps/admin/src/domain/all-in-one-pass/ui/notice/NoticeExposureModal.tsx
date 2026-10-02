import { useGetAllInOnePassListQuery } from '@/api/all-in-one-pass/usePassList';
import { AllInOnePassNotice } from '@/domain/all-in-one-pass/types';
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
  /** 대상 공지. null 이면 모달 닫힘 */
  notice: AllInOnePassNotice | null;
  onClose: () => void;
}

const formatPeriod = (start: string | null, end: string | null) => {
  if (!start && !end) return '-';
  const s = start ? dayjs(start).format('YYYY.MM.DD') : '-';
  const e = end ? dayjs(end).format('YYYY.MM.DD') : '-';
  return `${s} ~ ${e}`;
};

/** A-3 노출 영역 관리: 체크한 올인원패스에만 이 공지/가이드 노출 */
export default function NoticeExposureModal({ notice, onClose }: Props) {
  const open = notice !== null;

  const { data } = useGetAllInOnePassListQuery();
  const passes = data ?? [];
  const allIds = passes.map((p) => p.id);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    if (notice) setSelectedIds(notice.linkedPassIds);
  }, [notice]);

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

  const handleSave = () => {
    // TODO: API 연결 후 노출 영역(linkedPassIds) 저장 뮤테이션 연결
    // eslint-disable-next-line no-console
    console.log('[노출 영역 저장]', { noticeId: notice?.id, selectedIds });
    onClose();
  };

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
        <Button variant="contained" onClick={handleSave}>
          저장하기
        </Button>
      </DialogActions>
    </Dialog>
  );
}
