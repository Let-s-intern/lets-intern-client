interface EmptyCardListProps {
  onReset: () => void;
}

const EmptyCardList = ({ onReset }: EmptyCardListProps) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-10 pb-2.5 pt-[76px] md:py-10">
      <div className="flex w-full flex-col items-center justify-center gap-6">
        <img
          src="/images/search-empty.png"
          alt="검색 결과 없음"
          className="max-w-[120px] md:max-w-[160px]"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <div className="flex flex-col gap-3">
          <h3 className="text-xsmall16 text-neutral-20 md:text-small20 font-bold">
            선택한 조건에 맞는 프로그램이 없어요
          </h3>
          <p className="text-xsmall14 text-neutral-45 md:text-xsmall16 text-center">
            필터를 조정하거나 초기화해 <br className="md:hidden" /> 다른
            프로그램을 확인해보세요.
          </p>
        </div>
      </div>
      <button
        onClick={onReset}
        className="rounded-xxs border-primary text-xsmall14 text-primary group flex items-center gap-1 border px-3 py-2"
      >
        <img
          src="/icons/filter-reset.svg"
          alt="필터 초기화 아이콘"
          className="transition-transform duration-200 group-hover:-rotate-180"
        />
        필터 초기화
      </button>
    </div>
  );
};

export default EmptyCardList;
