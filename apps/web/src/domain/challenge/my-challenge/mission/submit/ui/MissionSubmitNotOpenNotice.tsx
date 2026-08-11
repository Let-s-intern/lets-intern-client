import { clsx } from 'clsx';
import { Dayjs } from 'dayjs';

interface Props {
  className?: string;
  startDate: Dayjs;
}

/** "8월 15일 오전 8시" — 정각이 아니면 분까지 붙인다. */
const formatOpenAt = (startDate: Dayjs) =>
  startDate.minute() === 0
    ? startDate.format('M월 D일 A h시')
    : startDate.format('M월 D일 A h시 m분');

/**
 * 아직 열리지 않은 회차의 제출 자리 안내.
 *
 * 자료는 미리 볼 수 있다는 점을 함께 알린다. 전체 공개의 가치를 사용자가 알아야
 * 열람이 늘고, 열람이 늘어야 이용 로그가 쌓인다.
 */
const MissionSubmitNotOpenNotice = ({ className, startDate }: Props) => (
  <section
    className={clsx(
      'rounded-xs border-neutral-80 flex flex-col gap-1 border px-4 py-4',
      className,
    )}
  >
    <p className="text-xsmall14 md:text-xsmall16 text-neutral-0 font-medium">
      이 미션은 {formatOpenAt(startDate)}부터 제출할 수 있습니다.
    </p>
    <p className="text-xsmall14 md:text-xsmall16 text-neutral-30">
      미리 자료를 확인하고 준비해 주세요.
    </p>
  </section>
);

export default MissionSubmitNotOpenNotice;
