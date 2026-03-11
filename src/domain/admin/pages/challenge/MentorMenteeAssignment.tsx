'use client';

import { challengeApplicationsSchema } from '@/schema';
import {
  useAdminChallengeMentorListQuery,
  usePostAdminChallengeMentorMatch,
} from '@/api/mentor/mentor';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import axios from '@/utils/axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useState } from 'react';

interface MenteeRow {
  applicationId: number;
  name: string;
  email: string;
  wishCompany: string;
  wishJob: string;
  challengePricePlanType: string;
  selectedMentorId: number | null;
}

const useMenteeListQuery = (challengeId: number) => {
  return useQuery({
    queryKey: ['admin', 'challenge', challengeId, 'menteeApplications'],
    queryFn: async () => {
      const res = await axios.get(`/challenge/${challengeId}/applications`, {
        params: { isCanceled: false, isMentee: true },
      });
      return challengeApplicationsSchema.parse(res.data.data);
    },
    enabled: !!challengeId,
  });
};

export default function MentorMenteeAssignment() {
  const { programId } = useParams<{ programId: string }>();
  const challengeId = Number(programId);
  const queryClient = useQueryClient();
  const { snackbar } = useAdminSnackbar();

  const { data: menteeData, isLoading: isMenteeLoading } =
    useMenteeListQuery(challengeId);
  const { data: mentorData, isLoading: isMentorLoading } =
    useAdminChallengeMentorListQuery(challengeId);
  const matchMutation = usePostAdminChallengeMentorMatch();

  const [selectedMentors, setSelectedMentors] = useState<
    Record<number, number>
  >({});

  const mentees: MenteeRow[] = (menteeData?.applicationList ?? []).map(
    (item) => ({
      applicationId: item.application.id,
      name: item.application.name ?? '-',
      email: item.application.email ?? '-',
      wishCompany: item.application.wishCompany ?? '-',
      wishJob: item.application.wishJob ?? '-',
      challengePricePlanType:
        item.application.challengePricePlanType ?? 'BASIC',
      selectedMentorId: null,
    }),
  );

  const mentors = mentorData?.mentorList ?? [];

  const handleMentorSelect = (applicationId: number, mentorId: number) => {
    setSelectedMentors((prev) => ({ ...prev, [applicationId]: mentorId }));
  };

  const handleMatch = async (applicationId: number) => {
    const challengeMentorId = selectedMentors[applicationId];
    if (!challengeMentorId) {
      snackbar('멘토를 선택해주세요.');
      return;
    }

    try {
      await matchMutation.mutateAsync({
        challengeId,
        challengeMentorId,
        applicationId,
      });
      snackbar('매칭이 완료되었습니다.');
      queryClient.invalidateQueries({
        queryKey: ['admin', 'challenge', challengeId, 'menteeApplications'],
      });
    } catch {
      // error handled in mutation
    }
  };

  if (isMenteeLoading || isMentorLoading) {
    return (
      <div className="py-16 text-center text-xsmall14 text-neutral-40">
        불러오는 중...
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-medium18 font-semibold">
          멘토 배정 현황
        </h3>
        <button
          type="button"
          className="rounded border border-neutral-80 px-4 py-2 text-xsmall14 hover:bg-neutral-95"
          onClick={() => {
            // 선택된 멘토가 있는 멘티들 일괄 매칭
            const entries = Object.entries(selectedMentors);
            if (entries.length === 0) {
              snackbar('매칭할 멘토를 선택해주세요.');
              return;
            }
            Promise.all(
              entries.map(([appId, mentorId]) =>
                matchMutation.mutateAsync({
                  challengeId,
                  challengeMentorId: mentorId,
                  applicationId: Number(appId),
                }),
              ),
            ).then(() => {
              snackbar('일괄 매칭이 완료되었습니다.');
              setSelectedMentors({});
              queryClient.invalidateQueries({
                queryKey: [
                  'admin',
                  'challenge',
                  challengeId,
                  'menteeApplications',
                ],
              });
            });
          }}
        >
          새로 만들기
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xsmall14">
          <thead>
            <tr className="border-b border-neutral-80 bg-neutral-95">
              <th className="px-3 py-2 text-left font-medium">결제상품</th>
              <th className="px-3 py-2 text-left font-medium">이름</th>
              <th className="px-3 py-2 text-left font-medium">
                멘티 정보(희망기업/직무)
              </th>
              <th className="px-3 py-2 text-left font-medium">멘토</th>
              <th className="px-3 py-2 text-left font-medium">
                멘토 정보(회사/직무)
              </th>
              <th className="px-3 py-2 text-center font-medium">매칭</th>
            </tr>
          </thead>
          <tbody>
            {mentees.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 text-center text-neutral-40"
                >
                  멘티 목록이 없습니다.
                </td>
              </tr>
            ) : (
              mentees.map((mentee) => (
                <tr
                  key={mentee.applicationId}
                  className="border-b border-neutral-90 hover:bg-neutral-95/50"
                >
                  <td className="px-3 py-2">
                    <span className="rounded bg-primary-10 px-2 py-0.5 text-xxsmall12 font-medium text-primary">
                      {mentee.challengePricePlanType}
                    </span>
                  </td>
                  <td className="px-3 py-2">{mentee.name}</td>
                  <td className="px-3 py-2 text-neutral-30">
                    {mentee.wishCompany} / {mentee.wishJob}
                  </td>
                  <td className="px-3 py-2">
                    <select
                      className="rounded border border-neutral-80 px-2 py-1 text-xsmall14 outline-none"
                      value={selectedMentors[mentee.applicationId] ?? ''}
                      onChange={(e) =>
                        handleMentorSelect(
                          mentee.applicationId,
                          Number(e.target.value),
                        )
                      }
                    >
                      <option value="">선택</option>
                      {mentors.map((m) => (
                        <option key={m.challengeMentorId} value={m.challengeMentorId}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2 text-neutral-30">-</td>
                  <td className="px-3 py-2 text-center">
                    <button
                      type="button"
                      className="rounded bg-primary px-3 py-1 text-xxsmall12 text-white hover:bg-primary-dark disabled:opacity-50"
                      disabled={
                        !selectedMentors[mentee.applicationId] ||
                        matchMutation.isPending
                      }
                      onClick={() => handleMatch(mentee.applicationId)}
                    >
                      매칭
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
