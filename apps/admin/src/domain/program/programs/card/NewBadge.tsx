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
    <div className="border-neutral-80 text-xxsmall10 text-primary md:text-xxsmall12 flex items-center justify-center rounded-[3px] border px-2 py-1 text-center font-normal">
      NEW
    </div>
  );
};

export default NewBadge;
