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
    <div className="flex items-center justify-center rounded-[3px] border border-neutral-80 px-2 py-1 text-center text-xxsmall10 font-normal text-primary md:text-xxsmall12">
      NEW
    </div>
  );
};

export default NewBadge;
