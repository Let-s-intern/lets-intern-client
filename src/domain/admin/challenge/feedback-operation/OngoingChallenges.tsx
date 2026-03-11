'use client';

import Link from 'next/link';
import { useGetProgramAdminQuery } from '@/api/program';
import { useChallengeMissionFeedbackListQuery } from '@/api/challenge/challenge';
import { useAdminChallengeMentorListQuery } from '@/api/mentor/mentor';
import type { ProgramAdminListItem } from '@/schema';
import Heading from '@/domain/admin/ui/heading/Heading';

function formatDate(dateStr?: string | null) {
  if (!dateStr) return '-';
  return dateStr.slice(0, 10);
}

function ChallengeRow({ item }: { item: ProgramAdminListItem }) {
  const { programInfo } = item;
  const challengeId = programInfo.id;

  const { data: feedbackData } = useChallengeMissionFeedbackListQuery(
    challengeId,
    { enabled: true },
  );
  const { data: mentorData } = useAdminChallengeMentorListQuery(challengeId);

  const missions = feedbackData?.missionList ?? [];
  const now = new Date();

  // 현재 진행중이거나 가장 가까운 미션 찾기
  const currentMission =
    missions.find((m) => {
      const start = new Date(m.startDate);
      const end = new Date(m.endDate);
      return now >= start && now <= end;
    }) ?? missions[missions.length - 1];

  const feedbackTh = currentMission ? `${currentMission.th}회차` : '-';

  const feedbackPeriod = currentMission
    ? `${formatDate(currentMission.startDate)} ~ ${formatDate(currentMission.endDate)}`
    : '-';

  // 피드백 상태 계산
  let feedbackStatus = '-';
  if (currentMission) {
    const start = new Date(currentMission.startDate);
    const end = new Date(currentMission.endDate);
    if (now < start) feedbackStatus = '피드백 진행전';
    else if (now <= end) feedbackStatus = '피드백 진행중';
    else feedbackStatus = '피드백 완료';
  }

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
