'use client';

import {
  ChallengeApplicationsQueryKey,
  isLegacyChallenge,
  useChallengeApplicationsQuery,
  useChallengeMissionFeedbackListQuery,
} from '@/api/challenge/challenge';
import { useAdminChallengeMentorListQuery } from '@/api/mentor/mentor';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import { PaybackParticipantsQueryKey } from './usePaybackParticipants';
import usePaybackParticipants from './usePaybackParticipants';
import useMentorMatchHandler from './useMentorMatchHandler';
import { useLegacyMentorAssignmentMap } from './useLegacyMentorAssignmentMap';
import type { MentorAssignmentRow } from '../types';

// 멘토 배정 대상이 아닌 결제 플랜 (멘토링 미포함 옵션).
// 단, 230 미만(legacy) 챌린지는 결제 플랜 체계 자체가 달라 BASIC 사용자도
// 실제로는 멘토를 받았다(BE 확인: ch200 = BASIC + 멘토). 이 경우 필터를 그대로
// 적용하면 모든 행이 사라지므로 isLegacyChallenge 분기로 우회한다.
const EXCLUDED_PRICE_PLANS = ['BASIC', 'LIGHT'];

const useMentorAssignmentData = (programId: string) => {
  const isLegacy = isLegacyChallenge(programId || Number.MAX_SAFE_INTEGER);
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
  const { data: legacyMissionsData } = useChallengeMissionFeedbackListQuery(
    Number(programId),
    { enabled: isLegacy && !!programId },
  );
  const legacyMentorMap = useLegacyMentorAssignmentMap({
    challengeId: programId,
    enabled: isLegacy,
    missionsData: legacyMissionsData,
    applicationsData,
  });
  const { handleMatch, isPending } = useMentorMatchHandler(programId);

  const participants = useMemo(
    () => participantsData?.missionApplications ?? [],
    [participantsData],
  );
  const mentors = useMemo(() => mentorData?.mentorList ?? [], [mentorData]);

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

  // legacy 멘토 정보(attendance 역산) → application 매핑은 serverMentorMap 보다
  // 우선하지 않는다. legacy 챌린지는 serverMentorMap 이 비어 있으므로 충돌이 없고,
  // 만에 하나 BE 가 향후 application.challengeMentorId 를 backfill 하면 그 값을 신뢰.
  const effectiveMentors = useMemo(
    () => ({ ...legacyMentorMap, ...serverMentorMap, ...optimisticMentors }),
    [legacyMentorMap, serverMentorMap, optimisticMentors],
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
            isLegacy ||
            !EXCLUDED_PRICE_PLANS.includes(
              applicationDetailsMap[p.applicationId]?.pricePlanType ?? '',
            ),
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
    [participants, effectiveMentors, applicationDetailsMap, isLegacy],
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
