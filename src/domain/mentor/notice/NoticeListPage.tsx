'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useMentorGuideListQuery } from '@/api/challenge-mentor-guide/challengeMentorGuide';
import { useMentorChallengeListQuery } from '@/api/user/user';
import type { ChallengeMentorGuideItem } from '@/api/challenge-mentor-guide/challengeMentorGuideSchema';

function getRelativeDate(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return '오늘';
  if (diffDays === 1) return '1일 전';
  return `${diffDays}일 전`;
}

function NoticeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-6 md:gap-10">
      <h1 className="text-medium22 font-semibold text-neutral-0">공지사항</h1>
      {children}
    </div>
  );
}

function GuideRow({
  guide,
  isFixed,
  challengeName,
}: {
  guide: ChallengeMentorGuideItem;
  isFixed: boolean;
  challengeName?: string;
}) {
  const hasContents = !!guide.contents;
  const hasLink = !!guide.link;

  const badges = (
    <div className="flex items-center gap-2">
      {isFixed && (
        <span className="shrink-0 text-sm" title="고정 공지">📌</span>
      )}
      {guide.createDate && (
        <span className="w-fit shrink-0 rounded border border-neutral-80 px-2.5 py-0.5 text-xxsmall12 text-neutral-40 md:px-3 md:py-1">
          {getRelativeDate(guide.createDate)}
        </span>
      )}
      {challengeName && (
        <span className="shrink-0 rounded bg-primary-5 px-1.5 py-0.5 text-[10px] font-medium text-primary">
          {challengeName}
        </span>
      )}
    </div>
  );

  const title = (
    <span className="break-words text-xsmall14 text-neutral-10 md:text-xsmall16">
      {guide.title}
    </span>
  );

  const rowClass = `flex flex-col gap-2 border-b border-neutral-80 px-4 py-3 transition-colors last:border-b-0 hover:bg-neutral-95 md:flex-row md:items-center md:gap-4 md:px-6 md:py-4 ${isFixed ? 'bg-amber-50/50' : ''}`;

  if (hasContents) {
    return (
      <Link
        href={`/mentor/notice/${guide.challengeMentorGuideId}`}
        className={rowClass}
      >
        {badges}
        {title}
      </Link>
    );
  }

  return (
    <a
      href={hasLink ? guide.link! : '#'}
      target={hasLink ? '_blank' : undefined}
      rel={hasLink ? 'noopener noreferrer' : undefined}
      className={rowClass}
    >
      {badges}
      {title}
    </a>
  );
}

export default function NoticeListPage() {
  const { data, isLoading } = useMentorGuideListQuery();
  const guides = data?.challengeMentorGuideList ?? [];
  const { data: challengeData } = useMentorChallengeListQuery();

  // challengeId → 챌린지 이름 매핑
  const challengeNameMap = useMemo(() => {
    const map = new Map<number, string>();
    for (const c of challengeData?.myChallengeMentorVoList ?? []) {
      map.set(c.challengeId, c.title);
    }
    return map;
  }, [challengeData]);

  if (isLoading) {
    return (
      <NoticeLayout>
        <div className="py-20 text-center text-xsmall14 text-neutral-40">
          불러오는 중...
        </div>
      </NoticeLayout>
    );
  }

  // 노출 가능한 공지만 필터 + 고정 공지 상단 정렬
  const visibleGuides = useMemo(() => {
    const now = new Date();
    return guides
      .filter((g) => {
        if (g.isVisible === false) return false;
        if (g.dateType === 'CUSTOM') {
          if (g.startDate && new Date(g.startDate) > now) return false;
          if (g.endDate && new Date(g.endDate) < now) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (a.isFixed && !b.isFixed) return -1;
        if (!a.isFixed && b.isFixed) return 1;
        return 0;
      });
  }, [guides]);

  if (visibleGuides.length === 0) {
    return (
      <NoticeLayout>
        <div className="py-20 text-center text-xsmall14 text-neutral-40">
          등록된 공지가 없습니다.
        </div>
      </NoticeLayout>
    );
  }

  return (
    <NoticeLayout>
      <section className="flex flex-col gap-4">
        <h2 className="text-small18 font-semibold text-neutral-0">
          프로그램 공지
        </h2>
        <div className="flex flex-col rounded-[16px] border border-neutral-80">
          {visibleGuides.map((guide) => (
            <GuideRow
              key={guide.challengeMentorGuideId}
              guide={guide}
              isFixed={guide.isFixed ?? false}
              challengeName={
                guide.challengeId
                  ? challengeNameMap.get(guide.challengeId)
                  : undefined
              }
            />
          ))}
        </div>
      </section>
    </NoticeLayout>
  );
}
