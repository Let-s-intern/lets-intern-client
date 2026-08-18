import CharCounter from './CharCounter';
import type { TemplateResultCase } from '@/api/live-mentoring/liveMentoringSchema';

import ImageField from './ImageField';

interface ResultCaseFieldProps {
  cases: TemplateResultCase[];
  onChange: (cases: TemplateResultCase[]) => void;
}

/** 시안 안내는 "사례는 2~3개 작성을 권장해요". 권장이며 강제하지 않는다. */
export const RESULT_CASE_CAPTION_MAX = 20;

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

const fieldLabel = 'text-xsmall14 text-neutral-10 mb-1.5 block font-medium';
/** 시안의 "(JPG, PNG, WEBP 지원)" 자리. 원본에는 `(@@@@ 형식 지원)` 으로 비어 있었다. */
const formatHint = 'text-neutral-50 ml-1 text-xs font-normal';

/**
 * 탭 6 · 결과 사례 카드 (시안 `5-결과 사례.png`).
 *
 * 한 카드가 Before/After 한 쌍이다. 이미지와 설명이 짝을 이루므로 카드 단위로 묶어
 * 추가·삭제·순서 변경한다.
 */
const ResultCaseField = ({ cases, onChange }: ResultCaseFieldProps) => {
  const patchAt = (index: number, patch: Partial<TemplateResultCase>) =>
    onChange(
      cases.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );

  const removeAt = (index: number) =>
    onChange(cases.filter((_, i) => i !== index));

  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= cases.length) return;
    const next = [...cases];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const captionBox =
    'border-neutral-80 focus-within:border-primary flex items-center gap-2 rounded-md border bg-white px-3 py-2.5 transition-colors';
  const captionInput =
    'text-xsmall14 text-neutral-10 placeholder:text-neutral-60 min-w-0 flex-1 outline-none';

  return (
    <div>
      <p className="text-xsmall14 text-neutral-10 font-semibold">
        결과 사례 카드
      </p>
      <p className="text-neutral-40 mt-1 text-xs">
        사례는 2~3개 작성을 권장해요.
      </p>

      <ul className="mt-3 flex flex-col gap-3">
        {cases.map((item, index) => (
          <li
            key={index}
            className="border-neutral-80 rounded-lg border bg-white p-4"
          >
            <div className="mb-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label={`${index + 1}번 사례 위로`}
                className="text-neutral-50 disabled:opacity-30"
              >
                <DragHandleIcon />
              </button>
              <span className="text-xsmall14 text-neutral-10 font-semibold">
                사례 {index + 1}
              </span>
              <button
                type="button"
                onClick={() => removeAt(index)}
                aria-label={`${index + 1}번 사례 삭제`}
                className="hover:text-system-error ml-auto text-neutral-50 transition-colors"
              >
                <TrashIcon />
              </button>
            </div>

            <div className="flex flex-col gap-4 pl-6">
              <div>
                <span className={fieldLabel}>
                  멘토링 전 이미지
                  <span className={formatHint}>(JPG, PNG, WEBP 지원)</span>
                </span>
                <ImageField
                  value={item.beforeImage}
                  onChange={(beforeImage) => patchAt(index, { beforeImage })}
                />
              </div>

              <div>
                <label className={fieldLabel}>멘토링 전 설명</label>
                <div className={captionBox}>
                  <input
                    value={item.beforeCaption}
                    maxLength={RESULT_CASE_CAPTION_MAX}
                    onChange={(event) =>
                      patchAt(index, { beforeCaption: event.target.value })
                    }
                    placeholder="멘토링 전 상황을 간단히 설명해 주세요"
                    aria-label={`${index + 1}번 사례 멘토링 전 설명`}
                    className={captionInput}
                  />
                  <CharCounter
                    value={item.beforeCaption}
                    max={RESULT_CASE_CAPTION_MAX}
                  />
                </div>
              </div>

              <div>
                <span className={fieldLabel}>
                  멘토링 후 이미지
                  <span className={formatHint}>(JPG, PNG, WEBP 지원)</span>
                </span>
                <ImageField
                  value={item.afterImage}
                  onChange={(afterImage) => patchAt(index, { afterImage })}
                />
              </div>

              <div>
                <label className={fieldLabel}>멘토링 후 설명</label>
                <div className={captionBox}>
                  <input
                    value={item.afterCaption}
                    maxLength={RESULT_CASE_CAPTION_MAX}
                    onChange={(event) =>
                      patchAt(index, { afterCaption: event.target.value })
                    }
                    placeholder="멘토링 후 달라진 점을 간단히 설명해 주세요"
                    aria-label={`${index + 1}번 사례 멘토링 후 설명`}
                    className={captionInput}
                  />
                  <CharCounter
                    value={item.afterCaption}
                    max={RESULT_CASE_CAPTION_MAX}
                  />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() =>
          onChange([
            ...cases,
            {
              beforeImage: null,
              afterImage: null,
              beforeCaption: '',
              afterCaption: '',
            },
          ])
        }
        className="border-primary text-primary text-xsmall14 mt-3 w-full rounded-md border py-3 font-medium transition-colors"
      >
        변화 사례 추가 +
      </button>
    </div>
  );
};

export default ResultCaseField;
