import { ChallengeIdSchema } from '@/schema';
import Header from '@components/common/program/program-detail/header/Header';

const ChallengeView: React.FC<{ challenge: ChallengeIdSchema }> = ({
  challenge,
}) => {
  return (
    <div>
      <pre>{JSON.stringify(JSON.parse(challenge.desc || '{}'), null, 2)}</pre>
      <div className="px-5 lg:px-10 xl:px-52">
        <Header programTitle={challenge.title ?? ''} />
      </div>
    </div>
  );
};

export default ChallengeView;
