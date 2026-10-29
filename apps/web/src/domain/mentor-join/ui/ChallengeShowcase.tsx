'use client';

import { useState } from 'react';
import { ProgramScroller } from './ProgramScroller';
import type {
  ChallengeCategory,
  ChallengeHighlight,
} from '../data/programHighlights';
import { LETSCAREER_PROGRAM_URL } from '../data/links';

// 직무별로 멘토링할 만한 챌린지. 직무 전용 챌린지를 앞에, 공통 서류 챌린지를 뒤에 둔다
// '전체'는 categories 없이 받아 온 순서 그대로 모두 보여준다
const JOBS: { label: string; categories?: ChallengeCategory[] }[] = [
  { label: '전체' },
  {
    label: 'HR',
    categories: [
      'hr',
      'experience',
      'resume',
      'cover-letter',
      'large-corp',
      'aptitude',
    ],
  },
  {
    label: '기획',
    categories: ['pm', 'experience', 'resume', 'cover-letter', 'portfolio'],
  },
  {
    label: '마케팅',
    categories: [
      'marketing',
      'experience',
      'resume',
      'cover-letter',
      'portfolio',
    ],
  },
  {
    label: '디자인',
    categories: ['portfolio', 'experience', 'resume', 'cover-letter'],
  },
  {
    label: '개발',
    categories: [
      'experience',
      'resume',
      'cover-letter',
      'portfolio',
      'large-corp',
      'aptitude',
    ],
  },
];

export function ChallengeShowcase({
  challenges,
}: {
  challenges: ChallengeHighlight[];
}) {
  const [active, setActive] = useState(0);
  const { categories } = JOBS[active];
  const visible = categories
    ? categories.flatMap((category) =>
        challenges.filter((c) => c.category === category),
      )
    : challenges;

  return (
    <div className="flex flex-col gap-4">
      {/* 항목 제목과 시작점을 맞춘다 (번호 칸 + 간격) */}
      <div
        role="tablist"
        aria-label="직무"
        className="flex flex-wrap gap-2 pl-12 sm:pl-16"
      >
        {JOBS.map((job, i) => (
          <button
            key={job.label}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={`rounded-full border px-4 py-1.5 text-sm font-semibold leading-normal sm:text-base ${
              i === active
                ? 'border-white bg-white text-[#27272d]'
                : 'border-white/20 text-[#b0b3ba] hover:border-white/40 hover:text-white'
            }`}
          >
            {job.label}
          </button>
        ))}
      </div>

      <div role="tabpanel">
        {/* 직무를 바꾸면 목록을 새로 그려 스크롤을 처음으로 되돌린다 */}
        <ProgramScroller
          key={active}
          items={visible}
          more={{ href: LETSCAREER_PROGRAM_URL, label: '전체 프로그램 보기' }}
        />
      </div>
    </div>
  );
}
