'use client';

import { useGetChallengeFaq } from '@/api/challenge/challenge';
import ChallengeFaq from '@/domain/program/challenge/challenge-view/ChallengeFaq';
import { parseChallengeContent } from '@/domain/program/challenge/utils/parseChallengeContent';
import { ChallengeIdPrimitive } from '@/schema';
import { useParams } from 'next/navigation';

interface Props {
  challenge: ChallengeIdPrimitive;
}

const HrFAQSection = ({ challenge }: Props) => {
  const { id } = useParams<{ id: string }>();
  const { data: faqData } = useGetChallengeFaq(id ?? '');

  const content = parseChallengeContent(challenge.desc);
  const faqList = faqData?.faqList ?? [];
  const faqCategory = content?.faqCategory ?? [];

  if (!faqList.length) {
    return null;
  }

  return (
    <div className="flex w-full flex-col items-center">
      <ChallengeFaq
        faqData={faqData}
        faqCategory={faqCategory}
        challengeType={challenge.challengeType}
        headerColorOverride="#606060"
      />
    </div>
  );
};

export default HrFAQSection;
