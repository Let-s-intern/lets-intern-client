import { CHECKUP, CHECKUP_AREAS } from '../data/checkup';
import { REAL_TALK } from '../data/realTalk';

/**
 * 한 줄에서 강조 어절만 색을 바꾼다.
 *
 * 강조어가 줄마다 최대 하나라서 재귀 없이 한 번만 자른다 — 둘 이상을 칠해야 하면
 * CommunityChatSection 의 HeadlineLine 처럼 남은 구간을 다시 훑어야 한다.
 */
function HighlightedLine({
  line,
  highlight,
  className,
}: {
  line: string;
  highlight: string;
  className: string;
}) {
  const at = line.indexOf(highlight);
  if (at === -1) return <>{line}</>;
  return (
    <>
      {line.slice(0, at)}
      <span className={className}>{highlight}</span>
      {line.slice(at + highlight.length)}
    </>
  );
}

/**
 * 시안 1 — REAL TALK. 취준생 질문 5개 → 막히는 4지점 → 무료 진단.
 *
 * 4카드의 라벨과 부연은 `CHECKUP_AREAS` 에서 그린다. 같은 문구를 진단 문항과 결과
 * 화면도 쓰기 때문에, 여기에 직접 적으면 세 화면이 따로 논다.
 *
 * CTA 는 버튼이 아니라 `<a href="#...">` 다. `.membership-root` 에 이미
 * `scroll-behavior: smooth` 가 걸려 있어 부드럽게 넘어가고, 진단 섹션이 아직 렌더되지
 * 않았거나 JS 가 죽어도 앵커는 동작한다.
 */
export default function RealTalkSection() {
  return (
    <section className="bg-[#F4F5F9] py-16 md:py-24" id="real-talk">
      <div className="wrap">
        <p className="text-center text-sm font-bold tracking-wide text-[#F1642B]">
          {REAL_TALK.eyebrow}
        </p>

        <h2 className="text-neutral-0 mt-4 text-center text-2xl font-bold leading-snug md:text-[2rem]">
          {REAL_TALK.titleLines.map((line) => (
            <span className="block" key={line}>
              {line}
            </span>
          ))}
        </h2>

        <div className="mx-auto mt-10 flex max-w-[880px] flex-col gap-4 md:mt-14 md:gap-6">
          {REAL_TALK.bubbles.map((bubble) => (
            <div
              className={`w-full max-w-[520px] rounded-2xl px-6 py-5 md:w-[62%] md:max-w-none ${
                bubble.accent
                  ? 'bg-primary-10 rounded-br-none md:ml-auto'
                  : 'rounded-bl-none bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)] md:mr-auto'
              }`}
              key={bubble.who}
            >
              <span className="text-neutral-45 text-xs font-bold">
                {bubble.who}
              </span>
              <p className="text-xsmall14 md:text-xsmall16 text-neutral-20 mt-2 leading-relaxed">
                {bubble.lines.map((line) => (
                  <span className="block" key={line}>
                    {line}
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>

        <h3 className="text-neutral-0 mt-14 text-center text-xl font-bold leading-snug md:mt-20 md:text-[1.75rem]">
          {REAL_TALK.bridgeLines.map((line) => (
            <span className="block" key={line}>
              <HighlightedLine
                line={line}
                highlight={REAL_TALK.bridgeHighlight}
                className="text-[#F1642B]"
              />
            </span>
          ))}
        </h3>

        <div className="mt-10 grid gap-4 md:mt-12 md:grid-cols-4 md:gap-5">
          {CHECKUP_AREAS.map((area) => (
            <div
              className="rounded-xxl bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.05)] md:p-7"
              key={area.id}
            >
              <span className="text-sm font-bold text-[#F1642B]">
                {area.no}
              </span>
              <strong className="text-small18 text-neutral-0 mt-4 block font-bold">
                {area.label}
              </strong>
              <p className="text-xsmall14 text-neutral-40 mt-3 leading-relaxed">
                {area.desc}
              </p>
            </div>
          ))}
        </div>

        <p className="text-xsmall14 md:text-small18 text-neutral-20 mt-12 text-center font-bold leading-relaxed md:mt-16">
          {REAL_TALK.outroLines.map((line) => (
            <span className="block" key={line}>
              <HighlightedLine
                line={line}
                highlight={REAL_TALK.outroHighlight}
                className="text-primary"
              />
            </span>
          ))}
        </p>

        <div className="mt-7 text-center">
          <a
            className="inline-flex rounded-full bg-white px-8 py-4 shadow-[0_2px_16px_rgba(0,0,0,0.08)]"
            href={`#${CHECKUP.anchorId}`}
          >
            {/*
             * 글자색은 `<a>` 가 아니라 안쪽 span 이 든다. `styles/base.css` 의
             * `.membership-root a { color: inherit }` 은 명시도가 (0,1,1) 이라
             * Tailwind 의 `.text-primary` (0,1,0) 를 순서와 무관하게 이긴다 —
             * `<a>` 에 직접 걸면 색이 그냥 먹지 않는다.
             */}
            <span className="text-primary flex items-center gap-2 text-base font-bold">
              {REAL_TALK.ctaLabel}
              <span aria-hidden="true">↓</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
