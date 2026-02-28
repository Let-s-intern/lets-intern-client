import {
  fetchMagnetForm,
  fetchMagnetsWithForm,
} from '@/domain/admin/blog/magnet/mock';
import { FormQuestion } from '@/domain/admin/blog/magnet/types';
import { Button, Menu, MenuItem } from '@mui/material';
import { Copy } from 'lucide-react';
import { MouseEvent, useMemo, useState } from 'react';

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

  const magnetsWithForm = useMemo(() => {
    return fetchMagnetsWithForm().filter(
      (m) => m.id !== currentMagnetId,
    );
  }, [currentMagnetId]);

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

    const data = await fetchMagnetForm(magnetId);
    onClone(data.questions);
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
        {magnetsWithForm.length === 0 ? (
          <MenuItem disabled>복제할 수 있는 폼이 없습니다</MenuItem>
        ) : (
          magnetsWithForm.map((m) => (
            <MenuItem
              key={m.id}
              onClick={() => handleClone(m.id)}
            >
              [{m.id}] {m.title} ({m.questionCount}개 질문)
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};

export default CloneFormDropdown;
