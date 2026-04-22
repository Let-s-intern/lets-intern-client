'use client';

import { useAdminMissionsOfCurrentChallenge } from '@/context/CurrentAdminChallengeProvider';
import MissionResultItem from '@/domain/admin/challenge/home/item/MissionResultItem';
import GuideSection from '@/domain/admin/challenge/home/section/GuideSection';
import NoticeSection from '@/domain/admin/challenge/home/section/NoticeSection';
import ProgramRecommendSection from './ProgramRecommendSection';

const ChallengeOperationHome = () => {
  const missions = useAdminMissionsOfCurrentChallenge();
  return (
    <main>
      <section className="rounded mt-10 border px-3 py-2">
        <h2 className="text-lg font-bold">미션제출현황</h2>
        <div className="flex min-w-full items-center justify-around">
          {missions.map((mission) => (
            <MissionResultItem key={mission.id} mission={mission} />
          ))}
        </div>
      </section>

      <div className="mt-12 flex">
        <NoticeSection className="flex-1" />
        <GuideSection className="flex-1" />
      </div>
      <ProgramRecommendSection />
    </main>
  );
};

export default ChallengeOperationHome;
