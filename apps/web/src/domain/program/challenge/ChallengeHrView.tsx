import ChallengeIntroEditorContent from '@/domain/program/challenge/challenge-view/ChallengeIntroEditorContent';
import ChallengeTabNavigation from '@/domain/program/challenge/challenge-view/ChallengeTabNavigation';
import { parseChallengeContent } from '@/domain/program/challenge/utils/parseChallengeContent';
import { ChallengeIdPrimitive } from '@/schema';
import { ChallengeContent } from '@/types/interface';
import { useMemo } from 'react';
import ChallengeBasicInfoSection from './challenge-view/ChallengeBasicInfoSection';
import FreeTemplateLayout from './challenge-view/FreeTemplateLayout';
import {
  hrCheckListConfig,
  hrCurriculumPointsConfig,
  hrCurriculumSectionConfig,
  hrDifferentiatorsConfig,
  hrIntroConfig,
  hrIntroFeaturesConfig,
  hrOverviewConfig,
  hrReviewConfig,
} from './hr-view/hrConfig';
import HrCurriculumStepsSection from './hr-view/HrCurriculumStepsSection';
import HrFeedbackSection from './hr-view/HrFeedbackSection';
import CheckListSection from './template-view/CheckListSection';
import CurriculumPointsSection from './template-view/CurriculumPointsSection';
import CurriculumSection from './template-view/CurriculumSection';
import DifferentiatorsSection from './template-view/DifferentiatorsSection';
import FAQSection from './template-view/FAQSection';
import IntroFeaturesSection from './template-view/IntroFeaturesSection';
import IntroSection from './template-view/IntroSection';
import OverviewSection from './template-view/OverviewSection';
import RecruitmentInfoSection from './template-view/RecruitmentInfoSection';
import ReviewSection from './template-view/ReviewSection';

interface Props {
  challenge: ChallengeIdPrimitive;
}

const ChallengeHrView = ({ challenge }: Props) => {
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
          <ChallengeTabNavigation challengeType={challenge.challengeType} />
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
          <CurriculumSection
            challenge={challenge}
            content={content}
            config={hrCurriculumSectionConfig}
          />
          <OverviewSection config={hrOverviewConfig} content={content} />
          <DifferentiatorsSection config={hrDifferentiatorsConfig} />
          <HrFeedbackSection />
          <RecruitmentInfoSection challenge={challenge} />
          <ReviewSection
            config={hrReviewConfig}
            content={content}
            challengeType={challenge.challengeType}
          />
          <FAQSection challenge={challenge} />
        </>
      )}
    </div>
  );
};

export default ChallengeHrView;
