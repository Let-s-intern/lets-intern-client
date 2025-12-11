import { ACTIVITY_TYPE_KR, ActivityType } from '@/api/experienceSchema';

const ActivityTypeCell = ({ value }: { value: string }) => {
  return (
    <span className="rounded-xxs bg-neutral-90 px-2 py-1 text-xs font-normal">
      {ACTIVITY_TYPE_KR[value as ActivityType]}
    </span>
  );
};

export default ActivityTypeCell;
