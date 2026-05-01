import FeedbackMissionCard from '@/domain/challenge/feedback/FeedbackMissionCard';
import { DUMMY_FEEDBACK_MISSIONS } from '@/domain/challenge/feedback/dummy';

const LiveFeedbackPage = () => {
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-10 pt-8 md:flex md:flex-col md:gap-y-5">
      {DUMMY_FEEDBACK_MISSIONS.map((config, index) => (
        <FeedbackMissionCard key={index} config={config}>
          <div className="text-xsmall14 text-neutral-40 py-8 text-center">
            예약 UI
          </div>
        </FeedbackMissionCard>
      ))}
    </div>
  );
};

export default LiveFeedbackPage;
