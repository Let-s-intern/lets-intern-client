import ChallengeRecruitmentInfoSection from '@/domain/program/challenge/challenge-view/ChallengeRecruitmentInfoSection';
import ChallengeTabNavigation from '@/domain/program/challenge/challenge-view/ChallengeTabNavigation';
import { ChallengeIdPrimitive } from '@/schema';
import ChallengeBasicInfoSection from './challenge-view/ChallengeBasicInfoSection';

interface Props {
  challenge: ChallengeIdPrimitive;
}

const ChallengeHrView = ({ challenge }: Props) => {
  return (
    <div className="w-full">
      <ChallengeBasicInfoSection challenge={challenge} />
      <ChallengeTabNavigation />
      <ChallengeRecruitmentInfoSection challenge={challenge} />
    </div>
  );
};

export default ChallengeHrView;
