import Image from '@/common/ui/Image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { type InstagramChannel } from '../data/instagram';

const THUMBNAIL_COUNT = 6;
const DESKTOP_THUMBNAIL_SIZE = 200;
const MOBILE_THUMBNAIL_SIZE = 136;
const PROFILE_IMAGE_SIZE = 40;

type Props = {
  channel: InstagramChannel;
};

export default function InstagramCard({ channel }: Props) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [showRightFade, setShowRightFade] = useState(false);
  const ticking = useRef(false);
  const rafId = useRef<number | null>(null);

  const thumbnails = channel.thumbnails.slice(0, THUMBNAIL_COUNT);

  const updateFade = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
    setShowRightFade((prev) => {
      const next = !atEnd;
      return prev !== next ? next : prev;
    });
  }, []);

  const scheduleUpdate = useCallback(() => {
    if (ticking.current) return;
    ticking.current = true;
    rafId.current = window.requestAnimationFrame(() => {
      updateFade();
      ticking.current = false;
    });
  }, [updateFade]);

  useEffect(() => {
    updateFade();
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener('scroll', scheduleUpdate, { passive: true });
    const resizeObserver = new ResizeObserver(() => {
      scheduleUpdate();
    });
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener('scroll', scheduleUpdate);
      resizeObserver.disconnect();
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [updateFade, scheduleUpdate]);

  return (
    <article className="flex flex-col overflow-hidden rounded-sm border border-neutral-80 bg-white shadow-sm">
      {/* Thumbnail area */}
      <div className="relative border-b border-neutral-80">
        {/* Desktop: 3x2 grid */}
        <div className="hidden md:grid md:grid-cols-3 md:gap-px md:bg-neutral-80">
          {thumbnails.map((thumb, i) => (
            <div key={i} className="aspect-square bg-neutral-90">
              <Image
                src={thumb.src}
                alt={thumb.alt}
                width={DESKTOP_THUMBNAIL_SIZE}
                height={DESKTOP_THUMBNAIL_SIZE}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="relative md:hidden">
          <div
            ref={scrollRef}
            className="flex gap-1.5 overflow-x-auto px-3 py-3 scrollbar-hide"
          >
            {thumbnails.map((thumb, i) => (
              <div
                key={i}
                className="aspect-square min-w-[68px] flex-shrink-0 overflow-hidden rounded-xxs bg-neutral-90"
              >
                <Image
                  src={thumb.src}
                  alt={thumb.alt}
                  width={MOBILE_THUMBNAIL_SIZE}
                  height={MOBILE_THUMBNAIL_SIZE}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
          {/* Right fade mask */}
          <div
            className={`pointer-events-none absolute bottom-0 right-0 top-0 w-10 bg-gradient-to-l from-white to-transparent transition-opacity duration-200 ${showRightFade ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>
      </div>

      {/* Profile + Follow */}
      <div className="flex flex-col gap-3 p-4 md:gap-3.5 md:p-5">
        <div className="flex items-center gap-2.5">
          {channel.profileImage ? (
            <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-full md:h-10 md:w-10">
              <Image
                src={channel.profileImage}
                alt={channel.handle}
                width={PROFILE_IMAGE_SIZE}
                height={PROFILE_IMAGE_SIZE}
                className="h-full w-full scale-110 object-cover"
              />
            </div>
          ) : (
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary-5 text-[10px] font-bold text-primary-90 md:h-10 md:w-10">
              IG
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-xsmall14 font-bold text-static-0 md:text-xsmall16">
              {channel.handle}
            </p>
            <p className="text-xxsmall12 text-neutral-40">{channel.label}</p>
          </div>
          <a
            href={channel.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 rounded-xs bg-primary-90 px-4 py-1.5 text-xxsmall12 font-bold text-white transition-colors hover:bg-primary-80 md:text-xsmall14"
          >
            팔로우
          </a>
        </div>

        {/* Description */}
        <p className="break-keep border-t border-neutral-80 pt-3 text-xsmall14 leading-[1.7] text-neutral-40">
          {channel.description}
        </p>
      </div>
    </article>
  );
}
