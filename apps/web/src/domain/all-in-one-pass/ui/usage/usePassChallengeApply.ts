'use client';

// 패스 '참여 전' 챌린지 신청 바텀시트 컨트롤러 — 챌린지 탭·대시보드 캘린더 공용.
// BASIC(차액 0)은 payment-input 없이 즉시 0원 신청, 상위 플랜은 시트가 /payment-input 으로 이동.
import { useMypageApplicationsQueryKey } from '@/api/application';
import { applyChallengeVersion } from '@/domain/program/challenge/utils/challengeVersionRoute';
import { getChallengeIdPrimitiveSchema } from '@/schema';
import axios from '@/utils/axios';
import { useToast } from '@letscareer/ui';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';

export const usePassChallengeApply = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [sheetProgramId, setSheetProgramId] = useState<number | null>(null);
  const [completedTitle, setCompletedTitle] = useState<string | null>(null);

  // 상세는 Primitive 스키마로 직접 조회(useChallengeQuery 는 날짜를 dayjs 로 바꿔 타입 불일치).
  const { data: sheetChallenge } = useQuery({
    queryKey: ['challengePrimitiveForPass', sheetProgramId],
    enabled: sheetProgramId != null,
    queryFn: async () => {
      const res = await axios.get(`/challenge/${sheetProgramId}`);
      return getChallengeIdPrimitiveSchema.parse(res.data.data);
    },
  });

  // 버전 없으면 null, 있으면 sortOrder 첫 버전(상세 페이지 기본 버전 규칙과 동일)
  const sheetVersion = useMemo(() => {
    const list = sheetChallenge?.versionList ?? [];
    return list.length
      ? [...list].sort((a, b) => a.sortOrder - b.sortOrder)[0]
      : null;
  }, [sheetChallenge]);
  const appliedChallenge = sheetChallenge
    ? applyChallengeVersion(sheetChallenge, sheetVersion)
    : null;

  // BASIC(차액 0, VOD 미선택)일 때 payment-input 없이 즉시 0원 신청.
  const handleFreeApply = async (payload: {
    programId: number;
    priceId?: number;
    challengeVersionId: number | null;
    contactEmail: string;
    orderId: string;
    title: string;
  }) => {
    if (payload.priceId == null) {
      toast.error('플랜 정보를 불러오지 못했어요', {
        description: '잠시 후 다시 시도해주세요.',
      });
      return;
    }
    try {
      await axios.post(`/application/${payload.programId}?type=CHALLENGE`, {
        paymentInfo: {
          couponId: null,
          priceId: payload.priceId,
          paymentKey: null,
          orderId: payload.orderId,
          amount: '0',
        },
        contactEmail: payload.contactEmail,
        motivate: '',
        question: '',
        challengeVersionId: payload.challengeVersionId,
      });
      // 참여중(user/applications)·참여전(benefit/challenge) 둘 다 갱신해야
      // 방금 신청한 챌린지가 참여전에서 빠지고 참여중으로 넘어간다(중복 노출 방지).
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [useMypageApplicationsQueryKey],
        }),
        queryClient.invalidateQueries({
          queryKey: ['allInOnePass', 'benefitChallenge'],
        }),
      ]);
      setSheetProgramId(null);
      setCompletedTitle(payload.title);
    } catch {
      toast.error('신청 처리 중 오류가 발생했어요', {
        description: '잠시 후 다시 시도해주세요.',
      });
    }
  };

  return {
    sheetProgramId,
    appliedChallenge,
    sheetVersion,
    completedTitle,
    openSheet: useCallback(
      (programId: number) => setSheetProgramId(programId),
      [],
    ),
    closeSheet: useCallback(() => setSheetProgramId(null), []),
    clearCompleted: useCallback(() => setCompletedTitle(null), []),
    handleFreeApply,
  };
};

export type PassChallengeApplyController = ReturnType<
  typeof usePassChallengeApply
>;
