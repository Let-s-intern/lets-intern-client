import { EmployeeType } from '@/api/career/careerSchema';
import { WishJobModal } from '@/domain/challenge/my-challenge/talent-pool/WishJobModal';

const options: EmployeeType[] = [
  '정규직',
  '계약직',
  '전환형 인턴',
  '체험형 인턴',
  '프리랜서',
  '파트타임',
  '기타(직접입력)',
];

interface EmployeeTypeModalProps {
  open: boolean;
  onClose: () => void;
  selected?: EmployeeType | null;
  onSelect: (name: EmployeeType) => void;
}

export const EmployeeTypeModal = ({
  open,
  onClose,
  selected,
  onSelect,
}: EmployeeTypeModalProps) => {
  if (!open) return null;

  return (
    <WishJobModal
      title="고용 형태 선택"
      onClose={onClose}
      className="mb-[57px] md:mb-0"
    >
      {options.map((option) => {
        const isSelected = selected === option;
        return (
          <SelectItem
            key={option}
            name={option}
            isSelected={isSelected}
            onClick={() => onSelect(option)}
          />
        );
      })}
    </WishJobModal>
  );
};

const SelectItem = ({
  name,
  isSelected,
  onClick,
}: {
  name: string;
  isSelected: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      key={name}
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-xxs px-3 py-1.5 leading-[26px] ${
        isSelected ? 'text-primary' : 'text-neutral-20 hover:bg-neutral-95'
      }`}
    >
      <span className="text-left">{name}</span>
      {isSelected && (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M16.6667 5L7.50004 14.1667L3.33337 10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
};
