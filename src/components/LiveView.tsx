'use client';

import { useMemo } from 'react';

import { useGetLiveFaq } from '@/api/program';
import dayjs from '@/lib/dayjs';
import { twMerge } from '@/lib/twMerge';
import { LiveIdPrimitive, LiveIdSchema } from '@/schema';
import { LiveContent } from '@/types/interface';
import { useParams } from 'next/navigation';
import LexicalContent from './common/blog/LexicalContent';
import MoreReviewButton from './common/review/MoreReviewButton';
import NextBackHeader from './common/ui/NextBackHeader';
import LiveBasicInfo from './live-view/LiveBasicInfo';
import LiveCurriculum from './live-view/LiveCurriculum';
import LiveFaq from './live-view/LiveFaq';
import LiveInfoBottom from './live-view/LiveInfoBottom';
import LiveInformation from './live-view/LiveInformation';
import LiveIntro from './live-view/LiveIntro';
import LiveMentor from './live-view/LiveMentor';
import LiveVod from './live-view/LiveVod';
import ProgramBestReviewSection from './ProgramBestReviewSection';
import ProgramDetailBlogReviewSection from './ProgramDetailBlogReviewSection';
import ProgramDetailNavigation, {
  LIVE_CURRICULUM_ID,
  LIVE_MENTOR_INTRO_ID,
  LIVE_PROGRAM_INTRO_ID,
  LIVE_REVIEW_ID,
} from './ProgramDetailNavigation';

const LiveView: React.FC<{ live: LiveIdPrimitive; isPreview?: boolean }> = ({
  live,
  isPreview,
}) => {
  const { id } = useParams<{ id: string }>();

  const mentor = {
    mentorName: live.mentorName,
    mentorImg: live.mentorImg,
    mentorCompany: live.mentorCompany,
    mentorJob: live.mentorJob,
    mentorCareer: live.mentorCareer,
    mentorIntroduction: live.mentorIntroduction,
  };

  const receivedContent = useMemo<LiveContent>(
    () => JSON.parse(live.desc ?? '{}') as LiveContent,
    [live.desc],
  );

  const { data: faqData, isLoading: faqIsLoading } = useGetLiveFaq(id ?? '');

  const liveTransformed = useMemo<LiveIdSchema>(() => {
    return {
      ...live,
      startDate: live.startDate ? dayjs(live.startDate) : null,
      endDate: live.endDate ? dayjs(live.endDate) : null,
      beginning: live.beginning ? dayjs(live.beginning) : null,
      deadline: live.deadline ? dayjs(live.deadline) : null,
      priceInfo: {
        ...live.priceInfo,
        deadline: live.priceInfo.deadline
          ? dayjs(live.priceInfo.deadline)
          : null,
      },
    };
  }, [live]);

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col items-center w-full">
        <div className="flex w-full max-w-[1000px] flex-col px-5 md:px-10 lg:px-0">
          <NextBackHeader to="/program">{live.title ?? ''}</NextBackHeader>
          {live.vod && <LiveVod />}
          <LiveBasicInfo live={liveTransformed} />
        </div>

        <ProgramDetailNavigation
          programType="live"
          className={twMerge(isPreview && 'top-0 md:top-0 lg:top-0')}
          isReady={!faqIsLoading}
        />

        <div className="flex flex-col items-center w-full overflow-x-hidden">
          <LiveMentor
            id={LIVE_MENTOR_INTRO_ID}
            mentor={mentor}
            curriculumTitle={receivedContent.curriculumTitle}
            className="live_mentor"
          />
          <LiveInformation
            id={LIVE_PROGRAM_INTRO_ID}
            className="live_class"
            recommendFields={receivedContent.recommend}
            reasonFields={receivedContent.reason}
            editorContent={receivedContent.mainDescription}
          />

          <section
            id={LIVE_CURRICULUM_ID}
            className="live_curriculum flex w-full max-w-[1000px] flex-col px-5 pb-[70px] md:px-10 md:pb-[140px]"
          >
            <LiveCurriculum
              curriculum={receivedContent.curriculum}
              curriculumTitle={receivedContent.curriculumTitle}
            />

            {receivedContent.additionalCurriculum && (
              <LexicalContent
                node={receivedContent.additionalCurriculum.root}
              />
            )}
          </section>

          <LiveIntro />

          <section
            id={LIVE_REVIEW_ID}
            className="live_review flex w-full flex-col items-center gap-y-[70px] md:gap-y-40"
          >
            <div className="flex w-full flex-col items-center bg-neutral-95 py-[70px] md:pb-[130px] md:pt-[110px]">
              <ProgramBestReviewSection
                reviews={receivedContent.liveReview}
                type="live"
              />
              <MoreReviewButton
                type={'LIVE'}
                mainColor={'#4D55F5'}
                subColor={'#E45BFF'}
              />
            </div>
            {receivedContent.blogReview && (
              <ProgramDetailBlogReviewSection
                review={receivedContent.blogReview}
                programType="live"
              />
            )}
          </section>
          <LiveFaq faqData={faqData} />
          <LiveInfoBottom live={liveTransformed} />
        </div>
      </div>
    </div>
  );
};

export default LiveView;
