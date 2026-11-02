import type { ReactNode } from 'react';
import type { IntroStoryIcon as IconName } from '../data/intro';

// 원본 아이콘을 받지 못해 시안 모양을 단순화해 그렸다. 원본이 오면 이 파일만 교체한다
const ICONS: Record<IconName, ReactNode> = {
  puzzle: (
    <path
      fill="#f97316"
      d="M7 5h3.2a2.3 2.3 0 1 1 4.6 0H18v3.2a2.3 2.3 0 1 1 0 4.6V17h-3.2a2.3 2.3 0 1 0-4.6 0H7v-3.2a2.3 2.3 0 1 0 0-4.6z"
    />
  ),
  sweat: (
    <>
      <circle cx="11" cy="13" r="8" fill="#ffd95a" />
      <path
        fill="#60a5fa"
        d="M19 2.5s2.6 3 2.6 4.7a2.6 2.6 0 1 1-5.2 0c0-1.7 2.6-4.7 2.6-4.7z"
      />
      <path
        stroke="#7a5b12"
        strokeWidth="1.4"
        strokeLinecap="round"
        d="M9 16.5h4"
      />
    </>
  ),
  rocket: (
    <>
      <path
        fill="#fbbf24"
        d="M4 21c0-3 1-5.5 3.5-6.5l2 2C8.5 19 7 20.5 4 21z"
      />
      <path
        fill="#ef4444"
        d="M21 3c-5.5.2-9.5 2.4-12.5 7L6 11l7 7 1-2.5c4.6-3 6.8-7 7-12.5z"
      />
      <circle cx="15" cy="9" r="1.8" fill="#fff" />
    </>
  ),
  gem: (
    <>
      <path fill="#60a5fa" d="M7 4h10l5 6-10 11L2 10z" />
      <path fill="#93c5fd" d="M7 4h10l-2 6H9z" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2.5" fill="#fff" />
      <path
        fill="#ef4444"
        d="M5.5 5h13A2.5 2.5 0 0 1 21 7.5V10H3V7.5A2.5 2.5 0 0 1 5.5 5z"
      />
      <path
        stroke="#ef4444"
        strokeWidth="2"
        strokeLinecap="round"
        d="M8 3v3M16 3v3"
      />
    </>
  ),
};

export function IntroStoryIcon({ name }: { name: IconName }) {
  return (
    <span className="grid size-7 shrink-0 place-items-center rounded-sm bg-[#edeefe] md:size-[30px]">
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-5"
        fill="none"
      >
        {ICONS[name]}
      </svg>
    </span>
  );
}
