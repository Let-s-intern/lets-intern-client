import { useState } from 'react';

import {
  PLAYBOOK_STRUCTURE as S,
  type PlaybookTabId,
} from '../data/playbookDashboard';

/**
 * 브라우저 목업의 탭 세 개 (PRD 5.1~5.4).
 *
 * **탭만 동작한다.** 체크박스·진행률은 계속 보여주기용이고, 채용공고·리더보드도
 * 화면 안의 예시다 — 서버에서 받아오지 않는다. 눌러도 아무 일이 없는 컨트롤은
 * 사용자를 속이므로 체크박스는 `input` 이 아니라 `span` 으로 그린다.
 *
 * 문구는 전부 `data/playbookDashboard.ts` 에 있다. 여기에는 적지 않는다.
 */

const PANEL_TITLE =
  'text-xsmall14 md:text-xsmall16 text-neutral-0 block font-bold';
const PANEL_DESC = 'text-neutral-45 mt-1 block text-xs';

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

/** 탭 1 — 10주 취준 계획 (시안 6). WEEK 04 체크리스트 5줄 */
function PlanPanel() {
  return (
    <>
      <strong className={PANEL_TITLE}>
        WEEK {String(S.weekNo).padStart(2, '0')} · {S.weekTitle}
      </strong>
      <span className={PANEL_DESC}>{S.weekDesc}</span>

      <ul className="mt-4 flex flex-col gap-2">
        {S.checklist.map((row) => (
          <li
            className={`flex items-center gap-3 rounded-xl px-3 py-3 md:px-4 ${
              row.done ? 'bg-[#F7F8FC]' : 'border-neutral-85 border bg-white'
            }`}
            key={row.label}
          >
            <MockCheckbox done={row.done} />
            <span
              className={`text-xsmall14 min-w-0 flex-1 ${
                row.done ? 'text-neutral-50 line-through' : 'text-neutral-0'
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
    </>
  );
}

/**
 * 탭 2 — 마케팅 채용공고 모음 (시안 7).
 *
 * 마감 배지는 연분홍 바탕에 붉은 글자, 상시 채용만 회색 테두리다.
 */
function JobsPanel() {
  return (
    <>
      <strong className={PANEL_TITLE}>{S.jobs.title}</strong>
      <span className={PANEL_DESC}>{S.jobs.desc}</span>

      <ul className="border-neutral-85 mt-4 overflow-hidden rounded-xl border">
        {S.jobs.rows.map((row) => (
          <li
            className="border-neutral-85 flex items-center gap-3 border-b px-3 py-4 last:border-b-0 md:px-5"
            key={row.title}
          >
            <div className="min-w-0 flex-1">
              <span className="text-neutral-45 block text-xs">
                {row.company}
              </span>
              <strong className="text-xsmall14 text-neutral-0 mt-1 block font-bold">
                {row.title}
              </strong>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {row.tags.map((tag) => (
                  <li
                    className="border-neutral-85 text-neutral-45 rounded-full border bg-[#F7F8FC] px-2.5 py-1 text-[0.65rem]"
                    key={tag}
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </div>

            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-[0.65rem] font-bold ${
                row.alwaysOpen
                  ? 'border-neutral-80 text-neutral-45 border bg-white'
                  : 'bg-[#FFF2F0] text-[#F0563F]'
              }`}
            >
              {row.deadline}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}

/** 탭 3 — 패스 참여자 리더보드 (시안 8) */
function LeaderboardPanel() {
  return (
    <>
      <strong className={PANEL_TITLE}>{S.leaderboard.title}</strong>
      <span className={PANEL_DESC}>{S.leaderboard.desc}</span>
    </>
  );
}

/** 탭 순서가 바뀌어도 본문이 어긋나지 않도록 id 로 짝짓는다 */
const PANELS: Record<PlaybookTabId, () => React.ReactElement> = {
  plan: PlanPanel,
  jobs: JobsPanel,
  leaderboard: LeaderboardPanel,
};

const tabId = (id: PlaybookTabId) => `playbook-tab-${id}`;
const panelId = (id: PlaybookTabId) => `playbook-panel-${id}`;

export default function PlaybookMockTabs() {
  const [active, setActive] = useState<PlaybookTabId>(S.tabs[0].id);
  const Panel = PANELS[active];

  return (
    <div className="border-neutral-85 rounded-xxl overflow-hidden border bg-white shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
      {/* 브라우저 크롬의 점과 주소 표시줄은 그림일 뿐이라 읽히지 않게 둔다 */}
      <div
        aria-hidden="true"
        className="flex select-none items-center gap-2 bg-[#F7F8FC] px-4 py-3"
      >
        <span className="bg-neutral-80 h-2.5 w-2.5 rounded-full" />
        <span className="bg-neutral-80 h-2.5 w-2.5 rounded-full" />
        <span className="bg-neutral-80 h-2.5 w-2.5 rounded-full" />
        <span className="text-neutral-45 mx-auto max-w-[70%] truncate rounded-full bg-white px-4 py-1.5 text-xs">
          {S.addressBar}
        </span>
      </div>

      <div
        aria-label={S.tabsLabel}
        className="border-neutral-85 flex flex-wrap gap-1 border-b bg-[#F7F8FC] px-3 pt-2"
        role="tablist"
      >
        {S.tabs.map((tab) => {
          const selected = tab.id === active;
          return (
            <button
              aria-controls={panelId(tab.id)}
              aria-selected={selected}
              className={`flex items-center gap-1.5 rounded-t-lg px-3 py-2.5 text-xs font-bold transition-colors md:text-sm ${
                selected
                  ? 'border-primary text-primary border border-b-white bg-white'
                  : 'text-neutral-40 hover:text-neutral-0'
              }`}
              id={tabId(tab.id)}
              key={tab.id}
              onClick={() => setActive(tab.id)}
              role="tab"
              type="button"
            >
              <span aria-hidden="true">{tab.icon}</span>
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        aria-labelledby={tabId(active)}
        className="p-4 md:p-6"
        id={panelId(active)}
        role="tabpanel"
      >
        <Panel />
      </div>
    </div>
  );
}
