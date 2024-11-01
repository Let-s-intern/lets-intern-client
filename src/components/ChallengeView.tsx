import { useEffect, useMemo } from 'react';

import { ChallengeIdSchema, challengeTypeSchema } from '@/schema';
import { ChallengeContent } from '@/types/interface';
import ChallengeCheckList from '@components/challenge-view/ChallengeCheckList';
import ChallengeCurriculum from '@components/challenge-view/ChallengeCurriculum';
import ChallengeFaq from '@components/challenge-view/ChallengeFaq';
import ChallengeIntro from '@components/challenge-view/ChallengeIntro';
import ChallengeResult from '@components/challenge-view/ChallengeResult';
import Header from '@components/common/program/program-detail/header/Header';
import dayjs from 'dayjs';
import ChallengeBasicInfo from './challenge-view/ChallengeBasicInfo';
import ChallengeNavigation, {
  challengeNavigateItems,
} from './challenge-view/ChallengeNavigation';
import ChallengePointView from './challenge-view/ChallengePointView';
import LexicalContent from './common/blog/LexicalContent';
import SuperTitle from './common/program/program-detail/SuperTitle';
import ProgramDetailBlogReviewSection from './ProgramDetailBlogReviewSection';

export type ChallengeColors = {
  primary: string;
  primaryLight: string;
  secondary: string;
};

const ChallengeView: React.FC<{ challenge: ChallengeIdSchema }> = ({
  challenge,
}) => {
  const receivedContent = useMemo<ChallengeContent>(() => {
    if (!challenge?.desc) {
      return { initialized: false };
    }
    try {
      return JSON.parse(challenge.desc);
    } catch (e) {
      console.error(e);
      return { initialized: false };
    }
  }, [challenge.desc]);

  const colors = useMemo(() => {
    let primary = '';
    let primaryLight = '';
    let secondary = '';

    switch (challenge.challengeType) {
      case challengeTypeSchema.enum.PERSONAL_STATEMENT:
        primary = '#14BCFF';
        secondary = '#FF9C34';
        primaryLight = '#EEFAFF';
        break;
      case challengeTypeSchema.enum.PORTFOLIO:
        primary = '#4A76FF';
        secondary = '#F8AE00';
        primaryLight = '#F0F4FF';
        break;
      default:
        primary = '#4D55F5';
        secondary = '#E45BFF';
        primaryLight = '#F3F4FF';
    }
    return { primary, primaryLight, secondary };
  }, [challenge.challengeType]);

  // TODO: 운영 배포 시 제거
  useEffect(() => {
    console.log('receivedContent', receivedContent);
  }, [receivedContent]);

  return (
    <div className="flex w-full flex-col">
      <div>
        <div className="flex w-full flex-col px-5 md:px-10 xl:px-52">
          <Header programTitle={challenge.title ?? ''} />
          <ChallengeBasicInfo challenge={challenge} />
        </div>

        <ChallengeNavigation navItems={challengeNavigateItems} />
        <div className="flex w-full flex-col overflow-x-hidden px-5 lg:px-10 xl:px-52">
          <section className="py-16 lg:py-48">
            <SuperTitle className="mb-6 text-neutral-45 lg:mb-10">
              프로그램 소개
            </SuperTitle>
            <ChallengePointView
              colors={colors}
              point={receivedContent.challengePoint}
              challengeTitle={challenge.title ?? ''}
              startDate={challenge.startDate ?? dayjs()}
              endDate={challenge.endDate ?? dayjs()}
            />
          </section>

          {/* 특별 챌린지, 합격자 후기 */}
          {receivedContent.mainDescription?.root && (
            <LexicalContent node={receivedContent.mainDescription?.root} />
          )}

          <section className="lg:py-50 lg:gap-50 flex flex-col gap-20 py-16">
            <ChallengeIntro />
            <ChallengeCheckList />
            <ChallengeResult />
          </section>

          {receivedContent.curriculum ? (
            <ChallengeCurriculum curriculum={receivedContent.curriculum} />
          ) : null}

          {receivedContent.blogReview ? (
            <ProgramDetailBlogReviewSection
              review={receivedContent.blogReview}
              programType="challenge"
            />
          ) : null}

          <div>
            <ChallengeFaq />
          </div>

          <div>
            이 모든 고민을 한번에 해결! 서류 합격률을 300% 높일 수 있는
            렛츠커리어 챌린지
          </div>
          <div>차별점</div>
          <div>여기서 끝이 아니죠 챌린지 참여자만을 위한 트리플 혜택!</div>
          <div>누적 참여자 1,900+명 참여 만족도 4.9점</div>

          <div>모집 개요</div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeView;
