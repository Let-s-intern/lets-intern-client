import { z } from 'zod';
import { useMissionsOfCurrentChallenge } from '../../../context/CurrentChallengeProvider';
import { missionStatusType } from '../../../schema';

const MissionStateBadge = ({
  state,
}: {
  state: z.infer<typeof missionStatusType>;
}) => {
  switch (state) {
    case 'CHECK_DONE':
      return <span className="rounded bg-green-500 text-white">확인완료</span>;
    case 'REFUND_DONE':
      return <span className="rounded bg-red-500 text-white">환불완료</span>;
    case 'WAITING':
      return <span className="rounded bg-gray-500 text-white">대기</span>;
  }
};

const ChallengeOperationHome = () => {
  const missions = useMissionsOfCurrentChallenge();
  return (
    <main>
      <h2 className="text-lg font-bold">미션제출현황</h2>
      <div className="flex items-center gap-2">
        {missions?.missionList.map((mission) => {
          return (
            <div key={mission.id} className="border p-3 text-center">
              <p>
                {mission.startDate.format('MM/DD(ddd)')}-
                {mission.endDate.format('MM/DD(ddd)')}
              </p>
              <h3>{mission.th}회차</h3>
              <p className="text-xl">{mission.attendanceCount}</p>
              <p>지각 {mission.lateAttendanceCount}</p>
              <p>
                <MissionStateBadge state={mission.missionStatusType} />
              </p>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default ChallengeOperationHome;
