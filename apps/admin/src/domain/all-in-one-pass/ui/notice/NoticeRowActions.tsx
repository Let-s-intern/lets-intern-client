import { MembershipNotice } from '@/api/all-in-one-pass/membershipSchema';
import { Button } from '@mui/material';
import { Pencil } from 'lucide-react';
import { FaTrashCan } from 'react-icons/fa6';

interface Props {
  notice: MembershipNotice;
  onEdit: (notice: MembershipNotice) => void;
  onDelete: (notice: MembershipNotice) => void;
}

/** A-3 목록 행 관리: 수정 · 삭제 */
export default function NoticeRowActions({ notice, onEdit, onDelete }: Props) {
  return (
    <div className="flex h-full items-center gap-2">
      <Button
        variant="outlined"
        color="primary"
        size="small"
        startIcon={<Pencil />}
        onClick={() => onEdit(notice)}
      >
        수정
      </Button>
      <Button
        variant="outlined"
        color="error"
        size="small"
        startIcon={<FaTrashCan />}
        onClick={() => onDelete(notice)}
      >
        삭제
      </Button>
    </div>
  );
}
