import dayjs from '@/lib/dayjs';

const NEW_THRESHOLD_DAYS = 14;

interface NewBadgeProps {
  beginning?: string;
}

const NewBadge = ({ beginning }: NewBadgeProps) => {
  if (!beginning) return null;

  const isNew = dayjs().diff(dayjs(beginning), 'day') <= NEW_THRESHOLD_DAYS;
  if (!isNew) return null;

  return (
    <div className="text-0.75-medium md:text-0.875-medium rounded-xs border border-point bg-[#FFF0E0] px-2.5 py-0.5 text-point">
      NEW
    </div>
  );
};

export default NewBadge;
