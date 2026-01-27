import ChallengeIntroEditorContent from '@/domain/program/challenge/challenge-view/ChallengeIntroEditorContent';
import ChallengeTabNavigation from '@/domain/program/challenge/challenge-view/ChallengeTabNavigation';
import { getChallengeThemeColor } from '@/domain/program/challenge/utils/getChallengeThemeColor';
import { ChallengeIdPrimitive } from '@/schema';
import ChallengeBasicInfoSection from './challenge-view/ChallengeBasicInfoSection';
import HrCheckListSection from './hr-view/HrCheckListSection';
import HrCurriculumPointsSection from './hr-view/HrCurriculumPointsSection';
import HrCurriculumSection from './hr-view/HrCurriculumSection';
import HrCurriculumStepsSection from './hr-view/HrCurriculumStepsSection';
import HrDifferentiatorsSection from './hr-view/HrDifferentiatorsSection';
import HrIntroFeaturesSection from './hr-view/HrIntroFeaturesSection';
import HrIntroSection from './hr-view/HrIntroSection';
import HrOverviewSection from './hr-view/HrOverviewSection';
import HrRecruitmentInfoSection from './hr-view/HrRecruitmentInfoSection';
import HrReviewSection from './hr-view/HrReviewSection';
interface Props {
  challenge: ChallengeIdPrimitive;
}

const ChallengeHrView = ({ challenge }: Props) => {
  const themeColor = getChallengeThemeColor(challenge.challengeType);

  return (
    <div className="w-full">
      <ChallengeBasicInfoSection challenge={challenge} />
      <ChallengeTabNavigation themeColor={themeColor} />
      <ChallengeIntroEditorContent challenge={challenge} />
      <HrIntroSection />
      <HrIntroFeaturesSection />
      <HrCheckListSection />
      <HrCurriculumPointsSection challenge={challenge} />
      <HrCurriculumStepsSection />
      <HrCurriculumSection challenge={challenge} />
      <HrOverviewSection />
      <HrDifferentiatorsSection />
      <HrRecruitmentInfoSection challenge={challenge} />
      <HrReviewSection challenge={challenge} />
    </div>
  );
};

export default ChallengeHrView;
