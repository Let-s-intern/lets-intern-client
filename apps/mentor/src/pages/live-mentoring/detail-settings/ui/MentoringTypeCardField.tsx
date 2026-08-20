import CharCounter from './CharCounter';
import type { TemplateMentoringType } from '@/api/live-mentoring/liveMentoringSchema';
import type { MentorHashTagItem } from '@/api/mentor-hash-tag/mentorHashTagSchema';

interface MentoringTypeCardFieldProps {
  items: TemplateMentoringType[];
  /**
   * 선택 가능한 태그. **상위에서 한 번 조회해 내려준다.**
   * 카드가 최대 5개라 카드별로 조회하면 같은 요청이 다섯 번 나가고,
   * 이 컴포넌트가 QueryClient 에 묶여 단독 테스트가 어려워진다.
   */
  hashTags: MentorHashTagItem[];
  onChange: (items: TemplateMentoringType[]) => void;
}

/** 시안 안내는 "2~5개 작성을 권장해요". 상한만 막고 하한은 권장으로 둔다. */
export const TYPE_CARD_MAX = 5;
/** 카드 1 에만 `*` 이 있다 — 최소 1개는 있어야 섹션이 성립한다. */
export const TYPE_CARD_MIN = 1;
export const TYPE_TEXT_MAX = 60;
export const TYPE_TAG_MAX = 3;

/**
 * 유형 선택 드롭다운 (PRD §8.1).
 *
 * 오픈 설정의 타입 선택과 같은 어휘를 쓴다. 서버 `typeName` 은 자유 문자열(100자)이라
 * 라벨을 그대로 담는다.
 */
const TYPE_OPTIONS = ['자기소개서', '이력서', '포트폴리오'] as const;

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

const rowLabel = 'text-xsmall14 text-neutral-30 w-20 shrink-0 font-medium';
const inputBox =
  'border-neutral-80 focus-within:border-primary flex flex-1 items-center gap-2 rounded-md border bg-white px-3 py-2.5 transition-colors';
const inputText =
  'text-xsmall14 text-neutral-10 placeholder:text-neutral-60 min-w-0 flex-1 outline-none';

/**
 * 탭 3 · 유형 소개 카드 (시안 `3-멘토링 유형.png`).
 */
const MentoringTypeCardField = ({
  items,
  hashTags,
  onChange,
}: MentoringTypeCardFieldProps) => {
  const patchAt = (index: number, patch: Partial<TemplateMentoringType>) =>
    onChange(
      items.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );

  const removeAt = (index: number) =>
    onChange(items.filter((_, i) => i !== index));

  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const toggleTag = (index: number, tag: string) => {
    const current = items[index].tags;
    if (current.includes(tag)) {
      patchAt(index, { tags: current.filter((t) => t !== tag) });
      return;
    }
    if (current.length >= TYPE_TAG_MAX) return;
    patchAt(index, { tags: [...current, tag] });
  };

  return (
    <div>
      <p className="text-xsmall14 text-neutral-10 font-semibold">
        유형 소개 카드
      </p>
      <p className="text-neutral-40 mt-1 text-xs">
        멘토링 유형별 상세 설명 카드예요. 입력한 순서대로 표시돼요.
        <br />
        2~{TYPE_CARD_MAX}개 작성을 권장해요.
      </p>

      <ul className="mt-3 flex flex-col gap-3">
        {items.map((item, index) => (
          <li
            key={index}
            className="border-neutral-80 rounded-lg border bg-white p-4"
          >
            <div className="mb-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label={`${index + 1}번 소개 카드 위로`}
                className="text-neutral-50 disabled:opacity-30"
              >
                <DragHandleIcon />
              </button>
              <span className="text-xsmall14 text-neutral-10 font-semibold">
                멘토링 소개 카드 {index + 1}
                {index === 0 ? (
                  <span className="text-system-error ml-0.5">*</span>
                ) : null}
              </span>
              <button
                type="button"
                onClick={() => removeAt(index)}
                aria-label={`${index + 1}번 소개 카드 삭제`}
                className="hover:text-system-error ml-auto text-neutral-50 transition-colors"
              >
                <TrashIcon />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className={rowLabel}>유형 선택</span>
                <div className={inputBox}>
                  <select
                    value={item.typeName}
                    onChange={(event) =>
                      patchAt(index, { typeName: event.target.value })
                    }
                    aria-label={`${index + 1}번 카드 유형 선택`}
                    className={`${inputText} bg-transparent`}
                  >
                    <option value="">멘토링 유형을 선택해주세요</option>
                    {TYPE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={rowLabel}>유형 제목</span>
                <div className={inputBox}>
                  <input
                    value={item.title}
                    maxLength={TYPE_TEXT_MAX}
                    onChange={(event) =>
                      patchAt(index, { title: event.target.value })
                    }
                    placeholder="멘토링 유형 제목을 작성해주세요"
                    aria-label={`${index + 1}번 카드 유형 제목`}
                    className={inputText}
                  />
                  <CharCounter value={item.title} max={TYPE_TEXT_MAX} />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={rowLabel}>부가 설명</span>
                <div className={inputBox}>
                  <input
                    value={item.description}
                    maxLength={TYPE_TEXT_MAX}
                    onChange={(event) =>
                      patchAt(index, { description: event.target.value })
                    }
                    placeholder="유형에 대한 부가 설명을 작성해주세요"
                    aria-label={`${index + 1}번 카드 부가 설명`}
                    className={inputText}
                  />
                  <CharCounter value={item.description} max={TYPE_TEXT_MAX} />
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className={`${rowLabel} pt-2.5`}>관련 태그</span>
                <div className="flex-1">
                  <div className="flex flex-wrap gap-1.5">
                    {hashTags.map((tag) => {
                      const selected = item.tags.includes(tag.title);
                      const full =
                        !selected && item.tags.length >= TYPE_TAG_MAX;
                      return (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => toggleTag(index, tag.title)}
                          disabled={full}
                          aria-pressed={selected}
                          className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
                            selected
                              ? 'border-primary bg-primary-10 text-primary font-medium'
                              : 'border-neutral-80 text-neutral-30 disabled:opacity-40'
                          }`}
                        >
                          #{tag.title}
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-1.5 text-xs text-neutral-50">
                    관련 태그를 최대 {TYPE_TAG_MAX}개 선택해주세요
                  </p>
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
            ...items,
            { typeName: '', title: '', description: '', tags: [] },
          ])
        }
        disabled={items.length >= TYPE_CARD_MAX}
        className="border-primary text-primary text-xsmall14 mt-3 w-full rounded-md border py-3 font-medium transition-colors disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400"
      >
        소개 카드 추가 +
      </button>
    </div>
  );
};

export default MentoringTypeCardField;
