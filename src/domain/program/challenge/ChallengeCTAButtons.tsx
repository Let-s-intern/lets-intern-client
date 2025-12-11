'use client';

import { useProgramApplicationQuery } from '@/api/application';
import dayjs from '@/lib/dayjs';
import { ChallengeIdPrimitive } from '@/schema';
import useAuthStore from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  DesktopApplyCTA,
  MobileApplyCTA,
} from '../../../components/common/ApplyCTA';
import PricePlanBottomSheet from '../../../components/common/program/PricePlanBottomSheet';

const ChallengeCTAButtons = ({
  challenge,
  challengeId,
}: {
  challenge: ChallengeIdPrimitive;
  challengeId: string;
}) => {
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const { data: application } = useProgramApplicationQuery(
    'challenge',
    Number(challengeId),
  );

  /** 이미 신청했는지 체크하는 정보 */
  const isAlreadyApplied = application?.applied ?? false;

  const handleOpen = () => {
    if (!isLoggedIn) {
      router.push(
        `/login?redirect=${encodeURIComponent(`/program/challenge/${challengeId}`)}`,
      );

      return;
    }

    if (!isOpen) {
      setIsOpen(true);
      return;
    }
  };

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
            isAlreadyApplied={isAlreadyApplied}
          />
        </>
      )}
      {/* 가격 플랜 선택 바텀 시트 */}
      <PricePlanBottomSheet
        isOpen={isOpen}
        challenge={challenge}
        challengeId={challengeId}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export default ChallengeCTAButtons;
