import MissionCalendar from '@/components/common/challenge/my-challenge/mission-calendar/ChallengeMissionCalendar';
import { Schedule } from '@/schema';
interface Props {
  schedules: Schedule[];
  todayTh: number;
  isDone: boolean;
  onMissionClick?: (missionId: number) => void;
  selectedMissionId?: number;
}

const MissionCalendarSection = ({
  schedules,
  todayTh,
  isDone,
  onMissionClick,
  selectedMissionId,
}: Props) => {
  return (
    <section>
      <div className="flex items-center gap-2"></div>
      <MissionCalendar
        className="mt-3"
        schedules={schedules}
        todayTh={todayTh}
        isDone={isDone}
        onMissionClick={onMissionClick}
      />
    </section>
  );
};

export default MissionCalendarSection;
