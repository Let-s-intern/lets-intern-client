'use client';

import { useEffect, useRef, useState } from 'react';
import { type InstagramChannel } from './const';

const THUMBNAIL_COUNT = 6;

type Props = {
  channel: InstagramChannel;
};

export default function InstagramCard({ channel }: Props) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [showRightFade, setShowRightFade] = useState(false);
  const ticking = useRef(false);
  const rafId = useRef<number | null>(null);

  const updateFade = () => {
    const el = scrollRef.current;
    if (!el) return;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
    setShowRightFade((prev) => {
      const next = !atEnd;
      return prev !== next ? next : prev;
    });
  };

  const scheduleUpdate = () => {
    if (ticking.current) return;
    ticking.current = true;
    rafId.current = window.requestAnimationFrame(() => {
      updateFade();
      ticking.current = false;
    });
  };

  useEffect(() => {
    updateFade();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    return () => {
      el.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <article className="flex flex-col overflow-hidden rounded-sm border border-neutral-80 bg-white">
      {/* Thumbnail area */}
      <div className="relative border-b border-neutral-80">
        {/* Desktop: 3x2 grid */}
        <div className="hidden md:grid md:grid-cols-3 md:gap-px md:bg-neutral-80">
          {Array.from({ length: THUMBNAIL_COUNT }).map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-neutral-90"
              aria-hidden="true"
            />
          ))}
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="relative md:hidden">
          <div
            ref={scrollRef}
            className="flex gap-1 overflow-x-auto px-3 py-2.5 scrollbar-hide"
          >
            {Array.from({ length: THUMBNAIL_COUNT }).map((_, i) => (
              <div
                key={i}
                className="aspect-square min-w-[68px] flex-shrink-0 rounded-xxs bg-neutral-90"
                aria-hidden="true"
              />
            ))}
          </div>
          {/* Right fade mask */}
          <div
            className={`pointer-events-none absolute bottom-0 right-0 top-0 w-10 bg-gradient-to-l from-white to-transparent transition-opacity duration-200 ${showRightFade ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>
      </div>

      {/* Profile + Follow */}
      <div className="flex flex-col gap-2.5 p-3 md:gap-3 md:p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-neutral-85 text-[10px] font-bold text-neutral-30 md:h-8 md:w-8">
            IG
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xsmall14 font-bold text-neutral-10">
              {channel.handle}
            </p>
            <p className="text-xxsmall12 text-neutral-45">{channel.label}</p>
          </div>
          <a
            href={channel.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 rounded-xxs border border-neutral-30 bg-white px-3 py-1.5 text-xxsmall12 font-bold text-neutral-10 transition-colors hover:bg-neutral-95"
          >
            팔로우
          </a>
        </div>

        {/* Description */}
        <p className="break-keep border-t border-dashed border-neutral-80 pt-2.5 text-xxsmall12 leading-[1.65] text-neutral-40 md:text-xsmall14">
          {channel.description}
        </p>
      </div>
    </article>
  );
}
