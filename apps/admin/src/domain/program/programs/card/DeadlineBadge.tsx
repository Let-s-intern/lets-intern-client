import dayjs from '@/lib/dayjs';

const DEADLINE_THRESHOLD_DAYS = 3;

interface DeadlineBadgeProps {
  deadline?: string;
}

const DeadlineBadge = ({ deadline }: DeadlineBadgeProps) => {
  if (!deadline) return null;

  const daysLeft = dayjs(deadline).diff(dayjs(), 'day');
  if (daysLeft < 0 || daysLeft > DEADLINE_THRESHOLD_DAYS) return null;

  return (
    <span className="rounded-xs bg-neutral-0/80 text-xxsmall10 text-static-100 md:text-xxsmall12 absolute left-2 top-2 px-2.5 py-1 font-semibold">
      마감임박
    </span>
  );
};

export default DeadlineBadge;
