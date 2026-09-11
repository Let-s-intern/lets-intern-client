import {
  allInOnePassListQueryKey,
  useDeleteAllInOnePassMutation,
  useDuplicateAllInOnePassMutation,
} from '@/api/all-in-one-pass/usePassList';
import { AllInOnePassListItem } from '@/domain/all-in-one-pass/types';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { Button } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { Pencil } from 'lucide-react';
import { FaCopy, FaList, FaTrashCan } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

interface Props {
  pass: AllInOnePassListItem;
}

/** 목록 행의 프로그램 관리 액션: 수정 · 참여자 · 복제 · 삭제 */
export default function RowActions({ pass }: Props) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { snackbar } = useAdminSnackbar();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: [allInOnePassListQueryKey] });
  const duplicatePass = useDuplicateAllInOnePassMutation({
    successCallback: invalidate,
  });
  const deletePass = useDeleteAllInOnePassMutation({
    successCallback: invalidate,
  });

  const handleDuplicate = async () => {
    if (!window.confirm(`<${pass.title}> 정말로 복제하시겠습니까?`)) return;
    try {
      await duplicatePass.mutateAsync(pass.id);
      snackbar('복제가 완료되었습니다.');
    } catch (e) {
      snackbar(e instanceof Error ? e.message : '복제에 실패했습니다.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`<${pass.title}> 정말로 삭제하시겠습니까?`)) return;
    try {
      await deletePass.mutateAsync(pass.id);
      snackbar('삭제되었습니다.');
    } catch (e) {
      snackbar(e instanceof Error ? e.message : '삭제에 실패했습니다.');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outlined"
        color="primary"
        size="small"
        startIcon={<Pencil />}
        onClick={() => navigate(`/all-in-one-pass/${pass.id}/edit`)}
      >
        수정
      </Button>
      <Button
        variant="outlined"
        color="info"
        size="small"
        startIcon={<FaList />}
        onClick={() => navigate(`/all-in-one-pass/${pass.id}/users`)}
      >
        참여자
      </Button>
      <Button
        variant="outlined"
        color="info"
        size="small"
        startIcon={<FaCopy />}
        onClick={handleDuplicate}
      >
        복제
      </Button>
      <Button
        variant="outlined"
        color="error"
        size="small"
        startIcon={<FaTrashCan />}
        onClick={handleDelete}
      >
        삭제
      </Button>
    </div>
  );
}
