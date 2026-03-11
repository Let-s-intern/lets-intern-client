'use client';

import { challengeApplicationsSchema } from '@/schema';
import {
  useAdminChallengeMentorListQuery,
  usePostAdminChallengeMentorMatch,
} from '@/api/mentor/mentor';
import {
  ChallengeMissionFeedbackAttendanceQueryKey,
  useChallengeMissionFeedbackAttendanceQuery,
  useChallengeMissionFeedbackListQuery,
} from '@/api/challenge/challenge';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import axios from '@/utils/axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';

/**
 * 챌린지 전체 신청자 목록 조회 (필터 없음)
 * GET /challenge/{challengeId}/applications
 */
const useParticipantsQuery = (challengeId: string) => {
  return useQuery({
    queryKey: ['admin', 'challenge', challengeId, 'participants'],
    queryFn: async () => {
      const res = await axios.get(`/challenge/${challengeId}/applications`, {
        params: { isConfirmed: true },
      });
      return challengeApplicationsSchema.parse(res.data.data);
    },
    enabled: Boolean(challengeId),
  });
};

/** 출석 데이터에서 현재 멘토 배정 정보 조회 */
const useMentorAssignmentMap = (challengeId: string) => {
  const { data: missionData } = useChallengeMissionFeedbackListQuery(
    Number(challengeId),
    { enabled: Boolean(challengeId) },
  );

  const firstMission = useMemo(
    () => missionData?.missionList?.find((m) => !!m.challengeOptionTitle),
    [missionData],
  );

  const { data: attendanceData } =
    useChallengeMissionFeedbackAttendanceQuery({
      challengeId,
      missionId: firstMission ? String(firstMission.id) : '',
      enabled: Boolean(challengeId) && !!firstMission,
    });

  return useMemo(() => {
    const map = new Map<
      string,
      { mentorId: number | null; mentorName: string | null }
    >();
    for (const a of attendanceData?.attendanceList ?? []) {
      if (a.name) {
        map.set(a.name, { mentorId: a.mentorId, mentorName: a.mentorName });
      }
    }
    return map;
  }, [attendanceData]);
};

