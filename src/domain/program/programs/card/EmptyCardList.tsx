interface EmptyCardListProps {
  onReset: () => void;
}

const EmptyCardList = ({ onReset }: EmptyCardListProps) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 py-20">
      <img
        src="/icons/search-empty.svg"
        alt="검색 결과 없음"
        className="h-24 w-24 opacity-60"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
      <h3 className="text-1.125-semibold text-neutral-20">
        선택한 조건에 맞는 프로그램이 없어요
      </h3>
      <p className="text-0.875 text-center text-neutral-45">
        필터를 조정하거나 초기화해
        <br />
        다른 프로그램을 확인해보세요.
      </p>
      <button
        onClick={onReset}
        className="text-0.875-medium mt-2 flex items-center gap-1.5 rounded-sm border border-neutral-70 px-5 py-2.5 text-neutral-30 transition-colors hover:bg-neutral-95"
      >
        <img className="w-4" src="/icons/redo.svg" alt="필터 초기화 아이콘" />
        필터 초기화
      </button>
    </div>
  );
};

export default EmptyCardList;
