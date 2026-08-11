import { type ReactNode, useEffect, useState } from 'react';

/**
 * 날짜 범위 필터 (LC-3201, PRD 7.3).
 *
 * 시작이 종료보다 늦는 범위를 서버로 보내지 않는다. 보내면 빈 목록이 돌아오는데,
 * 이 화면에서 빈 목록은 "해당하는 건이 없다"로 읽힌다. 입력이 잘못됐다는 사실이
 * 결과와 구분되지 않는 것이 문제다.
 */

export const DATE_RANGE_INVALID_NOTICE = '시작일이 종료일보다 늦습니다.';

interface Range {
  from: string;
  to: string;
}

interface Props {
  label: string;
  from: string;
  to: string;
  onChange: (range: Range) => void;
  /**
   * 날짜 입력과 **같은 줄**에 붙는 것(빠른 선택 등).
   *
   * 밖에서 아래에 덧붙이면 이 칸만 2단이 되어, `items-end` 로 정렬된 필터 줄에서
   * 이 열의 입력만 위로 떠오른다. 같은 줄에 두어야 다른 칸과 기준선이 맞는다.
   */
  trailing?: ReactNode;
}

const UsageDateRangeFilter = ({
  label,
  from,
  to,
  onChange,
  trailing,
}: Props) => {
  /*
    입력값을 따로 들고 있는다. 잘못된 범위를 그 자리에서 되돌려 버리면 무엇을 입력했는지
    화면에서 사라져 무엇이 잘못됐는지 볼 수 없다. 입력은 남기고 조회만 막는다.
  */
  const [draft, setDraft] = useState<Range>({ from, to });

  // 뒤로 가기나 빠른 선택으로 값이 바뀌면 입력칸도 그 값을 보여줘야 한다.
  useEffect(() => setDraft({ from, to }), [from, to]);

  const isInvalid = (range: Range) =>
    Boolean(range.from && range.to && range.from > range.to);

  const change = (patch: Partial<Range>) => {
    const next = { ...draft, ...patch };
    setDraft(next);
    if (isInvalid(next)) return;
    onChange(next);
  };

  const invalid = isInvalid(draft);

  return (
    <div className="text-sm">
      <span className="text-neutral-40 mb-1 block">{label}</span>
      <div className="flex items-center gap-1">
        <input
          type="date"
          aria-label={`${label} 시작`}
          className="border-neutral-75 rounded border px-2 py-1"
          value={draft.from}
          /* 달력에서는 아예 고를 수 없게 한다. 직접 입력은 아래에서 잡는다. */
          max={draft.to || undefined}
          onChange={(e) => change({ from: e.target.value })}
        />
        <span>~</span>
        <input
          type="date"
          aria-label={`${label} 종료`}
          className="border-neutral-75 rounded border px-2 py-1"
          value={draft.to}
          min={draft.from || undefined}
          onChange={(e) => change({ to: e.target.value })}
        />
        {trailing}
      </div>
      {invalid && (
        <p className="text-system-error mt-1 text-xs">
          {DATE_RANGE_INVALID_NOTICE}
        </p>
      )}
    </div>
  );
};

export default UsageDateRangeFilter;
