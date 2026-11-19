import {
  displayTypeLabel,
  type ProgramCategoryDisplayType,
} from '../programCategoryApi';

const DESCRIPTION: Record<ProgramCategoryDisplayType, string> = {
  AUTO: '챌린지·클래스·멘토링·블로그 등 상품 유형에 맞는 카드를 고릅니다.',
  FEATURED: '첫 상품 하나를 크게 보여줍니다. 대표 상품을 강조할 때 씁니다.',
  CARDS: '상품 카드를 가로로 여러 장 보여줍니다.',
  MENTOR: '멘토 사진이 들어간 카드로 보여줍니다. 1:1 멘토링에 맞습니다.',
  BLOG: '썸네일과 제목이 있는 글 카드로 보여줍니다.',
};

const box = 'rounded-[2px] bg-neutral-70';

/** 카드 모양을 작게 그린 그림. 실제 화면 비율과 같지는 않다 */
const Sketch = ({ type }: { type: ProgramCategoryDisplayType }) => {
  switch (type) {
    case 'FEATURED':
      return <div className={`${box} h-8 w-full`} />;
    case 'CARDS':
      return (
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`${box} h-8 flex-1`} />
          ))}
        </div>
      );
    case 'MENTOR':
      return (
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex h-8 flex-1 flex-col items-center justify-center gap-0.5 rounded-[2px] border border-neutral-70"
            >
              <div className="h-3 w-3 rounded-full bg-neutral-70" />
              <div className={`${box} h-1 w-3/4`} />
            </div>
          ))}
        </div>
      );
    case 'BLOG':
      return (
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex h-8 flex-1 flex-col gap-0.5">
              <div className={`${box} h-4`} />
              <div className={`${box} h-1`} />
              <div className={`${box} h-1 w-2/3`} />
            </div>
          ))}
        </div>
      );
    case 'AUTO':
      return (
        <div className="flex h-8 items-center justify-center rounded-[2px] border border-dashed border-neutral-60 text-xxsmall12 text-neutral-40">
          유형에 맞춰
        </div>
      );
  }
};

/** 섹션 카드 모양. 드롭다운 대신 그림이 있는 선택지로 고른다 */
const DisplayTypePicker = ({
  value,
  onChange,
}: {
  value: ProgramCategoryDisplayType;
  onChange: (value: ProgramCategoryDisplayType) => void;
}) => (
  <div className="flex flex-col gap-1.5">
    <div
      role="radiogroup"
      aria-label="카드 모양"
      className="grid grid-cols-5 gap-2"
    >
      {(Object.keys(displayTypeLabel) as ProgramCategoryDisplayType[]).map(
        (type) => {
          const selected = value === type;
          return (
            <button
              key={type}
              type="button"
              role="radio"
              aria-checked={selected}
              title={DESCRIPTION[type]}
              onClick={() => onChange(type)}
              className={`flex flex-col gap-1.5 rounded-xs border bg-white p-2 text-left ${
                selected
                  ? 'border-primary ring-1 ring-primary'
                  : 'border-neutral-90 hover:border-neutral-60'
              }`}
            >
              <Sketch type={type} />
              <span className="text-xxsmall12 font-semibold text-neutral-10">
                {displayTypeLabel[type]}
              </span>
            </button>
          );
        },
      )}
    </div>
    <p className="text-xxsmall12 text-neutral-40">{DESCRIPTION[value]}</p>
  </div>
);

export default DisplayTypePicker;
