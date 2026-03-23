'use client';

import {
  useGetUserMagnetDetailQuery,
  usePatchMagnetViewDateMutation,
} from '@/api/magnet/magnet';
import LexicalContent from '@/domain/blog/ui/LexicalContent';
import useAuthStore from '@/store/useAuthStore';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const parseLexicalRoot = (json: string) => {
  try {
    return JSON.parse(json).root ?? null;
  } catch {
    return null;
  }
};

interface Props {
  magnetId: number;
  isUpcoming?: boolean;
}

export default function LibraryMainContent({ magnetId, isUpcoming }: Props) {
  const { data, isLoading } = useGetUserMagnetDetailQuery(magnetId);
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();
  const patchViewDate = usePatchMagnetViewDateMutation();
  const hasSentViewDate = useRef(false);

  const mainContents = data?.magnetInfo.mainContents ?? null;
  const mainRoot = mainContents ? parseLexicalRoot(mainContents) : null;
  const hasApplied = mainContents !== null && mainRoot !== null;
  const viewDate = data?.viewDate;

  useEffect(() => {
    if (hasApplied && !viewDate && !hasSentViewDate.current) {
      hasSentViewDate.current = true;
      patchViewDate.mutate(magnetId);
    }
  }, [hasApplied, viewDate, magnetId]);

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
      <div className="mt-8 flex flex-col items-center rounded-md bg-primary-10 px-5 py-10">
        <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-xs border border-primary-15 bg-white">
          <img
            src="/icons/magnet-folder.svg"
            className="size-5"
            alt="megaphone"
          />
        </div>
        <div className="mb-6 text-center text-small18 font-light text-neutral-20">
          해당 콘텐츠가 발행되면{' '}
          <span className="font-semibold text-primary">제일 먼저</span>{' '}
          알려드려요!
        </div>
        <button
          type="button"
          onClick={() =>
            handleApplyClick(`/library/${magnetId}/apply?type=launch-alert`)
          }
          className="w-full max-w-lg rounded-xs bg-primary px-6 py-4 text-center text-xsmall16 text-white"
        >
          알림 신청하기
        </button>
      </div>
    );
  }

  if (hasApplied) {
    return (
      <div className="mt-8 w-full break-all text-xsmall16">
        <LexicalContent node={mainRoot} />
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-col items-center rounded-md bg-primary-10 px-5 py-10">
      <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-xs border border-primary-15 bg-white">
        <img
          src="/icons/magnet-folder.svg"
          className="size-5"
          alt="folder"
        />
      </div>
      <div className="mb-6 text-center text-small18 font-light text-neutral-20">
        렛츠커리어만의 <span className="text-primary">취준 꿀팁</span>이
        <br className="block md:hidden" />
        담긴 콘텐츠,
        <br />
        다음 내용이 궁금하다면?
      </div>
      <button
        type="button"
        onClick={() => handleApplyClick(`/library/${magnetId}/apply`)}
        className="w-full max-w-lg rounded-xs bg-primary px-6 py-4 text-center text-xsmall16 text-white"
      >
        자료집 신청하기
      </button>
    </div>
  );
}
