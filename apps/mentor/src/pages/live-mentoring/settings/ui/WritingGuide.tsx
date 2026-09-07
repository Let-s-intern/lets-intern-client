import { useState } from 'react';

interface WritingGuideProps {
  /** "이렇게 작성해 보세요" 아래 한 줄 안내. */
  advice: string;
  /** `예시` 칩 아래 줄들. 번호는 순서대로 자동으로 붙는다. */
  examples: readonly string[];
  /** 예시에 번호를 붙이지 않고 "라벨 : 값" 형태로 보여줄 때 쓴다. */
  labeledExamples?: readonly { label: string; value: string }[];
}

const BulbIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 20 20"
    className="h-4 w-4 shrink-0"
    fill="currentColor"
  >
    <path d="M10 2a5 5 0 0 0-3 9v2h6v-2a5 5 0 0 0-3-9Zm-2 12h4v1.5H8V14Zm.75 3h2.5v1h-2.5v-1Z" />
  </svg>
);

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 20 20"
    className={`h-4 w-4 shrink-0 transition-transform ${open ? '' : 'rotate-180'}`}
    fill="currentColor"
  >
    <path d="m10 7.4 4.3 4.3-1.1 1.1L10 9.6l-3.2 3.2-1.1-1.1L10 7.4Z" />
  </svg>
);

/**
 * 섹션별 "작성 방법과 예시 보기" (시안 1·3번).
 *
 * 기본은 펼침이다. 처음 쓰는 멘토가 예시를 보고 시작하게 하는 것이 목적이라,
 * 접혀 있으면 존재를 모른 채 빈 폼을 마주한다.
 */
const WritingGuide = ({
  advice,
  examples,
  labeledExamples,
}: WritingGuideProps) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="overflow-hidden rounded-lg">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="bg-primary-10 text-primary flex w-full items-center gap-2 px-4 py-3 text-sm font-semibold"
      >
        <BulbIcon />
        작성 방법과 예시 보기
        <span className="ml-auto">
          <ChevronIcon open={open} />
        </span>
      </button>

      {open ? (
        <div className="bg-primary-5 px-4 py-4">
          <p className="text-primary mb-1.5 text-sm font-semibold">
            이렇게 작성해 보세요
          </p>
          <p className="text-xsmall14 text-neutral-20">{advice}</p>

          <span className="bg-primary-10 text-primary mt-4 inline-block rounded px-2 py-0.5 text-[11px] font-medium">
            예시
          </span>

          <ul className="mt-2.5 flex flex-col gap-2">
            {examples.map((example, index) => (
              <li
                key={example}
                className="text-xsmall14 text-neutral-10 flex gap-2 font-semibold"
              >
                <span className="text-neutral-40 font-normal">
                  {index + 1} :
                </span>
                {example}
              </li>
            ))}
            {labeledExamples?.map(({ label, value }) => (
              <li
                key={label}
                className="text-xsmall14 text-neutral-10 flex gap-2 font-semibold"
              >
                <span className="text-neutral-40 font-normal">{label} :</span>
                {value}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default WritingGuide;
