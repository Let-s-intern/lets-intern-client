import type { UsageFilterChip } from '../utils/usageFilterParams';

/**
 * 적용 중인 조건 (LC-3201, PRD 7.3).
 *
 * 조건이 여럿이면 무엇 때문에 결과가 이렇게 나왔는지 알기 어렵다. 접어 둔 자리의 조건까지
 * 한 줄로 모아 보여주고 하나씩 해제할 수 있게 한다.
 *
 * 필터 입력을 하나하나 되돌리게 하지 않는 이유는, 조건을 지우려고 상세 조건을 펼치고
 * 어떤 칸이 채워져 있는지 찾는 동안 운영이 목록을 잘못 읽기 때문이다.
 */

interface Props {
  chips: UsageFilterChip[];
  onRemove: (chip: UsageFilterChip) => void;
}

const UsageFilterChips = ({ chips, onRemove }: Props) => {
  if (chips.length === 0) return null;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <span className="text-neutral-40 text-xs">적용 중인 조건</span>
      {chips.map((chip) => (
        <span
          key={chip.key}
          className="border-neutral-75 bg-neutral-95 flex items-center gap-2 rounded-full border px-3 py-1 text-xs"
        >
          {chip.label}
          {/* 아이콘 대신 글자로 해제한다. 엑스 표시는 뜻이 사람마다 갈린다. */}
          <button
            type="button"
            aria-label={`${chip.label} 해제`}
            className="text-neutral-40 underline"
            onClick={() => onRemove(chip)}
          >
            해제
          </button>
        </span>
      ))}
    </div>
  );
};

export default UsageFilterChips;
