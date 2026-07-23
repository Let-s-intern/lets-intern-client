'use client';

// 모바일 가로 캐러셀 도트 인디케이터. membership CarouselDots 디자인을 미러링하되
// 디자인시스템 토큰(Tailwind)으로 작성한다. 데스크톱(md↑)에서는 숨긴다.
interface SeminarCarouselDotsProps {
  count: number;
  activeIndex: number;
  onSelect: (i: number) => void;
  label: string;
  itemLabel: (i: number) => string;
}

const SeminarCarouselDots = ({
  count,
  activeIndex,
  onSelect,
  label,
  itemLabel,
}: SeminarCarouselDotsProps) => {
  return (
    <div
      className="flex items-center justify-center gap-2 md:hidden"
      role="tablist"
      aria-label={label}
    >
      {Array.from({ length: count }).map((_, i) => {
        const active = i === activeIndex;
        return (
          <button
            key={i}
            type="button"
            aria-label={itemLabel(i)}
            aria-current={active}
            onClick={() => onSelect(i)}
            className={`h-2 rounded-full transition-all ${active ? 'bg-primary w-5' : 'bg-neutral-80 w-2'}`}
          />
        );
      })}
    </div>
  );
};

export default SeminarCarouselDots;
