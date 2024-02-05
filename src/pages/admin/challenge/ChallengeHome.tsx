import MissionDateSection from '../../../components/admin/challenge/challenge-home/section/MissionDateSection';
import MissionResultSection from '../../../components/admin/challenge/challenge-home/section/MissionResultSection';
import NoticeSection from '../../../components/admin/challenge/challenge-home/section/NoticeSection';

const ChallengeHome = () => {
  return (
    <main className="px-12 pb-12 pt-8">
      <div className="flex h-64 gap-4">
        <NoticeSection />
        <MissionDateSection />
      </div>
      <div className="mt-4">
        <MissionResultSection />
      </div>
    </main>
  );
};

export default ChallengeHome;
