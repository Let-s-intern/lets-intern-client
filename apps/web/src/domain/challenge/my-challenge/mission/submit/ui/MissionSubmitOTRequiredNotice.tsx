import { clsx } from 'clsx';

interface Props {
  className?: string;
}

/** 0회차를 제출하지 않은 사용자의 1회차 이상 제출 자리 안내. 자료 열람은 막지 않는다. */
const MissionSubmitOTRequiredNotice = ({ className }: Props) => (
  <section
    className={clsx(
      'rounded-xs border-neutral-80 flex flex-col gap-1 border px-4 py-4',
      className,
    )}
  >
    <p className="text-xsmall14 md:text-xsmall16 text-neutral-0 font-medium">
      0회차 미션을 먼저 제출해야 제출할 수 있어요
    </p>
  </section>
);

export default MissionSubmitOTRequiredNotice;
