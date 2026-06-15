'use client';
import { useGetChallengeQuery } from '@/api/program';
import ChallengeCTAButtons from '@/domain/program/challenge/ChallengeCTAButtons';
import { ChallengeIdPrimitive } from '@/schema';
import { MEMBERSHIP_CHALLENGE_ID } from './constants';

export default function MembershipCTAButtons() {
  const { data: challenge } = useGetChallengeQuery({
    challengeId: MEMBERSHIP_CHALLENGE_ID,
    enabled: MEMBERSHIP_CHALLENGE_ID > 0,
  });

  if (!challenge) return null;

  return (
    <ChallengeCTAButtons
      challenge={challenge as unknown as ChallengeIdPrimitive}
      challengeId={String(MEMBERSHIP_CHALLENGE_ID)}
    />
  );
}
