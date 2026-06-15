'use client';
import { useGetChallengeQuery } from '@/api/program';
import PricePlanBottomSheet from '@/domain/program/PricePlanBottomSheet';
import { ChallengeIdPrimitive } from '@/schema';
import { MEMBERSHIP_CHALLENGE_ID } from './constants';

export default function MembershipApplySheet({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { data: challenge } = useGetChallengeQuery({
    challengeId: MEMBERSHIP_CHALLENGE_ID,
    enabled: MEMBERSHIP_CHALLENGE_ID > 0,
  });

  if (!challenge) return null;

  return (
    <PricePlanBottomSheet
      challenge={challenge as unknown as ChallengeIdPrimitive}
      challengeId={String(MEMBERSHIP_CHALLENGE_ID)}
      isOpen={isOpen}
      onClose={onClose}
    />
  );
}
