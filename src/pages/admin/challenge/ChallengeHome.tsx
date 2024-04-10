import MissionDateSection from '../../../components/admin/challenge/home/regacy/section/MissionDateSection';
import MissionResultSection from '../../../components/admin/challenge/home/regacy/section/MissionResultSection';
import NoticeSection from '../../../components/admin/challenge/home/regacy/section/NoticeSection';

const ChallengeHome = () => {
  return (
    <main className="px-12 pb-12 pt-5">
      <div className="flex h-64 gap-4">
        <MissionDateSection />
        <NoticeSection />
      </div>
      <div className="mt-4">
        <MissionResultSection />
      </div>
    </main>
  );
};

export default ChallengeHome;
