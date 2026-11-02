'use client';

import { ArrowUpRight } from 'lucide-react';
import { useState } from 'react';

const TITLE = '서류 Live 피드백은 이렇게 진행됩니다';

export function FeedbackVideo({ videoId }: { videoId: string }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="mt-6 md:mt-7">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-[#1c1e2b]">{TITLE}</p>
        <a
          href={`https://youtu.be/${videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary flex shrink-0 items-center gap-0.5 text-xs font-semibold"
        >
          YouTube에서 보기
          <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />
        </a>
      </div>
      <div className="relative mt-3 aspect-video overflow-hidden rounded-[14px] bg-[#11142b] shadow-[0_10px_28px_rgba(17,20,43,0.18)]">
        {isPlaying ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title={TITLE}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <button
            type="button"
            aria-label={`${TITLE} 영상 재생`}
            onClick={() => setIsPlaying(true)}
            className="group h-full w-full"
          >
            <img
              src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <span className="absolute left-1/2 top-1/2 flex h-[38px] w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[10px] bg-[#ff0033] transition-transform group-hover:scale-105 md:h-11 md:w-16">
              <span className="ml-1 h-0 w-0 border-y-[9px] border-l-[15px] border-y-transparent border-l-white" />
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
