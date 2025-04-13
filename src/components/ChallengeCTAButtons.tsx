'use client';

import { useProgramApplicationQuery } from '@/api/application';
import dayjs from '@/lib/dayjs';
import { ChallengeIdPrimitive } from '@/schema';
import useAuthStore from '@/store/useAuthStore';
import { useState } from 'react';
import { DesktopApplyCTA, MobileApplyCTA } from './common/ApplyCTA';
import PricePlanBottomSheet from './common/program/PricePlanBottomSheet';

const ChallengeCTAButtons = ({
  challenge,
  challengeId,
}: {
  challenge: ChallengeIdPrimitive;
  challengeId: string;
}) => {
  const { isLoggedIn } = useAuthStore();

  const [isOpen, setIsOpen] = useState(false);

  const { data: application } = useProgramApplicationQuery(
    'challenge',
    Number(challengeId),
  );

  /** 이미 신청했는지 체크하는 정보 */
  const isAlreadyApplied = application?.applied ?? false;

  const handleOpen = () => {
    if (!isLoggedIn) {
      window.location.href = `/login?redirect=${encodeURIComponent(`/program/challenge/${challengeId}`)}`;
      return;
    }

    if (!isOpen) {
      setIsOpen(true);
      return;
    }
  };

  // 가격 플랜 선택 바텀 시트
  if (isOpen) {
    return (
      <PricePlanBottomSheet
        challenge={challenge}
        challengeId={challengeId}
        onClose={() => setIsOpen(false)}
      />
    );
  }

  return (
    <>
      <DesktopApplyCTA
        program={{
          ...challenge,
          beginning: challenge.beginning ? dayjs(challenge.beginning) : null,
          deadline: challenge.deadline ? dayjs(challenge.deadline) : null,
        }}
        onApplyClick={handleOpen}
        isAlreadyApplied={isAlreadyApplied}
      />

      <MobileApplyCTA
        program={{
          ...challenge,
          beginning: challenge.beginning ? dayjs(challenge.beginning) : null,
          deadline: challenge.deadline ? dayjs(challenge.deadline) : null,
        }}
        onApplyClick={handleOpen}
        isAlreadyApplied={isAlreadyApplied}
      />
    </>
  );
};

export default ChallengeCTAButtons;
