import ChallengeIntroEditorContent from '@/domain/program/challenge/challenge-view/ChallengeIntroEditorContent';
import ChallengeTabNavigation from '@/domain/program/challenge/challenge-view/ChallengeTabNavigation';
import { parseChallengeContent } from '@/domain/program/challenge/utils/parseChallengeContent';
import { getChallengeThemeColor } from '@/domain/program/challenge/utils/getChallengeThemeColor';
import { ChallengeIdPrimitive } from '@/schema';
import { ChallengeContent } from '@/types/interface';
import { useMemo } from 'react';
import ChallengeBasicInfoSection from './challenge-view/ChallengeBasicInfoSection';
import HrCheckListSection from './hr-view/HrCheckListSection';
import HrCurriculumPointsSection from './hr-view/HrCurriculumPointsSection';
import HrCurriculumSection from './hr-view/HrCurriculumSection';
import HrCurriculumStepsSection from './hr-view/HrCurriculumStepsSection';
import HrDifferentiatorsSection from './hr-view/HrDifferentiatorsSection';
import HrFAQSection from './hr-view/HrFAQSection';
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
  const content = useMemo<ChallengeContent | null>(
    () => parseChallengeContent(challenge.desc),
    [challenge.desc],
  );

  return (
    <div className="w-full">
      <ChallengeBasicInfoSection challenge={challenge} />
      <ChallengeTabNavigation themeColor={themeColor} />
      <ChallengeIntroEditorContent challenge={challenge} />
      <HrIntroSection />
      <HrIntroFeaturesSection />
      <HrCheckListSection />
      <HrCurriculumPointsSection content={content} />
      <HrCurriculumStepsSection content={content} />
      <HrCurriculumSection challenge={challenge} content={content} />
      <HrOverviewSection content={content} />
      <HrDifferentiatorsSection />
      <HrRecruitmentInfoSection challenge={challenge} />
      <HrReviewSection content={content} />
      <HrFAQSection challenge={challenge} content={content} />
    </div>
  );
};

export default ChallengeHrView;
