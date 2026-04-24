import {
  magnetDetailQueryOptions,
  useGetMagnetListQuery,
} from '@/api/magnet/magnet';
import { FormQuestion } from '@/domain/admin/magnet/types';
import { detailQuestionToFormQuestion } from '@/domain/admin/magnet/utils/questionMapper';
import { Button, Menu, MenuItem } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { Copy } from 'lucide-react';
import { MouseEvent, useState } from 'react';

interface CloneFormDropdownProps {
  currentMagnetId: number;
  hasExistingQuestions: boolean;
  onClone: (questions: FormQuestion[]) => void;
}

const CloneFormDropdown = ({
  currentMagnetId,
  hasExistingQuestions,
  onClone,
}: CloneFormDropdownProps) => {
  const queryClient = useQueryClient();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const { data: magnetListData } = useGetMagnetListQuery();
  const magnets = (magnetListData?.magnetList ?? []).filter(
    (m) => m.magnetId !== currentMagnetId,
  );

  const handleOpen = (e: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClone = async (magnetId: number) => {
    handleClose();

    if (hasExistingQuestions) {
      const confirmed = window.confirm(
        '기존 질문이 모두 대체됩니다. 계속하시겠습니까?',
      );
      if (!confirmed) return;
    }

    try {
      const data = await queryClient.fetchQuery(
        magnetDetailQueryOptions(magnetId),
      );
      const questions = data.magnetQuestionInfo
        .filter((q) => q.type === 'ADDITIONAL')
        .map(detailQuestionToFormQuestion);
      onClone(questions);
    } catch {
      alert('신청폼을 불러오는 데 실패했습니다.');
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<Copy size={16} />}
        onClick={handleOpen}
      >
        신청폼 복제
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {magnets.length === 0 ? (
          <MenuItem disabled>복제할 수 있는 폼이 없습니다</MenuItem>
        ) : (
          magnets.map((m) => (
            <MenuItem
              key={m.magnetId}
              onClick={() => handleClone(m.magnetId)}
            >
              [{m.magnetId}] {m.title}
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};

export default CloneFormDropdown;
