import { LiveIdSchema } from '@/schema';
import Header from '@components/common/program/program-detail/header/Header';
import LiveMentor from './live-view/LiveMentor';
import LiveVod from './live-view/LiveVod';

const LiveView: React.FC<{ live: LiveIdSchema }> = ({ live }) => {
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
      <pre>{JSON.stringify(JSON.parse(live.desc || '{}'), null, 2)}</pre>

      <div className="flex w-full flex-col px-5 lg:px-10 xl:px-52">
        <Header programTitle={live.title ?? ''} />

        {live.vod && <LiveVod />}

        <LiveMentor mentor={mentor} />
      </div>
    </div>
  );
};

export default LiveView;
