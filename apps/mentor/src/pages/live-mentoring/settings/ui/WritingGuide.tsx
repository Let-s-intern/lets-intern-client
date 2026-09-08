import { useState } from 'react';

/** 예시 한 줄. `chips` 를 주면 값 대신 태그 모양으로 그린다. */
export interface GuideExample {
  label: string;
  value?: string;
  chips?: readonly string[];
}

/** 예시 묶음. 한 섹션에 입력 그룹이 둘 이상이면 그룹 이름으로 갈라 보여준다. */
export interface GuideGroup {
  heading?: string;
  items: readonly GuideExample[];
}

interface WritingGuideProps {
  /** "이렇게 작성해 보세요" 아래 한 줄 안내. */
  advice: string;
  /** `예시` 칩 아래 줄들. 번호는 순서대로 자동으로 붙는다. */
  examples?: readonly string[];
  /** 번호 대신 "라벨 : 값" 으로 보여줄 예시. 입력 그룹 단위로 묶는다. */
  groups?: readonly GuideGroup[];
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

const ExampleRow = ({ label, value, chips }: GuideExample) => (
  <li className="text-xsmall14 text-neutral-10 flex flex-wrap items-center gap-x-2 gap-y-1.5 font-semibold">
    <span className="text-neutral-40 font-normal">{label} :</span>
    {chips
      ? chips.map((chip) => (
          <span
            key={chip}
            className="bg-neutral-95 text-neutral-30 rounded px-2 py-0.5 text-xs font-normal"
          >
            #{chip}
          </span>
        ))
      : value}
  </li>
);

/**
 * 섹션별 "작성 예시 보기" (시안 1·3번).
 *
 * 기본은 펼침이다. 처음 쓰는 멘토가 예시를 보고 시작하게 하는 것이 목적이라,
 * 접혀 있으면 존재를 모른 채 빈 폼을 마주한다.
 *
 * 한 섹션에 입력 그룹이 둘 이상이어도(멘토링 유형: 안내 문구 + 소개 카드) 안내는
 * **섹션 아래 하나**로 둔다. 그룹마다 접이식 상자를 하나씩 두면 같은 화면에 같은
 * 모양의 상자가 여러 개 쌓여, 어느 것이 무엇의 예시인지 오히려 헷갈린다.
 */
const WritingGuide = ({ advice, examples, groups }: WritingGuideProps) => {
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
        작성 예시 보기
        <span className="ml-auto">
          <ChevronIcon open={open} />
        </span>
      </button>

      {open ? (
        <div className="bg-primary-5 px-4 py-4">
          <p className="text-primary mb-1.5 text-sm font-semibold">
            이렇게 작성해 보세요
          </p>
          <p className="text-xsmall14 text-neutral-20 whitespace-pre-line">
            {advice}
          </p>

          <span className="bg-primary-10 text-primary mt-4 inline-block rounded px-2 py-0.5 text-[11px] font-medium">
            예시
          </span>

          {examples?.length ? (
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
            </ul>
          ) : null}

          {groups?.map((group, index) => (
            <div key={group.heading ?? index} className="mt-3">
              {group.heading ? (
                <p className="text-xsmall14 text-neutral-10 mb-2 font-semibold">
                  {group.heading}
                </p>
              ) : null}
              <ul className="flex flex-col gap-2">
                {group.items.map((item) => (
                  <ExampleRow key={item.label} {...item} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default WritingGuide;
