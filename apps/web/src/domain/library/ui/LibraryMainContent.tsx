'use client';

import {
  useGetUserMagnetDetailQuery,
  useGetUserMagnetListQuery,
  usePatchMagnetViewDateMutation,
} from '@/api/magnet/magnet';
import LexicalContent from '@/common/lexical/LexicalContent';
import GradientButton from '@/domain/program/program-detail/button/GradientButton';
import useAuthStore from '@/store/useAuthStore';
import { SerializedLexicalNode } from 'lexical';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

const parseLexicalRoot = (json: string) => {
  try {
    return JSON.parse(json).root ?? null;
  } catch {
    return null;
  }
};

const FADE_LINE_COUNT = 7;

interface Props {
  magnetId: number;
  isUpcoming?: boolean;
  previewRoot?: SerializedLexicalNode | null;
}

export default function LibraryMainContent({
  magnetId,
  isUpcoming,
  previewRoot,
}: Props) {
  const { data, isLoading } = useGetUserMagnetDetailQuery(magnetId);
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();
  const patchViewDate = usePatchMagnetViewDateMutation();
  const hasSentViewDate = useRef(false);

  const { data: magnetListData } = useGetUserMagnetListQuery({
    pageable: { page: 1, size: 100 },
    enabled: isUpcoming && isLoggedIn,
  });

  const mainContents = data?.magnetInfo.mainContents ?? null;
  const mainRoot = mainContents ? parseLexicalRoot(mainContents) : null;
  const hasApplied = mainContents !== null && mainRoot !== null;
  const viewDate = data?.viewDate;
  const appliedLaunchAlert =
    magnetListData?.magnetList.find((m) => m.magnetId === magnetId)
      ?.appliedLaunchAlert ?? false;

  useEffect(() => {
    if (hasApplied && !viewDate && !hasSentViewDate.current) {
      hasSentViewDate.current = true;
      patchViewDate.mutate(magnetId);
    }
  }, [hasApplied, viewDate, magnetId, patchViewDate]);

  const handleApplyClick = (path: string) => {
    if (!isLoggedIn) {
      window.scrollTo(0, 0);
      router.push(`/login?redirect=${encodeURIComponent(path)}`);
      return;
    }
    router.push(path);
  };

  if (isLoading) return null;

  if (isUpcoming) {
    return (
      <>
        {previewRoot && (
          <PreviewWithFade>
            <LexicalContent node={previewRoot} />
          </PreviewWithFade>
        )}
        <div className="bg-primary-10 mt-8 flex flex-col items-center rounded-md px-5 py-10">
          <div className="border-primary-15 mb-5 flex h-10 w-10 items-center justify-center rounded-sm border bg-white">
            <img src="/icons/magnet-alarm.svg" className="size-6" alt="alarm" />
          </div>
          <div className="text-small18 text-neutral-20 mb-6 text-center font-light">
            해당 콘텐츠가 발행되면{' '}
            <span className="text-primary font-semibold">제일 먼저</span>{' '}
            <br className="md:hidden" />
            알려드려요!
          </div>
          <button
            type="button"
            disabled={appliedLaunchAlert}
            onClick={() =>
              handleApplyClick(`/library/${magnetId}/apply?type=launch-alert`)
            }
            className={`rounded-xs text-xsmall16 w-full max-w-lg px-6 py-4 text-center text-white ${
              appliedLaunchAlert
                ? 'bg-neutral-70 cursor-not-allowed'
                : 'bg-primary'
            }`}
          >
            {appliedLaunchAlert ? '알림 설정 완료' : '알림 신청하기'}
          </button>
        </div>
      </>
    );
  }

  if (hasApplied) {
    return (
      <>
        {previewRoot && (
          <div className="text-xsmall16 w-full break-all">
            <LexicalContent node={previewRoot} />
          </div>
        )}
        <div className="text-xsmall16 mt-8 w-full break-all">
          <LexicalContent node={mainRoot} />
        </div>
      </>
    );
  }

  return (
    <>
      {previewRoot && (
        <PreviewWithFade>
          <LexicalContent node={previewRoot} />
        </PreviewWithFade>
      )}
      <StickyApplyBox magnetId={magnetId} onApplyClick={handleApplyClick} />
    </>
  );
}

function StickyApplyBox({
  magnetId,
  onApplyClick,
}: {
  magnetId: number;
  onApplyClick: (path: string) => void;
}) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  // false로 시작해 자연 높이를 먼저 측정한 뒤 fixed로 전환
  const [isFixed, setIsFixed] = useState(false);
  const [boxHeight, setBoxHeight] = useState(0);

  useEffect(() => {
    if (boxRef.current) {
      setBoxHeight(boxRef.current.offsetHeight);
    }
    // sentinel이 뷰포트 아래에 있으면 바로 fixed로 전환
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

      {/* 래퍼: isFixed=false일 때 레이아웃에 존재해 높이 측정 기준이 됨 */}
      <div ref={boxRef}>
        {/* 데스크탑 */}
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

function PreviewWithFade({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fadeHeight, setFadeHeight] = useState(0);

  const measure = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
    if (!Number.isNaN(lineHeight) && lineHeight > 0) {
      setFadeHeight(lineHeight * FADE_LINE_COUNT);
    }
  }, []);

  useEffect(() => {
    measure();
  }, [measure]);

  return (
    <div ref={containerRef} className="text-xsmall16 relative w-full break-all">
      {children}
      {fadeHeight > 0 && (
        <div
          className="pointer-events-none absolute bottom-0 left-0 w-full"
          style={{
            height: fadeHeight,
            background:
              'linear-gradient(to top, white 0%, white 15%, rgba(255,255,255,0.9) 40%, rgba(255,255,255,0.5) 70%, transparent 100%)',
          }}
        />
      )}
    </div>
  );
}
