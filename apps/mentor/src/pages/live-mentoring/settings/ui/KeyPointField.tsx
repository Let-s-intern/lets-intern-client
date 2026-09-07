import CharCounter from './CharCounter';
interface KeyPointFieldProps {
  bullets: string[];
  onChange: (bullets: string[]) => void;
}

/** 시안 기준 소개 문구는 최대 3개다. */
export const KEY_POINT_MAX = 3;
/** 한 줄 60자. 서버는 500자까지 받지만 상세 페이지 레이아웃이 감당하는 길이가 기준이다. */
export const KEY_POINT_MAX_LENGTH = 60;

const DragHandleIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 20 20"
    className="h-4 w-4 shrink-0"
    fill="currentColor"
  >
    <path d="M7 4h2v2H7V4Zm4 0h2v2h-2V4ZM7 9h2v2H7V9Zm4 0h2v2h-2V9Zm-4 5h2v2H7v-2Zm4 0h2v2h-2v-2Z" />
  </svg>
);

const TrashIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 20 20"
    className="h-4 w-4"
    fill="currentColor"
  >
    <path d="M8 2h4l.5 1H16v2H4V3h3.5L8 2ZM5 6h10l-.8 11.1a1 1 0 0 1-1 .9H6.8a1 1 0 0 1-1-.9L5 6Z" />
  </svg>
);

/**
 * 탭 1 · 소개 문구 목록 (시안 `1-핵심소개.png`).
 *
 * 범용 `ListField` 를 쓰지 않는 이유는 레이아웃이 다르기 때문이다. 시안은 추가 버튼이
 * **목록 아래 전체 폭**이고 행마다 글자수 카운터가 붙는다. `ListField` 는 추가 버튼이
 * 라벨 우측에 있고 카운터 자리가 없다.
 *
 * 순서 변경은 드래그가 아니라 위·아래 버튼으로 둔다 — 드래그 라이브러리를 새로 들이지
 * 않으면서 같은 일을 할 수 있고, 키보드로도 쓸 수 있다. 시안의 핸들 자리에 그대로 둔다.
 */
const KeyPointField = ({ bullets, onChange }: KeyPointFieldProps) => {
  const replaceAt = (index: number, next: string) =>
    onChange(bullets.map((bullet, i) => (i === index ? next : bullet)));

  const removeAt = (index: number) =>
    onChange(bullets.filter((_, i) => i !== index));

  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= bullets.length) return;
    const next = [...bullets];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div>
      <p className="text-xsmall14 text-neutral-10 font-semibold">소개 문구</p>
      <p className="text-neutral-40 mt-1 text-xs">
        최대 {KEY_POINT_MAX}개까지 등록할 수 있으며, 작성한 순서대로 표시돼요.
      </p>

      <ul className="mt-3 flex flex-col gap-2">
        {bullets.map((bullet, index) => (
          <li key={index} className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-neutral-50">
              <span className="flex flex-col">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  aria-label={`${index + 1}번 소개 문구 위로`}
                  className="text-neutral-50 disabled:opacity-30"
                >
                  <DragHandleIcon />
                </button>
              </span>
              <span className="text-xsmall14 text-neutral-20 w-4 text-center font-medium">
                {index + 1}
              </span>
            </span>

            <div className="border-neutral-80 focus-within:border-primary flex flex-1 items-center gap-2 rounded-md border bg-white px-3 py-2.5 transition-colors">
              <input
                value={bullet}
                maxLength={KEY_POINT_MAX_LENGTH}
                onChange={(event) => replaceAt(index, event.target.value)}
                placeholder="멘토링 소개 문구를 입력해주세요"
                aria-label={`소개 문구 ${index + 1}`}
                className="text-xsmall14 text-neutral-10 placeholder:text-neutral-60 min-w-0 flex-1 outline-none"
              />
              <CharCounter value={bullet} max={KEY_POINT_MAX_LENGTH} />
            </div>

            <button
              type="button"
              onClick={() => removeAt(index)}
              aria-label={`${index + 1}번 소개 문구 삭제`}
              className="hover:text-system-error shrink-0 text-neutral-50 transition-colors"
            >
              <TrashIcon />
            </button>
          </li>
        ))}
      </ul>

      {/* 시안 기준 추가 버튼은 목록 아래 전체 폭이다. 라벨 옆이 아니다. */}
      <button
        type="button"
        onClick={() => onChange([...bullets, ''])}
        disabled={bullets.length >= KEY_POINT_MAX}
        className="border-primary text-primary text-xsmall14 mt-2 w-full rounded-md border py-3 font-medium transition-colors disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400"
      >
        소개 문구 추가 +
      </button>
    </div>
  );
};

export default KeyPointField;
