import { Trash2 } from 'lucide-react';

interface SelectionDeleteBarProps {
  selectedCount: number;
  onDelete: () => void;
  isDeleting?: boolean;
}

const SelectionDeleteBar = ({
  selectedCount,
  onDelete,
  isDeleting = false,
}: SelectionDeleteBarProps) => {
  if (selectedCount === 0) {
    return null;
  }

  return (
    // 왼쪽 사이드바(w-48 = 6rem)를 제외한 본문 영역의 가운데에 고정한다.
    <div className="fixed bottom-8 left-[calc(50%+3rem)] z-50 flex -translate-x-1/2 items-center gap-3 rounded-full border border-gray-200 bg-white/95 py-2 pl-5 pr-2 shadow-xl backdrop-blur">
      <span className="text-sm text-gray-700">
        <span className="font-bold text-gray-900">{selectedCount}</span>명
        선택됨
      </span>
      <button
        type="button"
        onClick={onDelete}
        disabled={isDeleting}
        className="flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Trash2 size={16} />
        삭제
      </button>
    </div>
  );
};

export default SelectionDeleteBar;
