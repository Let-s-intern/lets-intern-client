import MissionResultItem from '../../../components/admin/challenge/home/item/MissionResultItem';
import GuideSection from '../../../components/admin/challenge/home/section/GuideSection';
import NoticeSection from '../../../components/admin/challenge/home/section/NoticeSection';
import { useMissionsOfCurrentChallenge } from '../../../context/CurrentChallengeProvider';

const ChallengeOperationHome = () => {
  const missions = useMissionsOfCurrentChallenge();
  return (
    <main>
      <section className="rounded mt-10 border px-3 py-2">
        <h2 className="text-lg font-bold">미션제출현황</h2>
        <div className="flex min-w-full items-center justify-around">
          {missions.map((mission, index) => (
            <MissionResultItem key={mission.id} mission={mission} />
          ))}
        </div>
      </section>

      <div className="mt-12 flex">
        <NoticeSection className="flex-1" />
        <GuideSection className="flex-1" />
      </div>
    </main>
  );
};

export default ChallengeOperationHome;