export default function MentorMenteeAssignment() {
  const { programId } = useParams<{ programId: string }>();
  const queryClient = useQueryClient();
  const { snackbar } = useAdminSnackbar();

  const {
    data: participantData,
    isLoading: isParticipantLoading,
    error: participantError,
  } = useParticipantsQuery(programId);
  const { data: mentorData, isLoading: isMentorLoading } =
    useAdminChallengeMentorListQuery(programId);
  const mentorAssignmentMap = useMentorAssignmentMap(programId);
  const matchMutation = usePostAdminChallengeMentorMatch();

  const [selectedMentors, setSelectedMentors] = useState<
    Record<number, number>
  >({});
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
  const [bulkMentorUserId, setBulkMentorUserId] = useState<number | ''>('');

  const participants = useMemo(
    () =>
      (participantData?.applicationList ?? []).map((item) => ({
        ...item.application,
        currentMentorName: item.application.name
          ? (mentorAssignmentMap.get(item.application.name)?.mentorName ?? null)
          : null,
      })),
    [participantData, mentorAssignmentMap],
  );

  const mentors = mentorData?.mentorList ?? [];

  const isAllChecked =
    participants.length > 0 && checkedIds.size === participants.length;

  const handleToggleAll = () => {
    if (isAllChecked) {
      setCheckedIds(new Set());
    } else {
      setCheckedIds(new Set(participants.map((p) => p.id)));
    }
  };

  const handleToggle = (id: number) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const invalidateQueries = () => {
    queryClient.invalidateQueries({
      queryKey: [ChallengeMissionFeedbackAttendanceQueryKey],
    });
  };

  const handleMatch = async (applicationId: number) => {
    const userId = selectedMentors[applicationId];
    if (!userId) {
      snackbar('멘토를 선택해주세요.');
      return;
    }
    const mentor = mentors.find((m) => m.userId === userId);
    if (!mentor) return;

    try {
      await matchMutation.mutateAsync({
        challengeId: Number(programId),
        challengeMentorId: mentor.challengeMentorId,
        applicationId,
      });
      snackbar('매칭이 완료되었습니다.');
      invalidateQueries();
    } catch {
      // error handled in mutation
    }
  };

  const handleBulkAssign = async () => {
    if (!bulkMentorUserId) {
      snackbar('일괄 지정할 멘토를 선택해주세요.');
      return;
    }
    if (checkedIds.size === 0) {
      snackbar('참여자를 선택해주세요.');
      return;
    }
    const mentor = mentors.find((m) => m.userId === bulkMentorUserId);
    if (!mentor) return;

    try {
      await Promise.all(
        [...checkedIds].map((appId) =>
          matchMutation.mutateAsync({
            challengeId: Number(programId),
            challengeMentorId: mentor.challengeMentorId,
            applicationId: appId,
          }),
        ),
      );
      snackbar(`${checkedIds.size}명에게 멘토를 지정했습니다.`);
      setCheckedIds(new Set());
      setBulkMentorUserId('');
      invalidateQueries();
    } catch {
      // error handled in mutation
    }
  };

  if (isParticipantLoading || isMentorLoading) {
    return (
      <div className="py-16 text-center text-xsmall14 text-neutral-40">
        불러오는 중...
      </div>
    );
  }

  if (participantError) {
    return (
      <div className="py-16 text-center text-xsmall14 text-red-500">
        참여자 목록을 불러올 수 없습니다.
        <br />
        <span className="text-xxsmall12 text-neutral-40">
          {String(participantError)}
        </span>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-medium18 font-semibold">멘토 배정 현황</h3>
        {/* 일괄 지정 */}
        <div className="flex items-center gap-2">
          <select
            className="rounded border border-neutral-80 px-2 py-1.5 text-xsmall14 outline-none"
            value={bulkMentorUserId}
            onChange={(e) =>
              setBulkMentorUserId(e.target.value ? Number(e.target.value) : '')
            }
          >
            <option value="">멘토 선택</option>
            {mentors.map((m) => (
              <option key={m.challengeMentorId} value={m.userId}>
                {m.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="rounded border border-neutral-80 px-4 py-1.5 text-xsmall14 hover:bg-neutral-95 disabled:opacity-50"
            disabled={
              !bulkMentorUserId ||
              checkedIds.size === 0 ||
              matchMutation.isPending
            }
            onClick={handleBulkAssign}
          >
            일괄 지정 ({checkedIds.size}명)
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xsmall14">
          <thead>
            <tr className="border-b border-neutral-80 bg-neutral-95">
              <th className="px-3 py-2 text-center">
                <input
                  type="checkbox"
                  checked={isAllChecked}
                  onChange={handleToggleAll}
                />
              </th>
              <th className="px-3 py-2 text-left font-medium">결제상품</th>
              <th className="px-3 py-2 text-left font-medium">이름</th>
              <th className="px-3 py-2 text-left font-medium">
                멘티 정보(희망기업/직무)
              </th>
              <th className="px-3 py-2 text-left font-medium">현재 멘토</th>
              <th className="px-3 py-2 text-left font-medium">멘토 선택</th>
              <th className="px-3 py-2 text-center font-medium">매칭</th>
            </tr>
          </thead>
          <tbody>
            {participants.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-neutral-40">
                  참여자가 없습니다.
                </td>
              </tr>
            ) : (
              participants.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-neutral-90 hover:bg-neutral-95/50"
                >
                  <td className="px-3 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={checkedIds.has(p.id)}
                      onChange={() => handleToggle(p.id)}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <span className="rounded bg-primary-10 px-2 py-0.5 text-xxsmall12 font-medium text-primary">
                      {p.challengePricePlanType ?? '-'}
                    </span>
                  </td>
                  <td className="px-3 py-2">{p.name ?? '-'}</td>
                  <td className="px-3 py-2 text-neutral-30">
                    {p.wishCompany ?? '-'} / {p.wishJob ?? '-'}
                  </td>
                  <td className="px-3 py-2">
                    {p.currentMentorName ? (
                      <span className="rounded bg-green-50 px-2 py-0.5 text-xxsmall12 font-medium text-green-700">
                        {p.currentMentorName}
                      </span>
                    ) : (
                      <span className="text-neutral-40">미배정</span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <select
                      className="rounded border border-neutral-80 px-2 py-1 text-xsmall14 outline-none"
                      value={selectedMentors[p.id] ?? ''}
                      onChange={(e) =>
                        setSelectedMentors((prev) => ({
                          ...prev,
                          [p.id]: Number(e.target.value),
                        }))
                      }
                    >
                      <option value="">선택</option>
                      {mentors.map((m) => (
                        <option key={m.challengeMentorId} value={m.userId}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button
                      type="button"
                      className="rounded bg-primary px-3 py-1 text-xxsmall12 text-white hover:bg-primary-dark disabled:opacity-50"
                      disabled={
                        !selectedMentors[p.id] || matchMutation.isPending
                      }
                      onClick={() => handleMatch(p.id)}
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
