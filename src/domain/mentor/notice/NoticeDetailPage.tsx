'use client';

import Link from 'next/link';
import { useChallengeMentorGuideListQuery } from '@/api/challenge-mentor-guide/challengeMentorGuide';
import { useMentorChallengeListQuery } from '@/api/user/user';

export default function NoticeDetailPage({
  noticeId,
}: {
  noticeId: string;
}) {
  const { data: challengeData, isLoading: challengeLoading } =
    useMentorChallengeListQuery();

  const challenges = challengeData?.myChallengeMentorVoList ?? [];

  // 모든 챌린지의 가이드를 조회하여 noticeId에 해당하는 가이드를 찾음
  return (
    <NoticeDetailInner
      noticeId={noticeId}
      challenges={challenges}
      isLoading={challengeLoading}
    />
  );
}

function NoticeDetailInner({
  noticeId,
  challenges,
  isLoading,
}: {
  noticeId: string;
  challenges: { challengeId: number }[];
  isLoading: boolean;
}) {
  // 각 챌린지에서 가이드를 조회
  const guideQueries = challenges.map((c) => c.challengeId);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-10">
        <h1 className="text-medium22 font-semibold text-neutral-0">
          공지사항
        </h1>
        <div className="py-20 text-center text-xsmall16 text-neutral-40">
          불러오는 중...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-medium22 font-semibold text-neutral-0">공지사항</h1>

      {guideQueries.map((challengeId) => (
        <GuideDetail
          key={challengeId}
          challengeId={challengeId}
          noticeId={noticeId}
        />
      ))}
    </div>
  );
}

function GuideDetail({
  challengeId,
  noticeId,
}: {
  challengeId: number;
  noticeId: string;
}) {
  const { data, isLoading } = useChallengeMentorGuideListQuery(challengeId);

  const guide = data?.challengeMentorGuideList.find(
    (g) => g.challengeMentorGuideId === Number(noticeId),
  );

  if (isLoading || !guide) return null;

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/mentor/notice"
        className="flex items-center gap-1 text-xsmall14 text-neutral-40 hover:text-neutral-10"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 12L6 8L10 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        뒤로 가기
      </Link>

      <div className="flex flex-col gap-6 rounded-[16px] border border-neutral-80 p-6 md:gap-8 md:p-10">
        <h2 className="text-medium24 font-bold text-neutral-0">
          {guide.title}
        </h2>
        {guide.link && (
          <a
            href={guide.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xsmall16 text-primary hover:underline"
          >
            링크 바로가기
          </a>
        )}
      </div>
    </div>
  );
}
