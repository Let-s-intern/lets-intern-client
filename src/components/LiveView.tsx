import { LiveIdSchema } from '@/schema';
import Header from '@components/common/program/program-detail/header/Header';
import LiveVod from './live-view/LiveVod';

const LiveView: React.FC<{ live: LiveIdSchema }> = ({ live }) => {
  return (
    <div>
      <pre>{JSON.stringify(JSON.parse(live.desc || '{}'), null, 2)}</pre>
      <div className="flex w-full flex-col px-5 lg:px-10 xl:px-52">
        <Header programTitle={live.title ?? ''} />
        {live.vod && <LiveVod />}
      </div>
    </div>
  );
};

export default LiveView;
