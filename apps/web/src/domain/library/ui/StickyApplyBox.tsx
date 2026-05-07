'use client';

import GradientButton from '@/domain/program/program-detail/button/GradientButton';
import { useEffect, useRef, useState } from 'react';

interface Props {
  magnetId: number;
  onApplyClick: (path: string) => void;
}

export default function StickyApplyBox({ magnetId, onApplyClick }: Props) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [isFixed, setIsFixed] = useState(false);
  const [boxHeight, setBoxHeight] = useState(0);

  useEffect(() => {
    if (boxRef.current) {
      setBoxHeight(boxRef.current.offsetHeight);
    }
    if (
      sentinelRef.current &&
      sentinelRef.current.getBoundingClientRect().top > 0
    ) {
      setIsFixed(true);
    }
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsFixed(false);
        } else {
          setIsFixed(entry.boundingClientRect.top > 0);
        }
      },
      { threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} className="mt-8" />
      {isFixed && <div style={{ height: boxHeight }} />}

      <div ref={boxRef}>
        {/* 데스크탑: 해당 위치 도달 시 snap */}
        <div
          className={`bg-primary-10/80 hidden items-center justify-between rounded-md px-5 py-4 backdrop-blur-sm md:flex ${
            isFixed
              ? 'fixed bottom-4 left-0 right-0 z-50 mx-auto max-w-[1100px] px-5'
              : ''
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="border-primary-15 flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border bg-white">
              <img
                src="/icons/magnet-folder.svg"
                className="size-6"
                alt="folder"
              />
            </div>
            <div>
              <p className="text-primary text-xsmall16 font-bold">
                여기부터가 놓치면 안 될 핵심 내용이에요!
              </p>
              <p className="text-xsmall14 text-neutral-35 font-medium">
                다음 내용이 궁금하다면?
              </p>
            </div>
          </div>
          <GradientButton
            onClick={() => onApplyClick(`/library/${magnetId}/apply`)}
            className="text-xsmall16 shrink-0 px-6 py-3 font-semibold text-white"
          >
            자료집 신청하기
          </GradientButton>
        </div>

        {/* 모바일: 항상 하단 고정 */}
        <div className="safe-area-bottom fixed bottom-0 left-0 right-0 z-50 flex flex-col overflow-hidden md:hidden">
          <div className="bg-primary-dark text-xxsmall12 py-1.5 text-center font-semibold text-white">
            여기서부터가 핵심내용이에요!
          </div>
          <div className="bg-primary-10/60 px-5 pb-5 pt-3 backdrop-blur-sm">
            <GradientButton
              onClick={() => onApplyClick(`/library/${magnetId}/apply`)}
              className="w-full py-4"
            >
              자료집 신청하기
            </GradientButton>
          </div>
        </div>
      </div>
    </>
  );
}
