import {
  LOCALIZED_YYYY_MDdd_HH,
  LOCALIZED_YYYY_MDdd_HHmm,
  LOCALIZED_YYYY_MMDD,
} from '@/data/dayjsFormat';
import dayjs from '@/lib/dayjs';
import { ChallengeIdPrimitive } from '@/schema';

export default function getChallengeSchedule(challenge: ChallengeIdPrimitive) {
  const startDate = dayjs(challenge.startDate).format(LOCALIZED_YYYY_MMDD);
  const startDateWithTime = dayjs(challenge.startDate).format(
    LOCALIZED_YYYY_MDdd_HHmm,
  );
  const endDateWithTime = dayjs(challenge.endDate).format(
    LOCALIZED_YYYY_MDdd_HHmm,
  );
  const deadline = dayjs(challenge.deadline).format(LOCALIZED_YYYY_MDdd_HHmm);
  const isStartTimeOnTheHour = dayjs(challenge.startDate)?.get('minute') === 0; // 프로그램이 정각에 시작하는가
  const startDateWithHour = dayjs(challenge.startDate)?.format(
    LOCALIZED_YYYY_MDdd_HH,
  );
  const orientationEndTime = dayjs(challenge.startDate)
    ?.add(40, 'minute')
    .format('HH시 mm분');

  return {
    startDate,
    deadline,
    startDateWithTime,
    endDateWithTime,
    isStartTimeOnTheHour,
    startDateWithHour,
    orientationEndTime,
  };
}
