import {
  PLAYBOOK_INTRO as P,
  type PlaybookIntroLine,
} from '../data/playbookIntro';

/** 강조 어절 하나를 품은 한 줄. 파랑(accent)과 본문색 굵게 두 가지뿐이다 */
function EmphasisLine({ line }: { line: PlaybookIntroLine }) {
  return (
    <>
      {line.lead}
      <strong
        className={`font-bold ${line.accent ? 'text-primary' : 'text-neutral-0'}`}
      >
        {line.strong}
      </strong>
      {line.tail}
    </>
  );
}

/**
 * 개편 시안 8 — 10주 플레이북 인트로 (PRD 4.8).
 *
 * 매트릭스(CoursePlanSection) 바로 위 자리다. 아래 두 섹션이 무엇을 보여 주는지
 * 먼저 말해 준다.
 */
export default function PlaybookIntroSection() {
  return (
    <section className="bg-[#F7F8FC] py-16 md:py-24" id={P.anchorId}>
      <div className="wrap">
        <p className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#11142B] px-4 py-2 text-xs font-bold text-white md:text-sm">
            <span aria-hidden="true">{P.badgeIcon}</span>
            {P.badge}
          </span>
        </p>

        <h2 className="mt-6 text-center text-2xl font-bold leading-snug text-[#11142B] md:text-[2.5rem]">
          {P.titleLines.map((line) => (
            <span className="block" key={line}>
              {line}
            </span>
          ))}
        </h2>

        <p className="text-xsmall14 md:text-xsmall16 text-neutral-40 mt-6 text-center leading-relaxed">
          {P.descLines.map((line) => (
            <span className="block" key={line.strong}>
              <EmphasisLine line={line} />
            </span>
          ))}
        </p>

        {/*
          흐름 칩 6개. 화살표는 칩 사이의 이음새라 목록 항목이 아니다 — aria-hidden 으로
          빼고, 순서 자체는 ol 이 전한다.
        */}
        <ol className="mt-10 flex flex-wrap items-center justify-center gap-2 md:mt-14 md:gap-3">
          {P.chips.map((chip, i) => (
            <li className="flex items-center gap-2 md:gap-3" key={chip}>
              <span className="border-neutral-85 text-xsmall14 text-neutral-0 rounded-full border bg-white px-4 py-2.5 font-medium">
                {chip}
              </span>
              {i < P.chips.length - 1 ? (
                <span aria-hidden="true" className="text-neutral-50 text-xs">
                  →
                </span>
              ) : null}
            </li>
          ))}
        </ol>

        <p className="text-xsmall14 md:text-xsmall16 text-neutral-0 mt-8 text-center font-bold md:mt-10">
          <EmphasisLine line={P.footer} />
        </p>
      </div>
    </section>
  );
}
