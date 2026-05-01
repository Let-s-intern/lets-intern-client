'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useChallengeMissionFeedbackListQuery } from '@/api/challenge/challenge';
import { useAdminChallengeMentorListQuery } from '@/api/mentor/mentor';
import Heading from '@/domain/admin/ui/heading/Heading';
import axios from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

/* ── 진행중 챌린지 전용 스키마 (필요한 필드만) ── */

const ongoingProgramInfoSchema = z.object({
  id: z.number(),
  title: z.string().nullable().optional(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
});

const ongoingChallengeSchema = z.object({
  programList: z.array(
    z.object({
      programInfo: ongoingProgramInfoSchema,
    }),
  ),
  pageInfo: z.object({
    totalElements: z.number(),
    totalPages: z.number(),
    pageNum: z.number(),
    pageSize: z.number(),
  }),
});

type OngoingProgramInfo = z.infer<typeof ongoingProgramInfoSchema>;

const useOngoingChallengesQuery = () => {
  return useQuery({
    queryKey: ['ongoingChallenges'],
    queryFn: async () => {
      const res = await axios.get('/program/admin', {
        params: {
          type: 'CHALLENGE',
          isActive: true,
          page: 1,
          size: 1000,
        },
      });
      return ongoingChallengeSchema.parse(res.data.data);
    },
  });
};

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

function ChallengeRow({ programInfo }: { programInfo: OngoingProgramInfo }) {
  const challengeId = programInfo.id;

  const { data: feedbackData } =
    useChallengeMissionFeedbackListQuery(challengeId);
  const { data: mentorData } = useAdminChallengeMentorListQuery(challengeId);

  const { feedbackTh, feedbackPeriod, feedbackStatus } = useMemo(() => {
    const missions = feedbackData?.missionList ?? [];
    const now = new Date();

    const activeMission =
      missions.find((m) => {
        if (!m.startDate || !m.endDate) return false;
        const start = new Date(m.startDate);
        const end = new Date(m.endDate);
        return now >= start && now <= end;
      }) ?? missions[missions.length - 1];

    if (!activeMission || !activeMission.startDate || !activeMission.endDate) {
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
  }, [feedbackData]);

  const mentorNames =
    mentorData?.mentorList.map((m) => m.name).join(', ') || '-';

  return (
    <tr className="border-neutral-80 border-b last:border-b-0">
      <td className="text-xsmall14 max-w-[300px] px-4 py-3">
        {programInfo.title ?? '-'}
      </td>
      <td className="text-xsmall14 whitespace-nowrap px-4 py-3 text-center">
        {feedbackTh}
      </td>
      <td className="text-xsmall14 whitespace-nowrap px-4 py-3 text-center">
        {formatDate(programInfo.startDate)} ~ {formatDate(programInfo.endDate)}
      </td>
      <td className="text-xsmall14 whitespace-nowrap px-4 py-3 text-center">
        {feedbackPeriod}
      </td>
      <td className="text-xsmall14 whitespace-nowrap px-4 py-3 text-center">
        {feedbackStatus}
      </td>
      <td className="text-xsmall14 whitespace-nowrap px-4 py-3 text-center">
        {mentorNames}
      </td>
      <td className="text-xsmall14 whitespace-nowrap px-4 py-3 text-center">
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
  const { data, isLoading } = useOngoingChallengesQuery();

  const challenges = data?.programList ?? [];

  return (
    <div className="border-neutral-80 rounded-lg border p-6">
      <div className="mb-6">
        <Heading>진행 중</Heading>
      </div>

      {isLoading ? (
        <div className="text-xsmall14 text-neutral-40 py-16 text-center">
          불러오는 중...
        </div>
      ) : challenges.length === 0 ? (
        <div className="text-xsmall14 text-neutral-40 py-16 text-center">
          진행 중인 챌린지가 없습니다.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-neutral-60 bg-neutral-95 border-b-2">
                <th className="text-xsmall14 text-neutral-0 min-w-[200px] px-4 py-3 text-left font-semibold">
                  챌린지
                </th>
                <th className="text-xsmall14 text-neutral-0 whitespace-nowrap px-4 py-3 text-center font-semibold">
                  피드백 미션 회차
                </th>
                <th className="text-xsmall14 text-neutral-0 whitespace-nowrap px-4 py-3 text-center font-semibold">
                  챌린지 기간
                </th>
                <th className="text-xsmall14 text-neutral-0 whitespace-nowrap px-4 py-3 text-center font-semibold">
                  피드백 기간
                </th>
                <th className="text-xsmall14 text-neutral-0 whitespace-nowrap px-4 py-3 text-center font-semibold">
                  상태
                </th>
                <th className="text-xsmall14 text-neutral-0 whitespace-nowrap px-4 py-3 text-center font-semibold">
                  담당자
                </th>
                <th className="text-xsmall14 text-neutral-0 whitespace-nowrap px-4 py-3 text-center font-semibold">
                  바로가기
                </th>
              </tr>
            </thead>
            <tbody>
              {challenges.map((item) => (
                <ChallengeRow
                  key={item.programInfo.id}
                  programInfo={item.programInfo}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
