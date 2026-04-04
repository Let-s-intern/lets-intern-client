'use client';

import Link from 'next/link';
import { useMentorGuideListQuery } from '@/api/challenge-mentor-guide/challengeMentorGuide';
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

function GuideRow({ guide }: { guide: ChallengeMentorGuideItem }) {
  const hasContents = !!guide.contents;
  const hasLink = !!guide.link;

  if (hasContents) {
    return (
      <Link
        href={`/mentor/notice/${guide.challengeMentorGuideId}`}
        className="flex flex-col gap-2 border-b border-neutral-80 px-4 py-3 transition-colors last:border-b-0 hover:bg-neutral-95 md:flex-row md:items-center md:gap-4 md:px-6 md:py-4"
      >
        <div className="flex items-center gap-2">
          {guide.createDate && (
            <span className="w-fit shrink-0 rounded border border-neutral-80 px-2.5 py-0.5 text-xxsmall12 text-neutral-40 md:px-3 md:py-1">
              {getRelativeDate(guide.createDate)}
            </span>
          )}
          <span className="shrink-0 rounded bg-violet-100 px-1.5 py-0.5 text-[10px] font-medium text-violet-600">
            텍스트
          </span>
        </div>
        <span className="break-words text-xsmall14 text-neutral-10 md:text-xsmall16">
          {guide.title}
        </span>
      </Link>
    );
  }

  return (
    <a
      href={hasLink ? guide.link! : '#'}
      target={hasLink ? '_blank' : undefined}
      rel={hasLink ? 'noopener noreferrer' : undefined}
      className="flex flex-col gap-2 border-b border-neutral-80 px-4 py-3 transition-colors last:border-b-0 hover:bg-neutral-95 md:flex-row md:items-center md:gap-4 md:px-6 md:py-4"
    >
      <div className="flex items-center gap-2">
        {guide.createDate && (
          <span className="w-fit shrink-0 rounded border border-neutral-80 px-2.5 py-0.5 text-xxsmall12 text-neutral-40 md:px-3 md:py-1">
            {getRelativeDate(guide.createDate)}
          </span>
        )}
        {hasLink && (
          <span className="shrink-0 rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-medium text-blue-600">
            URL
          </span>
        )}
      </div>
      <span className="break-words text-xsmall14 text-neutral-10 md:text-xsmall16">
        {guide.title}
      </span>
    </a>
  );
}

export default function NoticeListPage() {
  const { data, isLoading } = useMentorGuideListQuery();
  const guides = data?.challengeMentorGuideList ?? [];

  if (isLoading) {
    return (
      <NoticeLayout>
        <div className="py-20 text-center text-xsmall14 text-neutral-40">
          불러오는 중...
        </div>
      </NoticeLayout>
    );
  }

  if (guides.length === 0) {
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
          {guides.map((guide) => (
            <GuideRow key={guide.challengeMentorGuideId} guide={guide} />
          ))}
        </div>
      </section>
    </NoticeLayout>
  );
}
