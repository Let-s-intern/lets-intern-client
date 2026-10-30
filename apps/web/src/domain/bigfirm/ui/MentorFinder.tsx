'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { mentorDetailUrl } from '../data/links';
import type { MentorImages } from '../data/mentorImages';
import { COMPANY_TABS, MENTORS, type Mentor } from '../data/mentors';

export function MentorFinder({ images }: { images: MentorImages }) {
  const [active, setActive] =
    useState<(typeof COMPANY_TABS)[number]['key']>('all');
  const mentors = MENTORS.filter((m) => active === 'all' || m.group === active);

  return (
    <>
      <h3 className="mb-4 text-[22px] font-extrabold">
        지금 만날 수 있는 대기업 현직 멘토{' '}
        <span className="text-primary">{mentors.length}명</span>
      </h3>

      <div
        role="group"
        aria-label="기업 선택"
        className="mb-6 flex flex-wrap gap-2"
      >
        {COMPANY_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            aria-pressed={tab.key === active}
            onClick={() => setActive(tab.key)}
            className={`inline-flex items-center gap-1.5 rounded-full border-[1.5px] px-4 py-2 text-[15px] font-bold transition-colors ${
              tab.key === active
                ? 'border-primary bg-primary text-white'
                : 'hover:text-primary border-[#e3e5f0] bg-white text-[#575757] hover:border-[#9a9ffa]'
            }`}
          >
            {tab.label}
            <span
              className={`text-[13px] font-semibold ${tab.key === active ? 'text-white/75' : 'text-[#6e6e78]'}`}
            >
              {
                MENTORS.filter((m) => tab.key === 'all' || m.group === tab.key)
                  .length
              }
            </span>
          </button>
        ))}
      </div>

      <div
        aria-live="polite"
        className="grid gap-4 sm:grid-cols-2 min-[1024px]:grid-cols-3"
      >
        {mentors.map((mentor) => (
          <MentorCard
            key={mentor.id}
            mentor={mentor}
            image={images[mentor.id] ?? null}
          />
        ))}
      </div>
    </>
  );
}

function MentorCard({
  mentor,
  image,
}: {
  mentor: Mentor;
  image: string | null;
}) {
  return (
    <article className="hover:border-primary relative grid min-h-[358px] grid-rows-[auto_auto_1fr_auto] gap-3.5 rounded-[20px] border-[1.5px] border-[#e3e5f0] bg-white p-[22px] transition hover:-translate-y-0.5">
      <div className="flex items-center gap-3">
        {image ? (
          <Image
            src={image}
            alt={`${mentor.name} 멘토 프로필`}
            width={48}
            height={48}
            className="size-12 shrink-0 rounded-full border border-[#e3e5f0] object-cover"
          />
        ) : (
          <span
            className="grid size-12 shrink-0 place-items-center rounded-full text-sm font-extrabold text-white"
            style={{ background: mentor.color }}
          >
            {mentor.badge}
          </span>
        )}
        <div>
          <div className="text-base font-extrabold leading-[1.35]">
            {mentor.org}
          </div>
          <div className="text-sm text-[#575757]">
            {mentor.name} 멘토 · {mentor.role}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {mentor.tags.map((tag) => (
          <span
            key={tag}
            className="text-primary rounded-full bg-[#f1f0ff] px-2.5 py-1 text-xs font-bold"
          >
            {tag}
          </span>
        ))}
      </div>
      <p className="text-[15px] font-bold leading-[1.55]">
        &quot;{mentor.quote}&quot;
      </p>
      <Link
        href={mentorDetailUrl(mentor.id)}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary flex w-full items-center rounded-md bg-[#e9eaff] px-4 py-2.5 text-sm font-medium after:absolute after:inset-0 after:rounded-[20px] hover:bg-[#dfe1fe]"
      >
        상세페이지 보러가기 →
      </Link>
    </article>
  );
}
