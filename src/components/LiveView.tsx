import { LiveIdSchema } from '@/schema';
import { LiveContent } from '@/types/interface';
import Header from '@components/common/program/program-detail/header/Header';
import { useEffect, useMemo } from 'react';
import LexicalContent from './common/blog/LexicalContent';
import LiveCurriculum from './live-view/LiveCurriculum';
import LiveFaq from './live-view/LiveFaq';
import LiveIntro from './live-view/LiveIntro';
import LiveMentor from './live-view/LiveMentor';
import LiveVod from './live-view/LiveVod';
import ProgramDetailBlogReviewSection from './ProgramDetailBlogReviewSection';
import ProgramDetailNavigation from './ProgramDetailNavigation';

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
        </div>
        <ProgramDetailNavigation isLive />
        <div className="flex w-full max-w-[1200px] flex-col overflow-x-hidden px-5 lg:px-10">
          <LiveMentor mentor={mentor} />

          <LiveCurriculum
            curriculum={receivedContent.curriculum}
            mentorJob={mentor.mentorJob}
          />

          <LiveIntro />

          {receivedContent.additionalCurriculum && (
            <LexicalContent node={receivedContent.additionalCurriculum.root} />
          )}

          {receivedContent.blogReview ? (
            <ProgramDetailBlogReviewSection
              review={receivedContent.blogReview}
              programType="live"
            />
          ) : null}

          <section>
            <LiveFaq />
          </section>
        </div>
      </div>
    </div>
  );
};

export default LiveView;
