import {
  useGetUserMagnetDetailQuery,
  useGetUserMagnetListQuery,
  usePatchMagnetViewDateMutation,
} from '@/api/magnet/magnet';
import LexicalContent from '@/common/lexical/LexicalContent';
import useAuthStore from '@/store/useAuthStore';
import { SerializedLexicalNode } from 'lexical';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
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
      navigate(`/login?redirect=${encodeURIComponent(path)}`);
      return;
    }
    navigate(path);
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
      <div className="bg-primary-10 mt-8 flex flex-col items-center rounded-md px-5 py-10">
        <div className="border-primary-15 mb-5 flex h-10 w-10 items-center justify-center rounded-sm border bg-white">
          <img src="/icons/magnet-folder.svg" className="size-6" alt="folder" />
        </div>
        <div className="text-small18 text-neutral-20 mb-6 text-center font-light">
          렛츠커리어만의{' '}
          <span className="text-primary font-semibold">취준 꿀팁</span>이{' '}
          <br className="block md:hidden" />
          담긴 콘텐츠,
          <br />
          다음 내용이 궁금하다면?
        </div>
        <button
          type="button"
          onClick={() => handleApplyClick(`/library/${magnetId}/apply`)}
          className="rounded-xs bg-primary text-xsmall16 w-full max-w-lg px-6 py-4 text-center text-white"
        >
          자료집 신청하기
        </button>
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
