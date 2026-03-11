'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useGetProgramAdminQuery } from '@/api/program';
import { useChallengeMissionFeedbackListQuery } from '@/api/challenge/challenge';
import { useAdminChallengeMentorListQuery } from '@/api/mentor/mentor';
import type { ProgramAdminListItem } from '@/schema';
import Heading from '@/domain/admin/ui/heading/Heading';

/* ── 유틸 ── */

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '-';
  return dateStr.slice(0, 10);
}

function computeFeedbackStatus(
  startDate: string,
  endDate: string,
  now: Date,
): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (now < start) return '피드백 진행전';
  if (now <= end) return '피드백 진행중';
  return '피드백 완료';
}

/* ── 행 컴포넌트 ── */

function ChallengeRow({ item }: { item: ProgramAdminListItem }) {
  const { programInfo } = item;
  const challengeId = programInfo.id;

  const { data: feedbackData } =
    useChallengeMissionFeedbackListQuery(challengeId);
  const { data: mentorData } = useAdminChallengeMentorListQuery(challengeId);

  const missions = feedbackData?.missionList ?? [];

  const { feedbackTh, feedbackPeriod, feedbackStatus } = useMemo(() => {
    const now = new Date();

    // 현재 진행중이거나 가장 마지막 미션 찾기
    const activeMission =
      missions.find((m) => {
        const start = new Date(m.startDate);
        const end = new Date(m.endDate);
        return now >= start && now <= end;
      }) ?? missions[missions.length - 1];

    if (!activeMission) {
      return { feedbackTh: '-', feedbackPeriod: '-', feedbackStatus: '-' };
    }

    return {
      feedbackTh: `${activeMission.th}회차`,
      feedbackPeriod: `${formatDate(activeMission.startDate)} ~ ${formatDate(activeMission.endDate)}`,
      feedbackStatus: computeFeedbackStatus(
        activeMission.startDate,
        activeMission.endDate,
        now,
      ),
    };
  }, [missions]);

  const mentorNames =
    mentorData?.mentorList.map((m) => m.name).join(', ') || '-';

  return (
    <tr className="border-b border-neutral-80 last:border-b-0">
      <td className="max-w-[300px] px-4 py-3 text-xsmall14">
        {programInfo.title ?? '-'}
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-center text-xsmall14">
        {feedbackTh}
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-center text-xsmall14">
        {formatDate(programInfo.startDate)} ~ {formatDate(programInfo.endDate)}
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-center text-xsmall14">
        {feedbackPeriod}
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-center text-xsmall14">
        {feedbackStatus}
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-center text-xsmall14">
        {mentorNames}
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-center text-xsmall14">
        <Link
          href={`/admin/challenge/operation/${challengeId}/feedback`}
          className="text-blue-600 hover:underline"
        >
          바로가기
        </Link>
      </td>
    </tr>
  );
}

export default function OngoingChallenges() {
  const { data, isLoading } = useGetProgramAdminQuery({
    type: 'CHALLENGE',
    status: ['PROCEEDING'],
    page: 1,
    size: 100,
  });

  const challenges = data?.programList ?? [];

  return (
    <div className="rounded-lg border border-neutral-80 p-6">
      <div className="mb-6">
        <Heading>진행 중</Heading>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-xsmall14 text-neutral-40">
          불러오는 중...
        </div>
      ) : challenges.length === 0 ? (
        <div className="py-16 text-center text-xsmall14 text-neutral-40">
          진행 중인 챌린지가 없습니다.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-neutral-60 bg-neutral-95">
                <th className="min-w-[200px] px-4 py-3 text-left text-xsmall14 font-semibold text-neutral-0">
                  챌린지
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-center text-xsmall14 font-semibold text-neutral-0">
                  피드백 미션 회차
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-center text-xsmall14 font-semibold text-neutral-0">
                  챌린지 기간
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-center text-xsmall14 font-semibold text-neutral-0">
                  피드백 기간
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-center text-xsmall14 font-semibold text-neutral-0">
                  상태
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-center text-xsmall14 font-semibold text-neutral-0">
                  담당자
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-center text-xsmall14 font-semibold text-neutral-0">
                  바로가기
                </th>
              </tr>
            </thead>
            <tbody>
              {challenges.map((item) => (
                <ChallengeRow key={item.programInfo.id} item={item} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
