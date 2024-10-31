import { LiveIdSchema } from '@/schema';
import { LiveContent } from '@/types/interface';
import Header from '@components/common/program/program-detail/header/Header';
import LiveCurriculum from './live-view/LiveCurriculum';
import LiveFaq from './live-view/LiveFaq';
import LiveMentor from './live-view/LiveMentor';
import LiveVod from './live-view/LiveVod';

const LiveView: React.FC<{ live: LiveIdSchema }> = ({ live }) => {
  const content: LiveContent = JSON.parse(live.desc || '{}');
  const mentor = {
    mentorName: live.mentorName,
    mentorImg: live.mentorImg,
    mentorCompany: live.mentorCompany,
    mentorJob: live.mentorJob,
    mentorCareer: live.mentorCareer,
    mentorIntroduction: live.mentorIntroduction,
  };

  return (
    <div>
      <pre>{JSON.stringify(content, null, 2)}</pre>

      <div className="flex w-full flex-col px-5 lg:px-10 xl:px-52">
        <Header programTitle={live.title ?? ''} />

        {live.vod && <LiveVod />}

        <LiveMentor mentor={mentor} />

        <LiveCurriculum
          curriculum={content.curriculum}
          mentorJob={mentor.mentorJob}
        />

        <section>
          <LiveFaq />
        </section>
      </div>
    </div>
  );
};

export default LiveView;
