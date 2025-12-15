import { useChallengeMissionAttendanceInfoQuery } from '@/api/challenge';
import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import { DailyMission, Schedule } from '@/schema';
import { useMissionStore } from '@/store/useMissionStore';
import { BONUS_MISSION_TH, TALENT_POOL_MISSION_TH } from '@/utils/constants';
import { isAxiosError } from 'axios';
import clsx from 'clsx';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCallback } from 'react';

const DailyMissionSection = ({
  dailyMission,
  schedules,
}: {
  dailyMission: DailyMission;
  schedules: Schedule[];
}) => {
  const params = useParams<{ applicationId: string; programId: string }>();
  const applicationId = params.applicationId;
  const { currentChallenge } = useCurrentChallenge();

  const router = useRouter();

  const missionTh =
    dailyMission?.th === BONUS_MISSION_TH
      ? '보너스 미션'
      : dailyMission?.th === TALENT_POOL_MISSION_TH
        ? '인재풀 미션'
        : `${dailyMission?.th}회차`;

  const missionName =
    dailyMission?.th === BONUS_MISSION_TH ||
    dailyMission?.th === TALENT_POOL_MISSION_TH
      ? ''
      : dailyMission?.title;

  const missionDescription =
    dailyMission?.th === BONUS_MISSION_TH
      ? '안녕하세요, 커리어의 첫걸음을 함께하는 렛츠커리어입니다!\n렛츠커리어의 챌린지 프로그램을 믿고 따라와주셔서 감사드리며, 1만원을 100% 지급해드리는 후기 이벤트를 안내드립니다!'
      : dailyMission?.th === TALENT_POOL_MISSION_TH
        ? '안녕하세요, 렛츠커리어입니다.\n챌린지를 끝까지 함께해 주신 여러분께 특별한 기회를 드려요! 🎉\n렛츠커리어는 “한 번의 등록으로 여러 기업에게 채용 제안”을 받을 수 있는 인재풀 서비스를 운영하고 있습니다.\n\n챌린지 기간 동안 완성한 이력서 / 포트폴리오/자기소개서를 제출하시면, 렛츠커리어가 대신 인재풀에 등록해드려요.'
        : dailyMission?.description;

  const targetSchedule = schedules.find(
    (schedule) => schedule.missionInfo.id === dailyMission?.id,
  );
  const mission = targetSchedule?.missionInfo;

  const isSubmitted = targetSchedule?.attendanceInfo?.submitted ?? false;
  const isSubmitEdit = targetSchedule
    ? !(
        targetSchedule.attendanceInfo?.result === 'PASS' &&
        targetSchedule.attendanceInfo?.status === 'PRESENT'
      )
    : false;

  const { error } = useChallengeMissionAttendanceInfoQuery({
    challengeId: params.programId,
    missionId: mission?.id,
  });

  const { setSelectedMission } = useMissionStore();

  const isValid = useCallback(() => {
    if (isAxiosError(error)) {
      const errorCode = error?.response?.data.status;
      if (errorCode === 400) {
        alert('0회차 미션을 먼저 완료해주세요.');
      }
      return false;
    }
    return true;
  }, [error]);

  const handleMissionClick = () => {
    if (!isSubmitEdit) return;
    if (targetSchedule?.missionInfo.th === null) return;
    if (!mission?.id || !mission?.th) return;
    if (!isValid()) return;

    setSelectedMission(mission.id, mission.th);
    router.push(`/challenge/${params.applicationId}/${params.programId}/me`);
  };

  return (
    <section
      className={clsx(
        'flex h-[338px] min-h-[180px] flex-col rounded-xs border md:h-[360px] md:w-[488px]',
        isSubmitted ? 'border-neutral-80' : 'border-primary-80',
      )}
    >
      <div className="flex flex-col border-b px-4 py-3 md:flex-row md:items-center md:gap-2 md:py-4">
        <h2 className="flex flex-row font-semibold text-[#4A495C]">
          <span className="relative inline-block font-semibold text-neutral-10 after:mx-[6px] after:h-[18px] after:border-r after:border-neutral-60 after:content-['']">
            {missionTh}
          </span>
          <span>{missionName}</span>
        </h2>
        <span className="text-xsmall14 text-primary">
          마감기한 {dailyMission?.endDate?.format('MM.DD HH:mm')}까지
        </span>
      </div>
      <div className="flex-1 overflow-hidden p-4">
        <p className="mb-4 line-clamp-[8] whitespace-pre-line text-xsmall14 text-neutral-0 md:mb-0 md:h-48 md:text-xsmall16">
          {missionDescription}
        </p>
      </div>
      <Link
        href={
          isSubmitEdit
            ? `/challenge/${applicationId}/${currentChallenge?.id}/me?scroll_to=daily-mission`
            : '#'
        }
        onClick={handleMissionClick}
        className={clsx(
          'm-4 rounded-xs py-3 text-center',
          isSubmitEdit
            ? 'bg-primary text-white'
            : 'cursor-not-allowed bg-neutral-70 text-white',
        )}
      >
        {isSubmitted ? '제출 수정하기' : '미션 수행하기'}
      </Link>
    </section>
  );
};

export default DailyMissionSection;
