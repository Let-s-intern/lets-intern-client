import {
  LOCALIZED_YYYY_MDdd_HH,
  LOCALIZED_YYYY_MDdd_HHmm,
  LOCALIZED_YYYY_MMDD,
} from '@/data/dayjsFormat';
import dayjs from '@/lib/dayjs';
import { ChallengeIdPrimitive } from '@/schema';

export default function useChallengeSchedule(challenge: ChallengeIdPrimitive) {
  const startDate = dayjs(challenge.startDate).format(LOCALIZED_YYYY_MMDD);
  const deadline = dayjs(challenge.deadline).format(LOCALIZED_YYYY_MDdd_HHmm);
  const duration = (
    <>
      {dayjs(challenge.startDate).format(LOCALIZED_YYYY_MDdd_HHmm)} -
      <br className="md:hidden" />{' '}
      {dayjs(challenge.endDate).format(LOCALIZED_YYYY_MDdd_HHmm)}
    </>
  );
  const orientationDate = (
    <>
      {dayjs(challenge.startDate)?.get('minute') === 0
        ? dayjs(challenge.startDate)?.format(LOCALIZED_YYYY_MDdd_HH)
        : dayjs(challenge.startDate)?.format(LOCALIZED_YYYY_MDdd_HHmm)}{' '}
      ~ {dayjs(challenge.startDate)?.add(40, 'minute').format('HH시 mm분')}
    </>
  );

  return { startDate, deadline, duration, orientationDate };
}
