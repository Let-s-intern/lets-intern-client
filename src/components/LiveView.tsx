import { LiveIdSchema } from '@/schema';
import { LiveContent } from '@/types/interface';
import Header from '@components/common/program/program-detail/header/Header';
import { useEffect, useMemo } from 'react';
import LexicalContent from './common/blog/LexicalContent';
import LiveCurriculum from './live-view/LiveCurriculum';
import LiveFaq from './live-view/LiveFaq';
import LiveMentor from './live-view/LiveMentor';
import LiveVod from './live-view/LiveVod';
import ProgramDetailBlogReviewSection from './ProgramDetailBlogReviewSection';

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
    <div>
      <div className="flex w-full flex-col px-5 lg:px-10 xl:px-52">
        <Header programTitle={live.title ?? ''} />

        {live.vod && <LiveVod />}

        <LiveMentor mentor={mentor} />

        <LiveCurriculum
          curriculum={receivedContent.curriculum}
          mentorJob={mentor.mentorJob}
        />

        {receivedContent.additionalCurriculum && (
          <LexicalContent node={receivedContent.additionalCurriculum.root} />
        )}

        {receivedContent.blogReview ? (
          <ProgramDetailBlogReviewSection review={receivedContent.blogReview} />
        ) : null}

        <section>
          <LiveFaq />
        </section>
      </div>
    </div>
  );
};

export default LiveView;
