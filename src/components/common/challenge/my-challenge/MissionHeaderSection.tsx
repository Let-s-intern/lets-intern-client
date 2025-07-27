import { clsx } from 'clsx';

interface MissionHeaderSectionProps {
  className?: string;
  todayTh: number;
  missionType: string;
  deadline: string;
}

const MissionHeaderSection = ({
  className,
  todayTh,
  missionType,
  deadline,
}: MissionHeaderSectionProps) => {
  const getMissionTitle = () => {
    if (todayTh === 100) {
      return '보너스 미션';
    }
    return `${todayTh}회차 미션`;
  };

  return (
    <section className={clsx('mb-3 flex flex-row gap-2', className)}>
      <div className="flex flex-row items-center gap-2">
        <h2 className="text-small18 font-semibold text-neutral-0">
          {getMissionTitle()}
        </h2>
        <div className="h-[18px] w-px bg-neutral-60" />
        <h2 className="text-small18 font-semibold text-neutral-0">
          {missionType}
        </h2>
      </div>
      <p className="flex flex-row items-end text-xsmall16 font-medium text-primary-90">
        마감기한 {deadline}까지
      </p>
    </section>
  );
};

export default MissionHeaderSection;
