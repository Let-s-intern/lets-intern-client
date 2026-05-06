import {
  ChallengeApplicationsQueryKey,
  useChallengeApplicationsQuery,
} from '@/api/challenge/challenge';
import { useAdminChallengeMentorListQuery } from '@/api/mentor/mentor';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import { PaybackParticipantsQueryKey } from './usePaybackParticipants';
import usePaybackParticipants from './usePaybackParticipants';
import useMentorMatchHandler from './useMentorMatchHandler';
import type { MentorAssignmentRow, MentorItem } from '../types';

const BASIC_PRICE_PLAN = 'BASIC';

const useMentorAssignmentData = (programId: string) => {
  const { snackbar } = useAdminSnackbar();
  const queryClient = useQueryClient();

  const { data: participantsData, isLoading: isParticipantsLoading } =
    usePaybackParticipants(programId);
  const { data: mentorData, isLoading: isMentorLoading } =
    useAdminChallengeMentorListQuery(programId);
  const { data: applicationsData, isLoading: isApplicationsLoading } =
    useChallengeApplicationsQuery({
      challengeId: programId,
      enabled: !!programId,
    });
  const { handleMatch, isPending } = useMentorMatchHandler(programId);

  const participants = useMemo(
    () => participantsData?.missionApplications ?? [],
    [participantsData],
  );
  // API는 모든 필드를 optional 로 노출하지만 MentorItem 은 핵심 식별 필드를 require.
  // 누락된 행은 BE 데이터 결손이므로 화면에서 제외하고, 나머지는 MentorItem 모양으로 정규화.
  const mentors = useMemo<MentorItem[]>(
    () =>
      (mentorData?.mentorList ?? [])
        .filter(
          (m) =>
            m.challengeMentorId != null && m.userId != null && m.name != null,
        )
        .map((m) => ({
          challengeMentorId: m.challengeMentorId as number,
          userId: m.userId as number,
          name: m.name as string,
          userCareerList: (m.userCareerList ?? []).map((c) => ({
            company: c.company ?? null,
            job: c.job ?? null,
          })),
        })),
    [mentorData],
  );

  // applications에서 멘티 상세 정보 맵 생성
  const applicationDetailsMap = useMemo(() => {
    const map: Record<
      number,
      {
        major: string;
        wishJob: string;
        wishCompany: string;
        pricePlanType: string;
      }
    > = {};
    applicationsData?.applicationList.forEach((a) => {
      map[a.application.id] = {
        major: a.application.major ?? '-',
        wishJob: a.application.wishJob ?? '-',
        wishCompany: a.application.wishCompany ?? '-',
        pricePlanType: a.application.challengePricePlanType ?? '-',
      };
    });
    return map;
  }, [applicationsData]);

  // 서버 데이터에서 멘토 배정 정보 (applications → challengeMentorId)
  const serverMentorMap = useMemo(() => {
    const map: Record<number, number> = {};
    applicationsData?.applicationList.forEach((a) => {
      if (a.application.challengeMentorId) {
        map[a.application.id] = a.application.challengeMentorId as number;
      }
    });
    return map;
  }, [applicationsData]);

  const [optimisticMentors, setOptimisticMentors] = useState<
    Record<number, number>
  >({});

  const effectiveMentors = useMemo(
    () => ({ ...serverMentorMap, ...optimisticMentors }),
    [serverMentorMap, optimisticMentors],
  );

  // 멘토별 매칭 인원 수 계산
  const matchCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    Object.values(effectiveMentors).forEach((mentorId) => {
      counts[mentorId] = (counts[mentorId] ?? 0) + 1;
    });
    return counts;
  }, [effectiveMentors]);

  const invalidateAll = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: [ChallengeApplicationsQueryKey, programId],
    });
    await queryClient.invalidateQueries({
      queryKey: [PaybackParticipantsQueryKey],
    });
  }, [queryClient, programId]);

  const handleSingleMatch = useCallback(
    async (applicationId: number, challengeMentorId: number) => {
      setOptimisticMentors((prev) => ({
        ...prev,
        [applicationId]: challengeMentorId,
      }));
      try {
        await handleMatch({
          challengeMentorId,
          applicationIds: [applicationId],
        });
        snackbar('매칭이 완료되었습니다.');
        await invalidateAll();
      } catch {
        setOptimisticMentors((prev) => {
          const next = { ...prev };
          delete next[applicationId];
          return next;
        });
        snackbar('매칭에 실패했습니다.');
      }
    },
    [handleMatch, snackbar, invalidateAll],
  );

  const handleBulkMatch = useCallback(
    async (challengeMentorId: number, applicationIds: number[]) => {
      setOptimisticMentors((prev) => {
        const next = { ...prev };
        applicationIds.forEach((id) => {
          next[id] = challengeMentorId;
        });
        return next;
      });
      try {
        await handleMatch({ challengeMentorId, applicationIds });
        snackbar(`${applicationIds.length}명에게 멘토를 지정했습니다.`);
        await invalidateAll();
      } catch {
        setOptimisticMentors((prev) => {
          const next = { ...prev };
          applicationIds.forEach((id) => {
            delete next[id];
          });
          return next;
        });
        snackbar('일괄 지정에 실패했습니다.');
      }
    },
    [handleMatch, snackbar, invalidateAll],
  );

  const rows: MentorAssignmentRow[] = useMemo(
    () =>
      participants
        .filter(
          (p) =>
            applicationDetailsMap[p.applicationId]?.pricePlanType !==
            BASIC_PRICE_PLAN,
        )
        .map((p) => {
          const details = applicationDetailsMap[p.applicationId];
          return {
            id: p.applicationId,
            name: p.name ?? '-',
            email: p.email ?? '-',
            phoneNum: p.phoneNum ?? '-',
            major: details?.major ?? '-',
            wishJob: details?.wishJob ?? '-',
            wishCompany: details?.wishCompany ?? '-',
            pricePlanType: details?.pricePlanType ?? '-',
            matchedMentorId: effectiveMentors[p.applicationId] ?? null,
          };
        }),
    [participants, effectiveMentors, applicationDetailsMap],
  );

  return {
    rows,
    mentors,
    effectiveMentors,
    matchCounts,
    isLoading:
      isParticipantsLoading || isMentorLoading || isApplicationsLoading,
    isPending,
    handleSingleMatch,
    handleBulkMatch,
  };
};

export default useMentorAssignmentData;
