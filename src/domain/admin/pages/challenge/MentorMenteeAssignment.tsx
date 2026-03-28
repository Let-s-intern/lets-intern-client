'use client';

import {
  useAdminChallengeMentorListQuery,
  usePostAdminChallengeMentorMatch,
} from '@/api/mentor/mentor';
import {
  ChallengeApplicationsQueryKey,
  useChallengeApplicationsQuery,
} from '@/api/challenge/challenge';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useState } from 'react';

type MentorItem = { challengeMentorId: number; userId: number; name: string; userCareerList: { company: string | null; job: string | null }[] };

export default function MentorMenteeAssignment() {
  const { programId } = useParams<{ programId: string }>();
  const queryClient = useQueryClient();
  const { snackbar } = useAdminSnackbar();

  const { data: applicationsData, isLoading: isApplicationsLoading } =
    useChallengeApplicationsQuery({
      challengeId: programId,
      isCanceled: false,
      enabled: Boolean(programId),
    });
  const { data: mentorData, isLoading: isMentorLoading } =
    useAdminChallengeMentorListQuery(programId);
  const matchMutation = usePostAdminChallengeMentorMatch();

  const [selectedMentors, setSelectedMentors] = useState<
    Record<number, number | null>
  >({});
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
  const [bulkMentorId, setBulkMentorId] = useState<number | null | ''>('');

  const applicationList = applicationsData?.applicationList ?? [];
  const mentors = mentorData?.mentorList ?? [];

  const MENTOR_COLORS = [
    { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', ring: 'ring-red-300' },
    { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', ring: 'ring-orange-300' },
    { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', ring: 'ring-yellow-300' },
    { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', ring: 'ring-green-300' },
    { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', ring: 'ring-blue-300' },
    { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', ring: 'ring-indigo-300' },
    { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', ring: 'ring-violet-300' },
  ] as const;

  const getMentorColor = (mentorIndex: number) =>
    MENTOR_COLORS[mentorIndex % MENTOR_COLORS.length];

  const getMentorLabel = (m: MentorItem) => {
    const career = m.userCareerList?.[0];
    if (!career?.company || !career?.job) return m.name;
    return `${m.name} (${career.company}/${career.job})`;
  };

  const isAllChecked =
    applicationList.length > 0 && checkedIds.size === applicationList.length;

  const handleToggleAll = () => {
    if (isAllChecked) {
      setCheckedIds(new Set());
    } else {
      setCheckedIds(new Set(applicationList.map((a) => a.application.id)));
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
      queryKey: [ChallengeApplicationsQueryKey],
    });
  };

  const handleMatch = async (applicationId: number) => {
    const challengeMentorId = selectedMentors[applicationId];
    if (challengeMentorId === undefined) {
      snackbar('멘토를 선택해주세요.');
      return;
    }

    if (challengeMentorId === null) {
      // match API does not support unassignment; show info message
      snackbar('배정 해제는 현재 지원되지 않습니다.');
      return;
    }

    try {
      await matchMutation.mutateAsync({
        challengeId: Number(programId),
        challengeMentorId,
        challengeApplicationIdList: [applicationId],
      });
      snackbar('매칭이 완료되었습니다.');
      invalidateQueries();
    } catch {
      snackbar('매칭에 실패했습니다.');
    }
  };

  const handleBulkAssign = async () => {
    if (bulkMentorId === '') {
      snackbar('일괄 지정할 멘토를 선택해주세요.');
      return;
    }
    if (checkedIds.size === 0) {
      snackbar('참여자를 선택해주세요.');
      return;
    }

    if (bulkMentorId === null) {
      snackbar('배정 해제는 현재 지원되지 않습니다.');
      return;
    }

    try {
      await matchMutation.mutateAsync({
        challengeId: Number(programId),
        challengeMentorId: bulkMentorId,
        challengeApplicationIdList: [...checkedIds],
      });
      snackbar(`${checkedIds.size}명에게 멘토를 지정했습니다.`);
      setCheckedIds(new Set());
      setBulkMentorId('');
      invalidateQueries();
    } catch {
      snackbar('일괄 지정에 실패했습니다.');
    }
  };

  if (isApplicationsLoading || isMentorLoading) {
    return (
      <div className="py-16 text-center text-xsmall14 text-neutral-40">
        불러오는 중...
      </div>
    );
  }

  return (
    <div>
      {/* 멘토 목록 */}
      <div className="mb-6">
        <h3 className="mb-3 text-medium18 font-semibold">등록된 멘토</h3>
        {mentors.length === 0 ? (
          <p className="text-xsmall14 text-neutral-40">
            등록된 멘토가 없습니다.
          </p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {mentors.map((m, i) => {
              const career = m.userCareerList?.[0];
              const color = getMentorColor(i);
              const assignedCount = applicationList.filter(
                (a) => a.application.challengeMentorId === m.challengeMentorId,
              ).length;
              return (
                <div
                  key={m.challengeMentorId}
                  className={`rounded-lg border px-4 py-3 ${color.bg} ${color.border}`}
                >
                  <p className={`text-xsmall14 font-semibold ${color.text}`}>
                    {m.name}
                  </p>
                  {career?.company && career?.job && (
                    <p className={`mt-0.5 text-xxsmall12 ${color.text} opacity-70`}>
                      {career.company} / {career.job}
                    </p>
                  )}
                  <p className={`mt-1 text-xxsmall12 ${color.text} opacity-60`}>
                    배정 멘티: {assignedCount}명
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-medium18 font-semibold">멘토 배정 현황</h3>
        {/* 일괄 지정 */}
        <div className="flex items-center gap-2">
          <select
            className="rounded border border-neutral-80 px-2 py-1.5 text-xsmall14 outline-none"
            value={bulkMentorId ?? 'none'}
            onChange={(e) => {
              const v = e.target.value;
              setBulkMentorId(
                v === '' ? '' : v === 'none' ? null : Number(v),
              );
            }}
          >
            <option value="">멘토 선택</option>
            <option value="none">없음 (배정 해제)</option>
            {mentors.map((m) => (
              <option key={m.challengeMentorId} value={m.challengeMentorId}>
                {getMentorLabel(m)}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="rounded border border-neutral-80 px-4 py-1.5 text-xsmall14 hover:bg-neutral-95 disabled:opacity-50"
            disabled={
              bulkMentorId === '' ||
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
            {applicationList.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-neutral-40">
                  참여자가 없습니다.
                </td>
              </tr>
            ) : (
              applicationList.map((a) => (
                <tr
                  key={a.application.id}
                  className="border-b border-neutral-90 hover:bg-neutral-95/50"
                >
                  <td className="px-3 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={checkedIds.has(a.application.id)}
                      onChange={() => handleToggle(a.application.id)}
                    />
                  </td>
                  <td className="px-3 py-2">{a.application.name ?? '-'}</td>
                  <td className="px-3 py-2 text-neutral-30">
                    {a.application.wishCompany ?? '-'} / {a.application.wishJob ?? '-'}
                  </td>
                  <td className="px-3 py-2">
                    {a.application.challengeMentorName && a.application.challengeMentorId ? (
                      (() => {
                        const matched = mentors.find(
                          (m) => m.challengeMentorId === a.application.challengeMentorId,
                        );
                        const idx = matched ? mentors.indexOf(matched) : -1;
                        const color = idx >= 0 ? getMentorColor(idx) : null;
                        const career = matched?.userCareerList?.[0];
                        return (
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xxsmall12 font-medium ${color?.bg ?? 'bg-neutral-90'} ${color?.text ?? 'text-neutral-40'}`}
                          >
                            {a.application.challengeMentorName}
                            {career?.company && career?.job && (
                              <span className="ml-1 font-normal opacity-70">
                                ({career.company}/{career.job})
                              </span>
                            )}
                          </span>
                        );
                      })()
                    ) : (
                      <span className="text-neutral-40">미배정</span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <select
                      className="rounded border border-neutral-80 px-2 py-1 text-xsmall14 outline-none"
                      value={
                        selectedMentors[a.application.id] === null
                          ? 'none'
                          : (selectedMentors[a.application.id] ?? '')
                      }
                      onChange={(e) => {
                        const v = e.target.value;
                        setSelectedMentors((prev) => {
                          const next = { ...prev };
                          if (v === '') {
                            delete next[a.application.id];
                          } else {
                            next[a.application.id] = v === 'none' ? null : Number(v);
                          }
                          return next;
                        });
                      }}
                    >
                      <option value="">선택</option>
                      <option value="none">없음 (배정 해제)</option>
                      {mentors.map((m) => (
                        <option key={m.challengeMentorId} value={m.challengeMentorId}>
                          {getMentorLabel(m)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button
                      type="button"
                      className="rounded bg-primary px-3 py-1 text-xxsmall12 text-white hover:bg-primary-dark disabled:opacity-50"
                      disabled={
                        selectedMentors[a.application.id] === undefined ||
                        matchMutation.isPending
                      }
                      onClick={() => handleMatch(a.application.id)}
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
