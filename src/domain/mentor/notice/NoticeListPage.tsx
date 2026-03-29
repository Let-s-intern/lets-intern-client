'use client';

import { useChallengeMentorGuideListQuery } from '@/api/challenge-mentor-guide/challengeMentorGuide';
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

function GuideRow({ guide }: { guide: ChallengeMentorGuideItem }) {
  return (
    <a
      href={guide.link ?? '#'}
      target={guide.link ? '_blank' : undefined}
      rel={guide.link ? 'noopener noreferrer' : undefined}
      className="flex flex-col gap-2 border-b border-neutral-80 px-4 py-3 transition-colors last:border-b-0 hover:bg-neutral-95 md:flex-row md:items-center md:gap-4 md:px-6 md:py-4"
    >
      {guide.createDate && (
        <span className="w-fit shrink-0 rounded border border-neutral-80 px-2.5 py-0.5 text-xxsmall12 text-neutral-40 md:px-3 md:py-1">
          {getRelativeDate(guide.createDate)}
        </span>
      )}
      <span className="break-words text-xsmall14 text-neutral-10 md:text-xsmall16">{guide.title}</span>
    </a>
  );
}

function ChallengeGuideSection({ challengeId }: { challengeId: number }) {
  const { data, isError } = useChallengeMentorGuideListQuery(challengeId);
  const guides = data?.challengeMentorGuideList ?? [];

  if (isError || guides.length === 0) return null;

  return (
    <>
      {guides.map((guide) => (
        <GuideRow key={guide.challengeMentorGuideId} guide={guide} />
      ))}
    </>
  );
}

export default function NoticeListPage() {
  const { data: challengeData, isLoading } = useMentorChallengeListQuery();
  const challenges = challengeData?.myChallengeMentorVoList ?? [];

  if (isLoading) {
    return (
      <NoticeLayout>
        <div className="py-20 text-center text-xsmall14 text-neutral-40">
          불러오는 중...
        </div>
      </NoticeLayout>
    );
  }

  if (challenges.length === 0) {
    return (
      <NoticeLayout>
        <div className="py-20 text-center text-xsmall14 text-neutral-40">
          참여 중인 챌린지가 없습니다.
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
          {challenges.map((challenge) => (
            <ChallengeGuideSection
              key={challenge.challengeId}
              challengeId={challenge.challengeId}
            />
          ))}
        </div>
      </section>
    </NoticeLayout>
  );
}
