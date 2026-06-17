import { useGetChallengeFaq } from '@/api/challenge/challenge';
import ChallengeFaq from '@/domain/program/challenge/challenge-view/ChallengeFaq';
import { ChallengeIdPrimitive } from '@/schema';
import { useParams } from 'react-router-dom';

interface Props {
  challenge: ChallengeIdPrimitive;
}

const HrFAQSection = ({ challenge }: Props) => {
  const { id } = useParams<{ id: string }>();
  const { data: faqData } = useGetChallengeFaq(id ?? '');

  return (
    <div className="flex w-full flex-col items-center">
      <ChallengeFaq
        faqData={faqData ?? { faqList: [] }}
        challengeType={challenge.challengeType}
        headerColorOverride="#606060"
      />
    </div>
  );
};

export default HrFAQSection;
