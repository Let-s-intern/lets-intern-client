import Image from 'next/image';
import type { CSSProperties } from 'react';
import {
  LINEUP_DAYS,
  LINEUP_TOPICS,
  type LineupBlockTone,
  type LineupDay,
  type LineupSession,
} from '../data/lineup';
import { revealDelay } from '../lib/reveal';

const DARK_BG = 'bg-[#12143a] md:bg-[#11142b]';

const BLOCK_TONE: Record<LineupBlockTone, string> = {
  primary: 'bg-[#4d55f5]',
  deep: 'bg-[#2e35d6] md:bg-[#000570]',
  dark: DARK_BG,
};

function SessionChip({ offline }: { offline?: boolean }) {
  return (
    <span
      className={`flex h-6 items-center rounded-full border px-3 text-[11px] font-semibold ${
        offline
          ? 'border-[#ffe066] bg-[#ffe066] text-[#11142b]'
          : 'border-white text-white'
      }`}
    >
      {offline ? '오프라인 현장' : '온라인 생중계'}
    </span>
  );
}

function SessionCard({ session }: { session: LineupSession }) {
  const { photo, profile, instagramUrl, title } = session;

  return (
    <article
      data-reveal
      data-lift
      className="overflow-hidden rounded-xl border border-[#e1e3f7] md:border-0"
    >
      <header
        className={`flex items-center justify-between gap-3 px-[18px] py-3 text-white md:px-6 md:py-[15px] ${DARK_BG}`}
      >
        <div className="min-w-0">
          <h4 className="text-lg font-bold leading-7 md:text-[22px] md:leading-8">
            {session.label}
          </h4>
          <p className="text-xs leading-[18px] text-white/80 md:text-sm md:leading-6">
            {session.track}
          </p>
        </div>
        <div className="flex shrink-0 gap-1.5 md:gap-2">
          {session.offline && <SessionChip offline />}
          <SessionChip />
        </div>
      </header>

      <div className="relative flex min-h-[180px] flex-col bg-[#edeefe] px-[18px] pb-5 pt-[18px] md:min-h-[200px] md:p-6">
        <p className="flex h-[29px] items-center rounded-sm bg-[#ffe066] px-3 text-[15px] font-bold text-[#11142b] md:h-7 md:w-fit md:text-sm">
          {session.time}
        </p>
        {title && (
          <h5 className="mt-5 whitespace-pre-line text-base font-bold leading-6 text-[#1f222b] md:mt-4 md:text-lg md:leading-[26px]">
            {title}
          </h5>
        )}

        <div className="relative z-10 mt-auto flex flex-col gap-1 pr-[80px] pt-5 md:flex-row md:items-center md:gap-3 md:pr-[150px]">
          <p className="text-sm font-bold leading-5 text-[#1f222b]">
            {session.speaker}
          </p>
          {profile && (
            <>
              <span
                aria-hidden="true"
                className="hidden h-3 w-px bg-[#a9abc0] md:block"
              />
              <p className="whitespace-pre-line text-xs leading-4 text-[#666a7e] md:whitespace-normal">
                {profile}
              </p>
            </>
          )}
          {instagramUrl && (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-bold leading-4 text-[#4d55f5] md:ml-1"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="size-3.5"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle
                  cx="17"
                  cy="7"
                  r="1"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
              인스타그램
            </a>
          )}
        </div>

        <Image
          src={photo.src}
          alt={session.speaker}
          width={photo.width}
          height={photo.height}
          sizes="(min-width: 768px) 150px, 77px"
          className="absolute bottom-0 right-3 h-[92px] w-auto md:right-9 md:h-[180px]"
        />
      </div>
    </article>
  );
}

function LineupDaySection({ day }: { day: LineupDay }) {
  const totalMinutes = day.blocks.reduce(
    (total, block) => total + block.minutes,
    0,
  );
  const blockColumns = {
    '--block-columns': day.blocks
      .map((block) => `${block.minutes}fr`)
      .join(' '),
  } as CSSProperties;

  return (
    <section className="mt-10 first-of-type:mt-[37px] md:mt-12 md:first-of-type:mt-[37px]">
      <div
        data-reveal
        className="flex items-baseline gap-3 border-b-2 border-[#1f222b] pb-[19px]"
      >
        <h3 className="text-[22px] font-bold leading-7 text-[#1f222b] md:text-xl">
          {day.label}
        </h3>
        <p className="text-sm font-semibold text-[#55586a] md:text-xs">
          {day.schedule}
        </p>
      </div>

      <p className="mt-[18px] text-xs font-semibold leading-4 text-[#7b7e90] md:mt-[22px]">
        세션 구성 · {totalMinutes}분
      </p>
      <ul
        data-reveal
        style={blockColumns}
        className="mt-2 grid gap-1 md:grid-cols-[var(--block-columns)] md:gap-0"
      >
        {day.blocks.map((block) => (
          <li
            key={block.title}
            className={`md:rounded-xs rounded-md px-3 py-3 text-white md:py-3.5 md:first:rounded-l-md md:last:rounded-r-md ${BLOCK_TONE[block.tone]}`}
          >
            <p className="text-sm font-bold leading-6">
              {block.title} {block.minutes}분
            </p>
            <p className="text-xs leading-5 text-white/85">
              {block.description}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-[18px] flex flex-col gap-4 md:mt-5">
        {day.sessions.map((session) => (
          <SessionCard key={session.label} session={session} />
        ))}
      </div>
    </section>
  );
}

export function Lineup() {
  return (
    <section className="break-keep bg-white px-5 py-16 md:py-[88px]">
      <div className="mx-auto max-w-[840px]">
        <h2
          data-reveal
          className="text-2xl font-bold leading-8 tracking-[-0.02em] text-[#1f222b] md:text-4xl md:leading-[48px]"
        >
          렛츠콘 세미나 라인업
        </h2>

        <ol
          data-reveal-group
          className="mt-[38px] flex flex-col gap-4 md:mt-10 md:gap-3"
        >
          {LINEUP_TOPICS.map(({ title, description }, index) => (
            <li
              key={title}
              data-reveal
              style={revealDelay(index)}
              className="flex gap-4 md:gap-5"
            >
              <span className="w-3 shrink-0 text-center text-sm font-bold leading-6 text-[#4d55f5] md:w-4">
                {index + 1}
              </span>
              <div>
                <p className="text-sm font-bold leading-6 text-[#1f222b]">
                  {title}
                </p>
                <p className="mt-0.5 text-sm leading-[22px] text-[#666a7e] md:leading-6">
                  {description}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {LINEUP_DAYS.map((day) => (
          <LineupDaySection key={day.label} day={day} />
        ))}
      </div>
    </section>
  );
}
