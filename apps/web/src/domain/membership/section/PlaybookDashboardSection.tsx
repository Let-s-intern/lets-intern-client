import {
  PLAYBOOK_OUTPUT as O,
  PLAYBOOK_STRUCTURE as S,
  PLAYBOOK_WITH as W,
} from '../data/playbookDashboard';
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
      <div className="wrap">
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

/** 목업 체크박스 — 보여주기용이라 input 이 아니다. 완료 줄만 채워 그린다 */
function MockCheckbox({ done }: { done: boolean }) {
  if (!done) {
    return (
      <span className="border-neutral-75 block h-[18px] w-[18px] shrink-0 rounded-[5px] border bg-white" />
    );
  }
  return (
    <span className="bg-primary flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px]">
      <svg
        className="h-3 w-3"
        fill="none"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
        viewBox="0 0 24 24"
      >
        <path d="M5 13l4 4L19 7" />
      </svg>
    </span>
  );
}

/**
 * 2. PLAYBOOK STRUCTURE — 브라우저 목업.
 *
 * **동작하는 도구가 아니라 목업이다.** 탭·주소 표시줄·체크박스에 동작을 붙이지 않는다 —
 * 눌러도 아무 일이 없는 컨트롤은 사용자를 속인다. 그래서 `button`·`input` 대신
 * `div`·`span` 으로 그린다. 브라우저 크롬(점·주소 표시줄·탭)은 그림일 뿐이라
 * `aria-hidden` 으로 감추고, 주차와 체크리스트 본문은 읽히게 둔다.
 */
function PlaybookStructureBlock() {
  return (
    <section className="bg-white py-16 md:py-24" id={S.anchorId}>
      <div className="wrap">
        <Eyebrow>{S.eyebrow}</Eyebrow>
        <SectionTitle lines={S.titleLines} />

        <p className="text-xsmall14 md:text-xsmall16 text-neutral-40 mt-6 text-center leading-relaxed">
          {S.sub}
        </p>

        <div className="border-neutral-85 rounded-xxl mt-10 select-none overflow-hidden border bg-white shadow-[0_8px_32px_rgba(0,0,0,0.06)] md:mt-14">
          <div aria-hidden="true">
            <div className="flex items-center gap-2 bg-[#F7F8FC] px-4 py-3">
              <span className="bg-neutral-80 h-2.5 w-2.5 rounded-full" />
              <span className="bg-neutral-80 h-2.5 w-2.5 rounded-full" />
              <span className="bg-neutral-80 h-2.5 w-2.5 rounded-full" />
              <span className="text-neutral-45 mx-auto max-w-[70%] truncate rounded-full bg-white px-4 py-1.5 text-xs">
                {S.addressBar}
              </span>
            </div>

            <div className="border-neutral-85 flex flex-wrap gap-1 border-b bg-[#F7F8FC] px-3 pt-2">
              {S.tabs.map((tab, i) => (
                <span
                  className={`flex items-center gap-1.5 rounded-t-lg px-3 py-2.5 text-xs font-bold md:text-sm ${
                    i === 0
                      ? 'border-primary text-primary border border-b-white bg-white'
                      : 'text-neutral-40'
                  }`}
                  key={tab.label}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 md:p-6">
            <strong className="text-xsmall14 md:text-xsmall16 text-neutral-0 block font-bold">
              WEEK {String(S.weekNo).padStart(2, '0')} · {S.weekTitle}
            </strong>
            <span className="text-neutral-45 mt-1 block text-xs">
              {S.weekDesc}
            </span>

            <ul className="mt-4 flex flex-col gap-2">
              {S.checklist.map((row) => (
                <li
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 md:px-4 ${
                    row.done
                      ? 'bg-[#F7F8FC]'
                      : 'border-neutral-85 border bg-white'
                  }`}
                  key={row.label}
                >
                  <MockCheckbox done={row.done} />
                  <span
                    className={`text-xsmall14 min-w-0 flex-1 ${
                      row.done
                        ? 'text-neutral-50 line-through'
                        : 'text-neutral-0'
                    }`}
                  >
                    {row.label}
                  </span>
                  <span className="bg-primary-10 text-primary shrink-0 rounded-full px-2.5 py-1 text-[0.65rem] font-bold">
                    {row.tag}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/** 3. OUTPUT — 10주 뒤에 손에 남는 것 */
function PlaybookOutputBlock() {
  return (
    <section className="bg-white py-16 md:py-24" id={O.anchorId}>
      <div className="wrap">
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
