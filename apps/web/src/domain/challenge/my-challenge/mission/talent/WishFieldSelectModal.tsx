import { WishJobModal } from '@/common/modal/WishJobModal';

interface JobField {
  id: number;
  name: string;
}

interface WishFieldSelectModalProps {
  jobCategories: JobField[];
  selectedField: string | null;
  onFieldSelect: (id: number) => void;
  onClose: () => void;
}

export default function WishFieldSelectModal({
  jobCategories,
  selectedField,
  onFieldSelect,
  onClose,
}: WishFieldSelectModalProps) {
  return (
    <WishJobModal title="직군" onClose={onClose}>
      {jobCategories.map((item) => {
        const isSelected = selectedField === item.name;
        return (
          <button
            key={item.id}
            onClick={() => onFieldSelect(item.id)}
            className={`rounded-xxs flex w-full items-center justify-between px-3 py-1.5 leading-[26px] ${
              isSelected
                ? 'text-primary'
                : 'text-neutral-20 hover:bg-neutral-95'
            }`}
          >
            <span className="text-left">{item.name}</span>
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
      })}
    </WishJobModal>
  );
}
