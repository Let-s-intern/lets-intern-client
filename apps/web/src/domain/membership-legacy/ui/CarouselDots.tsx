// 모바일 캐러셀 도트 인디케이터 (매트릭스·타임라인 공용). 데스크톱은 CSS 로 숨김.
export default function CarouselDots({
  count,
  activeIndex,
  onSelect,
  label,
  itemLabel,
}: {
  count: number;
  activeIndex: number;
  onSelect: (i: number) => void;
  label: string;
  itemLabel: (i: number) => string;
}) {
  return (
    <div className="cp-dots" role="tablist" aria-label={label}>
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          type="button"
          className="cp-dot"
          data-active={i === activeIndex ? 'true' : undefined}
          aria-label={itemLabel(i)}
          aria-current={i === activeIndex}
          onClick={() => onSelect(i)}
        />
      ))}
    </div>
  );
}
