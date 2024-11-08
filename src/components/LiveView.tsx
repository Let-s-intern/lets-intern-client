import { useEffect, useMemo } from 'react';

import { twMerge } from '@/lib/twMerge';
import { LiveIdSchema } from '@/schema';
import { LiveContent } from '@/types/interface';
import Header from '@components/common/program/program-detail/header/Header';
import LexicalContent from './common/blog/LexicalContent';
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
  LIVE_MENTOR_INTRO_ID,
  PROGRAM_CURRICULUM_ID,
  PROGRAM_FAQ_ID,
  PROGRAM_INTRO_ID,
  PROGRAM_REVIEW_ID,
} from './ProgramDetailNavigation';

const LiveView: React.FC<{ live: LiveIdSchema; isPreview?: boolean }> = ({
  live,
  isPreview,
}) => {
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

  // TODO: 운영 배포 시 제거
  useEffect(() => {
    console.log('receivedContent', receivedContent);
  }, [receivedContent]);

  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full flex-col items-center">
        <div className="flex w-full max-w-[1000px] flex-col px-5 md:px-10 lg:px-0">
          <Header programTitle={live.title ?? ''} />
          {live.vod && <LiveVod />}
          <LiveBasicInfo live={live} />
        </div>

        <ProgramDetailNavigation
          programType="live"
          className={twMerge(isPreview && 'top-0 md:top-0 lg:top-0')}
        />

        <div className="flex w-full flex-col items-center">
          <div className="flex w-full max-w-[1000px] flex-col px-5 pt-20 md:px-10 md:pt-40 lg:px-0">
            <LiveMentor
              mentor={mentor}
              id={LIVE_MENTOR_INTRO_ID}
              className="live_mentor"
            />
            <LiveInformation
              id={PROGRAM_INTRO_ID}
              className="live_class"
              recommendFields={receivedContent.recommend}
              reasonFields={receivedContent.reason}
              editorContent={receivedContent.mainDescription}
            />
          </div>

          <div
            id={PROGRAM_CURRICULUM_ID}
            className="live_curriculum flex w-full max-w-[1000px] flex-col px-5 pb-16 md:px-10 lg:px-0"
          >
            <LiveCurriculum
              curriculum={receivedContent.curriculum}
              mentorJob={mentor.mentorJob}
            />

            {receivedContent.additionalCurriculum && (
              <LexicalContent
                node={receivedContent.additionalCurriculum.root}
              />
            )}
          </div>

          <LiveIntro />

          <section
            id={PROGRAM_REVIEW_ID}
            className="live_review flex w-full flex-col items-center bg-neutral-95 py-16 md:pb-32 md:pt-28"
          >
            <ProgramBestReviewSection
              reviews={receivedContent.liveReview}
              type="live"
            />
          </section>

          <div className="live_faq flex w-full flex-col gap-20 px-5 pb-8 pt-16 md:gap-40 md:px-10 md:pb-32 md:pt-36 lg:px-0">
            {receivedContent.blogReview ? (
              <ProgramDetailBlogReviewSection
                review={receivedContent.blogReview}
                programType="live"
              />
            ) : null}
            <section id={PROGRAM_FAQ_ID}>
              <LiveFaq />
            </section>
            <LiveInfoBottom live={live} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveView;
