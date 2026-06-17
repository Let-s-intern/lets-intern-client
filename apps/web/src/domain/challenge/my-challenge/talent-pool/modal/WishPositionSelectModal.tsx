import { WishJobModal } from '@/common/modal/WishJobModal';
import { CheckboxItem } from '../WishJobCheckBox';

interface JobField {
  id: number;
  name: string;
}

interface JobPosition {
  id: number;
  name: string;
  fieldId: number;
}

interface WishPositionSelectModalProps {
  selectedField: string;
  selectedPositions: string[];
  jobCategories: JobField[];
  jobPositions: Record<number, JobPosition[]>;
  onPositionSelect: (id: number) => void;
  onBackToField: () => void;
  onClose: () => void;
}

export default function WishPositionSelectModal({
  selectedField,
  selectedPositions,
  jobCategories,
  jobPositions,
  onPositionSelect,
  onBackToField,
  onClose,
}: WishPositionSelectModalProps) {
  const fieldIndex = jobCategories.findIndex(
    (cat) => cat.name === selectedField,
  );
  if (fieldIndex === -1) return null;

  return (
    <WishJobModal
      title="직무 선택 (최대 3개)"
      onClose={onClose}
      footer={
        <>
          <button
            onClick={onBackToField}
            className="rounded-xxs border-primary text-primary flex-1 border py-3"
          >
            이전으로
          </button>
          <button
            onClick={onClose}
            className={`rounded-xxs flex-1 py-3 text-white ${
              selectedPositions.length > 0
                ? 'bg-primary'
                : 'bg-neutral-70 cursor-not-allowed'
            }`}
          >
            선택 완료
          </button>
        </>
      }
    >
      {(jobPositions[fieldIndex] || []).map((item) => {
        const isSelected = selectedPositions.includes(item.name);
        const hasAll = selectedPositions.some((name) =>
          name.includes('직무 전체'),
        );
        const isAllPosition = item.name.includes('직무 전체');
        const isDisabled =
          (!isSelected && selectedPositions.length >= 3) ||
          (!isSelected && !isAllPosition && hasAll);

        return (
          <CheckboxItem
            key={item.id}
            label={item.name}
            isSelected={isSelected}
            isDisabled={isDisabled}
            onChange={() => onPositionSelect(item.id)}
          />
        );
      })}
    </WishJobModal>
  );
}
