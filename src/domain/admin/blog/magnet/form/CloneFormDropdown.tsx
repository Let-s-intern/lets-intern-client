'use client';

import { useGetMagnetListQuery } from '@/api/magnet/magnet';
import { magnetQuestionListResponseSchema } from '@/api/magnet/magnetSchema';
import { FormQuestion } from '@/domain/admin/blog/magnet/types';
import { apiQuestionToFormQuestion } from '@/domain/admin/blog/magnet/utils/questionMapper';
import axios from '@/utils/axios';
import { Button, Menu, MenuItem } from '@mui/material';
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

    const res = await axios.get(`/magnet/${magnetId}/questions`);
    const parsed = magnetQuestionListResponseSchema.parse(
      res.data.data,
    );
    const questions = parsed.magnetQuestionList.map(
      apiQuestionToFormQuestion,
    );
    onClone(questions);
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
