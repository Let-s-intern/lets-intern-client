import SolidButton from '@components/ui/button/SolidButton';
import { Plus } from 'lucide-react';

interface CareerHeaderProps {
  editingId: number | null;
  createMode: boolean;
  handleCreateBtnClick: () => void;
}

const CareerHeader = ({
  editingId,
  createMode,
  handleCreateBtnClick,
}: CareerHeaderProps) => {
  return (
    <header className="flex items-center justify-between">
      <span className="text-lg font-medium">커리어 기록(경력사항)</span>
      {editingId === null && !createMode && (
        <SolidButton
          variant="secondary"
          size="xs"
          icon={<Plus size={16} />}
          onClick={handleCreateBtnClick}
        >
          경력 정보 추가
        </SolidButton>
      )}
    </header>
  );
};

export default CareerHeader;
