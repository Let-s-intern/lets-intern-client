import type { CheckupQuestion } from '../data/checkup';
import { findCheckupArea } from '../data/checkup';

interface Props {
  question: CheckupQuestion;
  /** 0부터 센 현재 문항 위치 */
  index: number;
  total: number;
  /** 아직 고르지 않았으면 null */
  selected: number | null;
  onSelect: (optionIndex: number) => void;
  /** Q1 에는 넘기지 않는다 — 돌아갈 곳이 없다 */
  onPrev?: () => void;
}

/** 고른 선택지 앞의 채워진 원 */
function OptionMark({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
        checked ? 'border-primary' : 'border-neutral-75'
      }`}
    >
      {checked ? (
        <span className="h-2.5 w-2.5 rounded-full bg-primary" />
      ) : null}
    </span>
  );
}

/**
 * 진단 문항 한 장 (시안 2.png).
 *
 * 상태를 들지 않는다. 현재 문항·고른 답·다음 동작을 전부 밖에서 받아, 같은 카드를
 * 다시 그리는 것만으로 이전 질문으로 돌아간 화면이 된다.
 *
 * "N문항 남음" 의 N 은 현재 문항을 포함한 수다 — 시안에서 Q1 이 `5문항 남음`,
 * Q5 가 `1문항 남음` 이다.
 */
export default function CheckupQuestionCard({
  question,
  index,
  total,
  selected,
  onSelect,
  onPrev,
}: Props) {
  const area = findCheckupArea(question.areaId);
  const answered = index + 1;

  return (
    <div className="rounded-xxl bg-white p-6 md:p-10">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold tracking-wide text-primary md:text-sm">
          QUESTION {question.no} / {String(total).padStart(2, '0')}
        </span>
        <span className="text-xs text-neutral-45 md:text-sm">
          {total - index}문항 남음
        </span>
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-neutral-85">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-300"
          style={{ width: `${(answered / total) * 100}%` }}
        />
      </div>

      <p className="mt-7 text-xs font-bold text-neutral-45 md:mt-9 md:text-sm">
        {area.no} {area.label}
      </p>

      <h3 className="mt-2 text-small18 font-bold leading-snug text-neutral-0 md:text-medium22">
        {question.question}
      </h3>

      {question.hint ? (
        <div className="mt-6 rounded-lg bg-primary-10 p-5 md:p-6">
          <strong className="text-xsmall14 font-bold text-primary">
            {question.hint.title}
          </strong>
          <ul className="mt-3 space-y-2">
            {question.hint.items.map((item) => (
              <li className="text-xsmall14 text-neutral-20" key={item}>
                · {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-6 flex flex-col gap-3">
        {question.options.map((option, optionIndex) => {
          const checked = selected === optionIndex;
          return (
            <button
              aria-pressed={checked}
              className={`flex w-full items-center gap-4 rounded-lg border px-5 py-4 text-left ${
                checked
                  ? 'border-primary bg-primary-5'
                  : 'border-neutral-80 bg-white'
              }`}
              key={option}
              onClick={() => onSelect(optionIndex)}
              type="button"
            >
              <OptionMark checked={checked} />
              <span className="text-xsmall14 leading-relaxed text-neutral-20 md:text-xsmall16">
                {option}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        {onPrev ? (
          <button
            className="text-xsmall14 text-neutral-45"
            onClick={onPrev}
            type="button"
          >
            ← 이전 질문
          </button>
        ) : (
          <span />
        )}
        <span className="text-right text-xsmall14 text-neutral-45">
          {answered === total
            ? '답변을 선택하면 아래에 결과가 나옵니다'
            : '답변을 선택하면 다음 질문으로 넘어갑니다'}
        </span>
      </div>
    </div>
  );
}
