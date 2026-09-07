import type { ReactNode } from 'react';

interface ListFieldProps<T> {
  label: string;
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
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-600">{label}</span>
        <button
          type="button"
          onClick={() => onChange([...items, makeEmpty()])}
          className="border-primary text-primary rounded-md border px-3 py-1 text-xs font-medium"
        >
          + 추가
        </button>
      </div>

      {items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-gray-300 px-3 py-6 text-center text-xs text-gray-400">
          {placeholder ?? '아직 추가된 항목이 없습니다.'}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((item, index) => (
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
    </div>
  );
}

export default ListField;
