// TODO: 모바일 반응형 스타일

import { DisplayExperienceCategory } from '@/api/userSchema';
import { WishJobModal } from '@components/common/challenge/my-challenge/talent-pool/WishJobModal';

interface ExperienceCategoryModalProps {
  open: boolean;
  onClose: () => void;
  selected: string;
  categories: DisplayExperienceCategory[];
  onSelect: (name: DisplayExperienceCategory) => void;
}
export const ExperienceCategoryModal = ({
  open,
  onClose,
  selected,
  categories,
  onSelect,
}: ExperienceCategoryModalProps) => {
  if (!open) return null;

  return (
    <WishJobModal title="경험 분류 선택" onClose={onClose}>
      {categories.map((name) => {
        const isSelected = selected === name;
        return (
          <SelectItem
            key={name}
            name={name}
            isSelected={isSelected}
            onClick={() => onSelect(name)}
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
