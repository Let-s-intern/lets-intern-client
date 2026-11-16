'use client';

import { useProgramApplicationQuery } from '@/api/application';
import dayjs from '@/lib/dayjs';
import { ChallengeIdPrimitive } from '@/schema';
import useAuthStore from '@/store/useAuthStore';
import { useEffect, useState } from 'react';
import NotiToast from './NotiToast';
import {
  DesktopApplyCTA,
  MobileApplyCTA,
} from '../../../common/button/ApplyCTA';
import NotiModal from '@/domain/program/program-detail/button/NotiModal';
import PricePlanBottomSheet from '../PricePlanBottomSheet';
import { useOpenChallengeApply } from './hooks/useOpenChallengeApply';
import { useChallengeApplySheetStore } from './store/useChallengeApplySheetStore';

const ChallengeCTAButtons = ({
  challenge,
  challengeId,
  challengeVersionId,
}: {
  challenge: ChallengeIdPrimitive;
  challengeId: string;
  challengeVersionId: number | null;
}) => {
  const { isLoggedIn } = useAuthStore();
  const { isOpen, plan, close } = useChallengeApplySheetStore();
  const openApply = useOpenChallengeApply();

  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const { data: application, refetch } = useProgramApplicationQuery(
    'challenge',
    Number(challengeId),
  );

  // 로그인 상태 변경 시 application 데이터 refetch
  useEffect(() => {
    if (isLoggedIn) {
      refetch();
    }
  }, [isLoggedIn, refetch]);

  // 다른 챌린지로 이동하면 시트 상태를 비운다
  useEffect(
    () => () =>
      useChallengeApplySheetStore.setState({ isOpen: false, plan: null }),
    [],
  );

  /** 이미 신청했는지 체크하는 정보 */
  const isAlreadyApplied = application?.applied ?? false;

  const handleOpen = () => openApply();

  return (
    <>
      {!isOpen && (
        <>
          <DesktopApplyCTA
            program={{
              ...challenge,
              beginning: challenge.beginning
                ? dayjs(challenge.beginning)
                : null,
              deadline: challenge.deadline ? dayjs(challenge.deadline) : null,
            }}
            onApplyClick={handleOpen}
            onNotiClick={() => setIsNotiOpen(true)}
            isAlreadyApplied={isAlreadyApplied}
          />
          <MobileApplyCTA
            program={{
              ...challenge,
              beginning: challenge.beginning
                ? dayjs(challenge.beginning)
                : null,
              deadline: challenge.deadline ? dayjs(challenge.deadline) : null,
            }}
            onApplyClick={handleOpen}
            onNotiClick={() => setIsNotiOpen(true)}
            isAlreadyApplied={isAlreadyApplied}
          />
        </>
      )}
      {/* 출시 알림 신청 모달 */}
      <NotiModal
        isOpen={isNotiOpen}
        onClose={() => setIsNotiOpen(false)}
        onSuccess={() => setShowToast(true)}
        programTypeList={['CHALLENGE']}
        challengeTypeList={
          challenge.challengeType ? [challenge.challengeType] : undefined
        }
      />
      <NotiToast isVisible={showToast} onClose={() => setShowToast(false)} />
      {/* 가격 플랜 선택 바텀 시트 */}
      <PricePlanBottomSheet
        // 상단에서 고른 플랜으로 시트를 다시 초기화한다
        key={plan ?? 'default'}
        initialPlan={plan}
        isOpen={isOpen}
        challenge={challenge}
        challengeId={challengeId}
        challengeVersionId={challengeVersionId}
        onClose={close}
        showMembershipBenefit
      />
    </>
  );
};

export default ChallengeCTAButtons;
