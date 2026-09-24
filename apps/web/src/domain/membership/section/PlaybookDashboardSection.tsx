import {
  PLAYBOOK_OUTPUT as O,
  PLAYBOOK_STRUCTURE as S,
  PLAYBOOK_WITH as W,
} from '../data/playbookDashboard';
import PlaybookMockTabs from '../ui/PlaybookMockTabs';
import PlaybookWeekTimeline from '../ui/PlaybookWeekTimeline';

/** 시안 10 의 주황 아이브로우. 세 덩어리가 같은 색을 쓴다 */
const EYEBROW = 'text-center text-sm font-bold tracking-wide text-[#F36D32]';

function Eyebrow({ children }: { children: string }) {
  return <p className={EYEBROW}>{children}</p>;
}

function SectionTitle({ lines }: { lines: readonly string[] }) {
  return (
    <h2 className="text-neutral-0 mt-4 text-center text-2xl font-bold leading-snug md:text-[2rem]">
      {lines.map((line) => (
        <span className="block" key={line}>
          {line}
        </span>
      ))}
    </h2>
  );
}

/** 1. WITH LET'S CAREER — 혜택 4카드 + STEP 01~05 → GOAL 세로 흐름 */
function PlaybookWithBlock() {
  return (
    <section className="bg-white py-16 md:py-24" id={W.anchorId}>
      <div className="wrap rv">
        <Eyebrow>{W.eyebrow}</Eyebrow>
        <SectionTitle lines={W.titleLines} />

        <p className="text-xsmall14 md:text-xsmall16 text-neutral-40 mt-6 text-center leading-relaxed">
          <span className="block">{W.subLead}</span>
          <span className="block">
            {W.subTail}
            <strong className="text-neutral-0 font-bold">{W.subStrong}</strong>
          </span>
        </p>

        <ul className="mt-10 grid gap-4 md:mt-14 md:grid-cols-4 md:gap-5">
          {W.benefits.map((benefit) => (
            <li
              className="rounded-xxl border-neutral-85 flex flex-col border bg-white p-6"
              key={benefit.title}
            >
              <span
                aria-hidden="true"
                className="bg-primary-10 flex h-11 w-11 items-center justify-center rounded-xl text-xl"
              >
                {benefit.icon}
              </span>
              <strong className="text-xsmall16 text-neutral-0 mt-5 block font-bold">
                {benefit.title}
              </strong>
              <span className="text-xsmall14 text-neutral-40 mt-3 block leading-relaxed">
                {benefit.desc}
              </span>
            </li>
          ))}
        </ul>

        {/*
          세로 흐름. 화살표는 칸 사이의 이음새라 목록 항목이 아니다 — aria-hidden 으로
          빼고 순서는 ol 이 전한다. 마지막 GOAL 칸만 남색으로 채운다.
        */}
        <ol className="mx-auto mt-12 flex max-w-[560px] flex-col md:mt-16">
          {W.flow.map((step, i) => {
            const isGoal = i === W.flow.length - 1;
            return (
              <li key={step.no}>
                <div
                  className={`flex items-center gap-3 rounded-2xl px-4 py-4 md:gap-4 md:px-6 ${
                    isGoal
                      ? 'bg-[#11142B]'
                      : 'border-neutral-85 border bg-white'
                  }`}
                >
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-[0.7rem] font-bold ${
                      isGoal
                        ? 'text-neutral-0 bg-white'
                        : 'bg-primary text-white'
                    }`}
                  >
                    {step.no}
                  </span>
                  <span
                    className={`text-xsmall14 font-bold ${
                      isGoal ? 'text-white' : 'text-neutral-0'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {!isGoal && (
                  <span
                    aria-hidden="true"
                    className="block py-2 text-center text-sm text-neutral-50"
                  >
                    ↓
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/**
 * 2. PLAYBOOK STRUCTURE — 브라우저 목업.
 *
 * 탭 세 개만 실제로 눌린다 (PRD 5.1). 체크박스·진행률·채용공고는 여전히 보여주기용이라
 * 목업 안에 그림으로 남는다 — 탭 본문은 `PlaybookMockTabs` 가 그린다.
 */
function PlaybookStructureBlock() {
  return (
    <section className="bg-white py-16 md:py-24" id={S.anchorId}>
      <div className="wrap rv">
        <Eyebrow>{S.eyebrow}</Eyebrow>
        <SectionTitle lines={S.titleLines} />

        <p className="text-xsmall14 md:text-xsmall16 text-neutral-40 mt-6 text-center leading-relaxed">
          {S.sub}
        </p>

        <div className="mt-10 md:mt-14">
          <PlaybookMockTabs />
        </div>
      </div>
    </section>
  );
}

/** 3. OUTPUT — 10주 뒤에 손에 남는 것 */
function PlaybookOutputBlock() {
  return (
    <section className="bg-white py-16 md:py-24" id={O.anchorId}>
      <div className="wrap rv">
        <Eyebrow>{O.eyebrow}</Eyebrow>

        <h2 className="text-neutral-0 mt-4 text-center text-2xl font-bold leading-snug md:text-[2rem]">
          <span className="block">{O.titleLead}</span>
          <span className="block">
            <span className="text-primary">{O.titleStrong}</span>
            {O.titleTail}
          </span>
        </h2>

        <PlaybookWeekTimeline />
      </div>
    </section>
  );
}

/** 개편 시안 10 — 플레이북 실행 흐름과 대시보드 (PRD 4.10). */
export default function PlaybookDashboardSection() {
  return (
    <>
      <PlaybookWithBlock />
      <PlaybookStructureBlock />
      <PlaybookOutputBlock />
    </>
  );
}
