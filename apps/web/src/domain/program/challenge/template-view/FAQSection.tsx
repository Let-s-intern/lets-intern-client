'use client';

import { useGetChallengeFaq } from '@/api/challenge/challenge';
import ChallengeFaq from '@/domain/program/challenge/challenge-view/ChallengeFaq';
import { ChallengeIdPrimitive } from '@/schema';
import { ChallengeContent } from '@/types/interface';
import { useParams } from 'next/navigation';

interface Props {
  challenge: ChallengeIdPrimitive;
  content: ChallengeContent | null;
}

const FAQSection = ({ challenge, content }: Props) => {
  const { id } = useParams<{ id: string }>();
  const { data: faqData } = useGetChallengeFaq(id ?? '');

  const faqCategory = (content?.faqCategory ?? []).filter(
    (c): c is string => typeof c === 'string' && c.trim() !== '',
  );
  const safeFaqData = faqData ?? { faqList: [] };

  return (
    <div className="flex w-full flex-col items-center">
      <ChallengeFaq
        faqData={safeFaqData}
        faqCategory={faqCategory}
        challengeType={challenge.challengeType}
        headerColorOverride="#606060"
      />
    </div>
  );
};

export default FAQSection;
