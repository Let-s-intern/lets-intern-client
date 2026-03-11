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
      className="flex items-center gap-4 border-b border-neutral-80 px-6 py-4 transition-colors last:border-b-0 hover:bg-neutral-95"
    >
      {guide.createDate && (
        <span className="shrink-0 rounded border border-neutral-80 px-3 py-1 text-xxsmall12 text-neutral-40">
          {getRelativeDate(guide.createDate)}
        </span>
      )}
      <span className="text-xsmall16 text-neutral-10">{guide.title}</span>
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
