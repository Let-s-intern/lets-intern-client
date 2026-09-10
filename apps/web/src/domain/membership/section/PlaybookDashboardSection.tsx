import { PLAYBOOK_DASHBOARD as D } from '../data/playbookDashboard';

/**
 * 시안 9 — 플레이북 대시보드 (PASS BENEFIT 01).
 *
 * **동작하는 도구가 아니라 목업이다.** 탭·입력창·버튼처럼 보이는 것에 동작을 붙이지
 * 않는다 — 눌러도 아무 일이 없는 컨트롤은 사용자를 속인다. 그래서 `button`·`input` 대신
 * `div`·`span` 으로 그리고, 전체를 `aria-hidden` 으로 감춰 스크린리더가 조작 가능한
 * 위젯으로 읽지 않게 한다. 내용은 바깥 제목·설명 3칸이 대신 전달한다.
 */
export default function PlaybookDashboardSection() {
  return (
    <section className="bg-[#232433] py-16 md:py-24" id="playbook-dashboard">
      <div className="wrap">
        <div className="flex items-center justify-center gap-3">
          <span className="rounded-full bg-[#F1642B] px-3 py-1 text-xs font-bold text-white">
            {D.badge}
          </span>
          <span className="text-sm font-bold tracking-wide text-[#F1642B]">
            {D.eyebrow}
          </span>
        </div>

        <h2 className="mt-4 text-center text-2xl font-bold leading-snug text-white md:text-[2rem]">
          {D.titleLines.map((line) => (
            <span className="block" key={line}>
              {line}
            </span>
          ))}
        </h2>

        <p className="text-xsmall14 md:text-xsmall16 text-neutral-70 mt-4 text-center">
          {D.sub}
        </p>

        {/* ── 목업 ── 조작 불가. 위 주석 참고 */}
        <div
          aria-hidden="true"
          className="bg-neutral-95 rounded-xxl mt-10 select-none p-4 md:mt-14 md:p-6"
        >
          <div className="grid gap-4 md:grid-cols-[minmax(0,240px)_minmax(0,1fr)]">
            {/* 좌측 사이드 */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="bg-primary h-10 w-10 shrink-0 rounded-lg" />
                <span>
                  <strong className="text-xsmall14 text-neutral-0 block font-bold">
                    {D.brand.name}
                  </strong>
                  <span className="text-neutral-40 block text-xs">
                    {D.brand.product}
                  </span>
                </span>
              </div>

              <div className="border-neutral-90 rounded-lg border bg-white p-4">
                <strong className="text-xsmall14 text-neutral-0 block font-bold">
                  {D.startPanel.title}
                </strong>
                <span className="text-neutral-40 mt-1 block text-xs">
                  {D.startPanel.desc}
                </span>
                {D.startPanel.fields.map((field) => (
                  <span
                    className="border-neutral-90 mt-3 block rounded-lg border px-3 py-2 text-xs text-neutral-50"
                    key={field}
                  >
                    {field}
                  </span>
                ))}
                <span className="bg-primary text-xsmall14 mt-4 block rounded-lg py-2.5 text-center font-medium text-white">
                  {D.startPanel.cta}
                </span>
              </div>

              <div className="border-primary rounded-lg border-l-4 bg-white p-4">
                <span className="flex items-center gap-2">
                  <span className="bg-neutral-0 rounded px-2 py-0.5 text-[0.65rem] text-white">
                    {D.noticeCard.tag}
                  </span>
                  <span className="text-neutral-40 text-xs">
                    {D.noticeCard.date}
                  </span>
                </span>
                <strong className="text-xsmall14 text-neutral-0 mt-3 block font-bold">
                  {D.noticeCard.title}
                </strong>
                <span className="text-neutral-40 mt-1 block text-xs">
                  {D.noticeCard.desc}
                </span>
                {D.noticeCard.checks.map((check) => (
                  <span
                    className="text-neutral-30 mt-2 block text-xs"
                    key={check}
                  >
                    ✅ {check}
                  </span>
                ))}
              </div>
            </div>

            {/* 우측 본문 */}
            <div className="flex flex-col gap-4">
              <div className="flex gap-1 rounded-lg bg-white p-1.5">
                {D.tabs.map((tab) => (
                  <span
                    className={`text-xsmall14 flex-1 rounded-lg py-2.5 text-center font-medium ${
                      tab === D.activeTab
                        ? 'bg-neutral-0 text-white'
                        : 'text-neutral-40'
                    }`}
                    key={tab}
                  >
                    {tab}
                  </span>
                ))}
              </div>

              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,260px)]">
                {/* 리더보드 */}
                <div>
                  <strong className="text-small18 text-neutral-0 block font-bold">
                    {D.leaderboard.title}
                  </strong>
                  <span className="text-neutral-40 mt-1 block text-xs">
                    {D.leaderboard.desc}
                  </span>

                  <div className="mt-4 flex flex-col gap-3">
                    {D.leaderboard.entries.map((entry) => (
                      <div
                        className="flex items-center gap-4 rounded-lg bg-white p-4"
                        key={entry.rank}
                      >
                        <span className="text-neutral-30 w-4 shrink-0 text-sm font-bold">
                          {entry.rank}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-baseline justify-between gap-3">
                            <strong className="text-xsmall14 text-neutral-0 font-bold">
                              {entry.nickname}
                            </strong>
                            <span className="text-neutral-30 text-xs font-medium">
                              {entry.done}/{entry.total} ·{' '}
                              {Math.round((entry.done / entry.total) * 100)}%
                            </span>
                          </span>
                          {entry.goal ? (
                            <span className="text-neutral-40 mt-0.5 block text-xs">
                              “{entry.goal}”
                            </span>
                          ) : null}
                          <span className="bg-neutral-90 mt-2 block h-1.5 rounded-full">
                            <span
                              className="bg-primary block h-full rounded-full"
                              style={{
                                width: `${(entry.done / entry.total) * 100}%`,
                              }}
                            />
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 추천 공고 */}
                <div className="rounded-lg bg-white p-4">
                  <strong className="text-xsmall14 text-neutral-0 block font-bold">
                    {D.postings.title}
                  </strong>
                  <div className="mt-3 flex flex-col gap-3">
                    {D.postings.items.map((item) => (
                      <div
                        className="border-neutral-90 rounded-lg border p-3"
                        key={item.company}
                      >
                        <span className="bg-primary-10 text-primary inline-block rounded px-2 py-0.5 text-[0.65rem] font-bold">
                          {item.tag}
                        </span>
                        <strong className="text-xsmall14 text-neutral-0 mt-2 block font-bold">
                          {item.company}
                        </strong>
                        <span className="text-neutral-40 block text-xs">
                          {item.roles}
                        </span>
                      </div>
                    ))}
                  </div>
                  <span className="text-neutral-40 mt-3 block text-right text-xs">
                    {D.postings.footnote}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 설명 3칸 — 목업이 전하지 못하는 내용을 글로 전달한다 */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {D.highlights.map((item) => (
            <div className="rounded-xxl bg-white/5 p-6" key={item.no}>
              <strong className="text-xsmall14 block font-bold text-[#F1642B]">
                {item.no} · {item.title}
              </strong>
              <span className="text-xsmall14 text-neutral-70 mt-3 block">
                {item.desc}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
