import ChallengeRecruitmentInfoSection from '@/domain/program/challenge/challenge-view/ChallengeRecruitmentInfoSection';
import ChallengeTabNavigation from '@/domain/program/challenge/challenge-view/ChallengeTabNavigation';
import { getChallengeThemeColor } from '@/domain/program/challenge/utils/getChallengeThemeColor';
import { ChallengeIdPrimitive } from '@/schema';
import ChallengeBasicInfoSection from './challenge-view/ChallengeBasicInfoSection';

interface Props {
  challenge: ChallengeIdPrimitive;
}

const ChallengeHrView = ({ challenge }: Props) => {
  const themeColor = getChallengeThemeColor(challenge.challengeType);

  return (
    <div className="w-full">
      <ChallengeBasicInfoSection challenge={challenge} />
      <ChallengeTabNavigation themeColor={themeColor} />
      <ChallengeRecruitmentInfoSection
        challenge={challenge}
        themeColor={themeColor}
      />
    </div>
  );
};

export default ChallengeHrView;
