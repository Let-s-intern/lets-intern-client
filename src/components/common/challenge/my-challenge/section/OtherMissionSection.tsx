import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import AbsentMissionItem from '../mission/AbsentMissionItem';
import DoneMissionItem from '../mission/DoneMissionItem';
import YetMissionItem from '../mission/YetMissionItem';
import LastMissionSubmitModal from './LastMissionSubmitModal';

interface Props {
  todayTh: number;
  isDone: boolean;
}

const OtherMissionSection = ({ isDone }: Props) => {
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const {
    absentMissions,
    remainingMissions,
    submittedMissions,
    currentChallenge,
  } = useCurrentChallenge();

  const searchParams = useSearchParams();

  const sectionRef = useRef<HTMLElement>(null);

  const [tabIndex, setTabIndex] = useState(isDone ? 1 : 0);

  useEffect(() => {
    const scrollToMission = searchParams.get('scroll_to_mission');
    if (scrollToMission) {
      let isExist = false;
      submittedMissions.forEach((mission) => {
        if (mission.id === Number(scrollToMission)) {
          isExist = true;
          return;
        }
      });
      setTabIndex(isExist ? 1 : 0);
    }
  }, [searchParams, submittedMissions]);

  return (
    <>
      <section
        className="mb-20 mt-8 scroll-mt-[calc(6rem+1rem)]"
        ref={sectionRef}
      >
        <div className="flex gap-2">
          {!isDone && (
            <div
              className={clsx('cursor-pointer p-2 font-bold', {
                'border-b-2 border-[#333333] text-[#333333]': tabIndex === 0,
                'text-[#868686]': tabIndex !== 0,
              })}
              onClick={() => setTabIndex(0)}
            >
              남은 미션
            </div>
          )}
          <div
            className={clsx('cursor-pointer p-2 font-bold', {
              'border-b-2 border-[#333333] text-[#333333]': tabIndex === 1,
              'text-[#868686]': tabIndex !== 1,
            })}
            onClick={() => setTabIndex(1)}
          >
            제출한 미션
          </div>
        </div>
        {tabIndex === 0 ? (
          <div className="mt-2 bg-[#F6F8FB] p-8">
            <ul className="flex flex-col gap-4">
              {remainingMissions.length === 0 ? (
                <span className="font-medium">남은 미션이 없습니다.</span>
              ) : (
                remainingMissions.map((mission) => (
                  <YetMissionItem key={mission.id} mission={mission} />
                ))
              )}
            </ul>
            {absentMissions.length !== 0 && (
              <div className="mt-12">
                <h3 className="pl-6 font-semibold text-[#868686]">
                  미제출 미션
                </h3>
                <ul className="mt-2 flex flex-col gap-4">
                  {absentMissions.map((mission) => (
                    <AbsentMissionItem
                      key={mission.id}
                      mission={mission}
                      isDone={isDone}
                      setOpenReviewModal={setOpenReviewModal}
                    />
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          tabIndex === 1 && (
            <div className="mt-2 bg-[#F6F8FB] p-8">
              {submittedMissions.length === 0 ? (
                <span className="font-medium">제출한 미션이 없습니다.</span>
              ) : (
                <ul className="flex flex-col gap-4">
                  {submittedMissions.map((mission) => {
                    if (mission.attendanceResult === 'WRONG' && !isDone) {
                      return (
                        <AbsentMissionItem
                          key={mission.id}
                          mission={mission}
                          isDone={isDone}
                        />
                      );
                    } else {
                      return (
                        <DoneMissionItem key={mission.id} mission={mission} />
                      );
                    }
                  })}
                </ul>
              )}
            </div>
          )
        )}
      </section>
      {openReviewModal && (
        <LastMissionSubmitModal
          challengeId={currentChallenge?.id ?? 0}
          onClose={() => setOpenReviewModal(false)}
        />
      )}
    </>
  );
};

export default OtherMissionSection;
