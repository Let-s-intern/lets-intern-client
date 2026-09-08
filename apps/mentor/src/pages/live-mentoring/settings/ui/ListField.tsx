import type { ReactNode } from 'react';

interface ListFieldProps<T> {
  label: string;
  /** 라벨 아래 안내 한두 줄. 줄바꿈은 그대로 그린다. */
  hint?: string;
  /** 추가 버튼 문구. 항목마다 부르는 이름이 달라 호출부가 정한다. */
  addLabel?: string;
  items: T[];
  /** 추가 버튼을 눌렀을 때 넣을 빈 항목. */
  makeEmpty: () => T;
  /** 항목 1개의 편집 UI. `update` 로 그 항목만 교체한다. */
  renderItem: (item: T, update: (next: T) => void, index: number) => ReactNode;
  onChange: (items: T[]) => void;
  placeholder?: string;
}

/**
 * 추가·삭제·순서변경이 되는 리스트 편집 필드.
 *
 * 상세 페이지 설정에는 개수가 가변인 항목이 네 군데(경력 줄, 유형 카드, Point,
 * Before/After 사례) 있고 조작 방식이 모두 같다. 각자 구현하면 "삭제만 되고
 * 순서변경은 안 되는" 식으로 화면마다 조작감이 갈리므로 한 곳으로 모은다.
 */
function ListField<T>({
  label,
  hint,
  addLabel,
  items,
  makeEmpty,
  renderItem,
  onChange,
  placeholder,
}: ListFieldProps<T>) {
  const replaceAt = (index: number, next: T) =>
    onChange(items.map((item, i) => (i === index ? next : item)));

  const removeAt = (index: number) =>
    onChange(items.filter((_, i) => i !== index));

  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div>
      {/*
        추가 버튼은 라벨 옆이 아니라 **목록 아래 전체 폭**이다. 같은 화면의 소개 문구·
        유형 카드·결과 사례가 모두 그 모양이라, 여기만 다르면 같은 조작을 매번 다른
        자리에서 찾게 된다.
      */}
      <p className="text-xsmall14 text-neutral-10 font-semibold">{label}</p>
      {hint ? (
        <p className="text-neutral-40 mt-1 whitespace-pre-line text-xs">
          {hint}
        </p>
      ) : null}

      {items.length === 0 ? (
        <p className="mt-3 rounded-lg border border-dashed border-gray-300 px-3 py-6 text-center text-xs text-gray-400">
          {placeholder ?? '아직 추가된 항목이 없습니다.'}
        </p>
      ) : (
        <ul className="mt-3 flex flex-col gap-3">
          {items.map((item, index) => (
            /*
              미리보기 추적 번호(`data-preview-index`)는 여기서 붙이지 않는다.
              항목 하나가 화면보다 크면 미리보기가 그 **중간**을 보여줘 아래쪽 입력이
              화면 밖에 남는다. 어느 단위로 쪼갤지는 항목의 생김새를 아는 `renderItem`
              이 정한다 — 취업 전략은 이미지와 글을 나눠 붙인다(LC-3282).
            */
            <li
              key={index}
              className="rounded-lg border border-gray-200 bg-gray-50 p-3"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">
                  {index + 1}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label={`${label} ${index + 1} 위로`}
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                    className="rounded px-2 py-1 text-xs text-gray-500 disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    aria-label={`${label} ${index + 1} 아래로`}
                    disabled={index === items.length - 1}
                    onClick={() => move(index, 1)}
                    className="rounded px-2 py-1 text-xs text-gray-500 disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    aria-label={`${label} ${index + 1} 삭제`}
                    onClick={() => removeAt(index)}
                    className="rounded px-2 py-1 text-xs text-red-500"
                  >
                    삭제
                  </button>
                </div>
              </div>
              {renderItem(item, (next) => replaceAt(index, next), index)}
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={() => onChange([...items, makeEmpty()])}
        className="border-primary text-primary text-xsmall14 mt-3 w-full rounded-md border py-3 font-medium transition-colors"
      >
        {addLabel ?? `${label} 추가 +`}
      </button>
    </div>
  );
}

export default ListField;
