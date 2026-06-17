import ChallengeIntroEditorContent from '@/domain/program/challenge/challenge-view/ChallengeIntroEditorContent';
import ChallengeTabNavigation from '@/domain/program/challenge/challenge-view/ChallengeTabNavigation';
import { parseChallengeContent } from '@/domain/program/challenge/utils/parseChallengeContent';
import { ChallengeIdPrimitive } from '@/schema';
import { ChallengeContent } from '@/types/interface';
import { useMemo } from 'react';
import ChallengeBasicInfoSection from './challenge-view/ChallengeBasicInfoSection';
import FreeTemplateLayout from './challenge-view/FreeTemplateLayout';
import {
  pmCheckListConfig,
  pmCurriculumPointsConfig,
  pmCurriculumSectionConfig,
  pmDifferentiatorsConfig,
  pmIntroConfig,
  pmIntroFeaturesConfig,
  pmOverviewConfig,
  pmReviewConfig,
} from './pm-view/pmConfig';
import PmCurriculumStepsSection from './pm-view/PmCurriculumStepsSection';
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

const ChallengePmView = ({ challenge }: Props) => {
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
          <IntroSection config={pmIntroConfig} />
          <IntroFeaturesSection
            config={pmIntroFeaturesConfig}
            content={content}
          />
          <CheckListSection config={pmCheckListConfig} />
          <CurriculumPointsSection
            config={pmCurriculumPointsConfig}
            content={content}
          />
          <PmCurriculumStepsSection content={content} />
          <CurriculumSection
            challenge={challenge}
            content={content}
            config={pmCurriculumSectionConfig}
          />
          <OverviewSection config={pmOverviewConfig} content={content} />
          <DifferentiatorsSection config={pmDifferentiatorsConfig} />
          <RecruitmentInfoSection challenge={challenge} />
          <ReviewSection
            config={pmReviewConfig}
            content={content}
            challengeType={challenge.challengeType}
          />
          <FAQSection challenge={challenge} />
        </>
      )}
    </div>
  );
};

export default ChallengePmView;
