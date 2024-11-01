import { LiveIdSchema } from '@/schema';
import { LiveContent } from '@/types/interface';
import Header from '@components/common/program/program-detail/header/Header';
import { useEffect, useMemo } from 'react';
import LexicalContent from './common/blog/LexicalContent';
import LiveBasicInfo from './live-view/LiveBasicInfo';
import LiveClassInfo from './live-view/LiveClassIntro';
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

const LiveView: React.FC<{ live: LiveIdSchema }> = ({ live }) => {
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
        <div className="flex w-full max-w-[1200px] flex-col px-5 md:px-10">
          <Header programTitle={live.title ?? ''} />
          {live.vod && <LiveVod />}
          <LiveBasicInfo live={live} />
        </div>
        <ProgramDetailNavigation programType="live" />
        {/* TODO: 어떤 콘텐츠가 full-width로 들어가게 되면 각 요소를 max-w-[1200px]로 해야 함. */}
        <div className="w-full max-w-[1200px] px-5 lg:px-10">
          <div id={LIVE_MENTOR_INTRO_ID}>
            <LiveMentor mentor={mentor} />
            <LiveInformation
              recommendFields={receivedContent.recommend}
              reasonFields={receivedContent.reason}
              editorContent={receivedContent.mainDescription}
            />
          </div>

          <div id={PROGRAM_INTRO_ID}>
            <LiveClassInfo />
          </div>

          <div id={PROGRAM_CURRICULUM_ID}>
            <LiveCurriculum
              curriculum={receivedContent.curriculum}
              mentorJob={mentor.mentorJob}
            />

            <LiveIntro />

            {receivedContent.additionalCurriculum && (
              <LexicalContent
                node={receivedContent.additionalCurriculum.root}
              />
            )}
          </div>

          <div id={PROGRAM_REVIEW_ID}>
            <ProgramBestReviewSection />

            {receivedContent.blogReview ? (
              <ProgramDetailBlogReviewSection
                review={receivedContent.blogReview}
                programType="live"
              />
            ) : null}
          </div>

          <section id={PROGRAM_FAQ_ID}>
            <LiveFaq />
            <LiveInfoBottom live={live} />
          </section>
        </div>
      </div>
    </div>
  );
};

export default LiveView;
