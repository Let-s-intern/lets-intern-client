// 나의 패스 이용 > 챌린지 탭 (참여 전 / 참여 중 / 참여 완료).
'use client';

import { useMypageApplicationsQueryKey } from '@/api/application';
import AlertModal from '@/common/alert/AlertModal';
import LoadingContainer from '@/common/loading/LoadingContainer';
import { getChallengeIdPrimitiveSchema } from '@/schema';
import axios from '@/utils/axios';
import { useToast } from '@letscareer/ui';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import PricePlanBottomSheet from '@/domain/program/PricePlanBottomSheet';
import { applyChallengeVersion } from '@/domain/program/challenge/utils/challengeVersionRoute';
import type { PassProgramCardData } from './PassProgramCard';
import UsageSection from './UsageSection';
import { useUsageChallenge } from './useUsageChallenge';

const UsageChallengeTab = () => {
  const router = useRouter();
  const toast = useToast();
  const params = useParams<{ applicationId: string }>();
  const applicationId = Number(params.applicationId);
  const queryClient = useQueryClient();
  const { before, inProgress, done, isLoading, isError } =
    useUsageChallenge(applicationId);

  // 참여 전 카드 → 챌린지 상세 바텀시트(패스회원가). 상세는 Primitive 스키마로 직접 조회
  // (useChallengeQuery 는 날짜를 dayjs 로 바꿔 ChallengeIdPrimitive 와 타입이 다르다).
  const [sheetProgramId, setSheetProgramId] = useState<number | null>(null);
  const [completedTitle, setCompletedTitle] = useState<string | null>(null);

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

  const handleCardClick = (item: PassProgramCardData) => {
    if (item.participation === 'BEFORE' || item.applicationId == null) {
      // 모집 예정(아직 신청 불가)은 상세 랜딩으로, 모집 중만 플랜 바텀시트로 신청.
      if (item.programStatusType === 'PREV') {
        router.push(`/program/challenge/${item.programId}`);
        return;
      }
      setSheetProgramId(item.programId);
      return;
    }
    // 참여 중/완료 → 시작한 챌린지만 대시보드 입장, 시작 전이면 안내.
    if (item.canEnterDashboard) {
      router.push(`/challenge/${item.applicationId}/${item.programId}`);
    } else {
      toast.toast({
        variant: 'default',
        title: '아직 시작 전인 챌린지예요',
        description: '시작일 이후 대시보드에 입장할 수 있어요.',
      });
    }
  };

  // BASIC(차액 0, VOD 미선택)일 때 payment-input 없이 탭 내 즉시 0원 신청.
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

  if (isLoading) {
    return <LoadingContainer className="py-20" />;
  }
  if (isError) {
    return (
      <p className="text-xsmall14 text-neutral-40 py-20 text-center">
        목록을 불러오지 못했어요. 잠시 후 다시 시도해주세요.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <UsageSection
        title="참여 가능"
        items={before}
        emptyText="현재 참여 가능한 챌린지가 없습니다."
        onCardClick={handleCardClick}
      />
      <UsageSection
        title="참여 중"
        items={inProgress}
        emptyText="참여 중인 챌린지가 없습니다."
        onCardClick={handleCardClick}
      />
      <UsageSection
        title="참여 완료"
        items={done}
        emptyText="참여 완료한 챌린지가 없습니다."
        onCardClick={handleCardClick}
      />

      {appliedChallenge && sheetProgramId != null && (
        <PricePlanBottomSheet
          challenge={appliedChallenge}
          challengeId={String(sheetProgramId)}
          challengeVersionId={sheetVersion?.challengeVersionId ?? null}
          isOpen
          onClose={() => setSheetProgramId(null)}
          showMembershipBenefit
          onFreeApply={handleFreeApply}
        />
      )}

      {completedTitle && (
        <AlertModal
          title="신청 완료"
          confirmText="확인"
          showCancel={false}
          onConfirm={() => setCompletedTitle(null)}
        >
          <p className="text-neutral-30">
            [{completedTitle}] 신청이 완료되었어요. &apos;참여 중&apos;에서
            확인할 수 있어요.
          </p>
        </AlertModal>
      )}
    </div>
  );
};

export default UsageChallengeTab;
