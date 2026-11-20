import {
  CARD_STYLE_DESCRIPTION,
  CARD_STYLE_LABEL,
  type CardStyle,
} from '../constants/cardStyle';

const bar = 'block rounded-[1px] bg-neutral-80';

/** 웹 카드 모양을 작게 그린 그림 */
const Sketch = ({ style }: { style: CardStyle }) =>
  style === 'FEATURED' ? (
    <div className="flex h-12 gap-2">
      <div className="aspect-[4/3] h-full rounded-[2px] bg-neutral-80" />
      <div className="flex flex-1 flex-col justify-between py-0.5">
        <div className="flex flex-col gap-1">
          <span className={`${bar} h-1.5 w-3/4 bg-neutral-60`} />
          <span className={`${bar} h-1 w-1/2`} />
        </div>
        <div className="flex items-end justify-between border-t border-neutral-85 pt-1">
          <span className={`${bar} h-1 w-1/3`} />
          <span className="block h-2.5 w-6 rounded-[2px] bg-primary/60" />
        </div>
      </div>
    </div>
  ) : (
    <div className="grid h-12 grid-cols-5 gap-1">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="flex flex-col gap-0.5">
          <div className="aspect-[4/3] w-full rounded-[2px] bg-neutral-80" />
          <span className="block h-1 w-2/3 rounded-[1px] bg-primary/40" />
          <span className={`${bar} h-1 w-full bg-neutral-60`} />
        </div>
      ))}
    </div>
  );

/** 섹션 카드 모양. 대표 상품 1개 / 카드 목록 둘 중에서 고른다 */
const DisplayTypePicker = ({
  value,
  onChange,
}: {
  value: CardStyle;
  onChange: (value: CardStyle) => void;
}) => (
  <div className="flex flex-col gap-1.5">
    <div
      role="radiogroup"
      aria-label="카드 모양"
      className="grid max-w-[560px] grid-cols-2 gap-2"
    >
      {(['FEATURED', 'CARDS'] as const).map((style) => {
        const selected = value === style;
        return (
          <button
            key={style}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(style)}
            className={`flex flex-col gap-2 rounded-xs border bg-white p-3 text-left ${
              selected
                ? 'border-primary ring-1 ring-primary'
                : 'border-neutral-90 hover:border-neutral-60'
            }`}
          >
            <Sketch style={style} />
            <span className="text-xsmall14 font-semibold text-neutral-10">
              {CARD_STYLE_LABEL[style]}
            </span>
          </button>
        );
      })}
    </div>
    <p className="max-w-[560px] text-xxsmall12 text-neutral-40">
      {CARD_STYLE_DESCRIPTION[value]}
    </p>
  </div>
);

export default DisplayTypePicker;
