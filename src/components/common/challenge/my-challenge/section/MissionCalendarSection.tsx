import { Schedule } from '../../../../../schema';
import MissionTooltipQuestion from '../../ui/tooltip-question/MissionTooltipQuestion';
import MissionCalendar from '../mission-calendar/ChallengeMissionCalendar';

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
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">
          {isDone ? (
            <>챌린지가 종료되었습니다.</>
          ) : (
            <>
              오늘은&nbsp;
              <strong className="font-semibold text-primary">
                {todayTh}회차
              </strong>{' '}
              미션 날이에요
            </>
          )}
        </h2>
        <MissionTooltipQuestion />
      </div>
      <MissionCalendar
        className="mt-4"
        schedules={schedules}
        todayTh={todayTh}
        isDone={isDone}
        onMissionClick={onMissionClick}
        selectedMissionId={selectedMissionId}
      />
    </section>
  );
};

export default MissionCalendarSection;
