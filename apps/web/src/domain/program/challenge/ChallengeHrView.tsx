import ChallengeIntroEditorContent from '@/domain/program/challenge/challenge-view/ChallengeIntroEditorContent';
import ChallengeTabNavigation from '@/domain/program/challenge/challenge-view/ChallengeTabNavigation';
import { getChallengeThemeColor } from '@/domain/program/challenge/utils/getChallengeThemeColor';
import { parseChallengeContent } from '@/domain/program/challenge/utils/parseChallengeContent';
import { ChallengeIdPrimitive } from '@/schema';
import { ChallengeContent } from '@/types/interface';
import { useMemo } from 'react';
import ChallengeBasicInfoSection from './challenge-view/ChallengeBasicInfoSection';
import FreeTemplateLayout from './challenge-view/FreeTemplateLayout';
import {
  hrCheckListConfig,
  hrCurriculumPointsConfig,
  hrDifferentiatorsConfig,
  hrIntroConfig,
  hrIntroFeaturesConfig,
  hrOverviewConfig,
  hrReviewConfig,
} from './hr-view/hrConfig';
import HrCurriculumSection from './hr-view/HrCurriculumSection';
import HrCurriculumStepsSection from './hr-view/HrCurriculumStepsSection';
import HrFAQSection from './hr-view/HrFAQSection';
import HrFeedbackSection from './hr-view/HrFeedbackSection';
import HrRecruitmentInfoSection from './hr-view/HrRecruitmentInfoSection';
import CheckListSection from './template-view/CheckListSection';
import CurriculumPointsSection from './template-view/CurriculumPointsSection';
import DifferentiatorsSection from './template-view/DifferentiatorsSection';
import IntroFeaturesSection from './template-view/IntroFeaturesSection';
import IntroSection from './template-view/IntroSection';
import OverviewSection from './template-view/OverviewSection';
import ReviewSection from './template-view/ReviewSection';

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
      {content?.isFreeTemplate ? (
        <FreeTemplateLayout freeContent={content.freeContent} />
      ) : (
        <>
          <ChallengeTabNavigation themeColor={themeColor} />
          <ChallengeIntroEditorContent challenge={challenge} />
          <IntroSection config={hrIntroConfig} />
          <IntroFeaturesSection
            config={hrIntroFeaturesConfig}
            content={content}
          />
          <CheckListSection config={hrCheckListConfig} />
          <CurriculumPointsSection
            config={hrCurriculumPointsConfig}
            content={content}
          />
          <HrCurriculumStepsSection content={content} />
          <HrCurriculumSection challenge={challenge} content={content} />
          <OverviewSection config={hrOverviewConfig} content={content} />
          <DifferentiatorsSection config={hrDifferentiatorsConfig} />
          <HrFeedbackSection />
          <HrRecruitmentInfoSection challenge={challenge} />
          <ReviewSection config={hrReviewConfig} content={content} />
          <HrFAQSection challenge={challenge} content={content} />
        </>
      )}
    </div>
  );
};

export default ChallengeHrView;
