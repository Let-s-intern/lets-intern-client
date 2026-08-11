import { useChallengeMissionAttendanceInfoQuery } from '@/api/challenge/challenge';
import {
  formatMissionOpenTime,
  isWithinMinuteCountdown,
} from '@/domain/challenge/utils/missionOpenTime';
import dayjs from '@/lib/dayjs';
import { Schedule } from '@/schema';
import { BONUS_MISSION_TH, TALENT_POOL_MISSION_TH } from '@/utils/constants';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const missionTitleOf = (th: number | null) => {
  if (th === BONUS_MISSION_TH) return '보너스 미션';
  if (th === TALENT_POOL_MISSION_TH) return '인재풀 미션';
  return `${th}회차`;
};

interface Props {
  /** 아직 열리지 않은 회차 중 가장 먼저 열릴 것 */
  nextSchedule: Schedule;
}

/**
 * 미션과 미션 사이에 빈 시간이 있을 때만 오늘의 미션 카드 자리를 대신한다.
 *
 * 앞 회차 마감 직후 다음 회차가 열리는 편성이면 이 카드는 뜨지 않는다. `dailyMission` 이
 * 한 순간도 비지 않아 카드가 1회차에서 2회차로 바로 갈아끼워지기 때문이다.
 * 편성에 빈틈이 있을 때만 나타나는 안전망이고, 편성이 정리되면 저절로 사라진다.
 *
 * 예전에는 이 자리에 "모든 미션이 완료되었습니다" 가 떴다. `dailyMission` 이 null 인 것을
 * "다 끝났다" 로 읽었기 때문인데, 실제 뜻은 "지금은 미션 시간이 아니다" 다.
 * 2회차를 하고 있는 사람에게 완주 축하가 나갔다(LC-3207).
 *
 * 마크업은 `DailyMissionSection` 과 똑같이 맞췄다. 빈 시간대에 화면 구조가 통째로 바뀌면
 * 그것대로 "뭔가 잘못됐나" 로 읽힌다. 달라지는 것은 마감기한 자리에 오픈 시각이 오는 것과
 * 버튼이 잠기는 것뿐이다. 잠긴 버튼 스타일도 기존 카드가 쓰던 것을 그대로 쓴다.
 */
const MissionNotOpenSection = ({ nextSchedule }: Props) => {
  const params = useParams<{ programId: string }>();

  const mission = nextSchedule.missionInfo;
  const startDate = mission.startDate;

  const [now, setNow] = useState(() => dayjs());

  // 한 시간 안쪽일 때만 분이 의미를 갖는다. 그 밖에는 문구가 바뀌지 않으므로
  // 타이머를 돌리지 않는다.
  const needsTick = startDate ? isWithinMinuteCountdown(startDate, now) : false;

  useEffect(() => {
    if (!needsTick) return;

    const timer = setInterval(() => setNow(dayjs()), 60_000);
    return () => clearInterval(timer);
  }, [needsTick]);

  // 미션 설명은 스케줄 응답에 없어 상세를 따로 부른다. 서버는 시작 전 회차의 상세도
  // 그대로 내려준다(LC-3207 미션 전체 공개). OT 를 통과하지 않았으면 400 이 오는데,
  // 그때는 설명 없이 제목과 오픈 시각만 보여준다.
  const { data: missionDetail } = useChallengeMissionAttendanceInfoQuery({
    challengeId: params.programId,
    missionId: mission.id,
  });

  const description = missionDetail?.missionInfo?.description;

  return (
    <section className="rounded-xs border-neutral-80 flex h-[338px] min-h-[180px] flex-col border md:h-[360px] md:w-[488px]">
      <div className="flex flex-col border-b px-4 py-3 md:flex-row md:items-center md:gap-2 md:py-4">
        <h2 className="flex flex-row font-semibold text-[#4A495C]">
          <span className="text-neutral-10 after:border-neutral-60 relative inline-block font-semibold after:mx-[6px] after:h-[18px] after:border-r after:content-['']">
            {missionTitleOf(mission.th)}
          </span>
          <span>{mission.title}</span>
        </h2>
        <span className="text-xsmall14 text-primary">
          {startDate ? formatMissionOpenTime(startDate, now) : '곧 열려요'}
        </span>
      </div>

      <div className="flex-1 overflow-hidden p-4">
        <p className="text-xsmall14 text-neutral-0 md:text-xsmall16 mb-4 line-clamp-[8] whitespace-pre-line md:mb-0 md:h-48">
          {description ?? '미션이 열리면 내용을 확인할 수 있어요.'}
        </p>
      </div>

      <span className="rounded-xs bg-neutral-70 m-4 cursor-not-allowed py-3 text-center text-white">
        미션 수행하기
      </span>
    </section>
  );
};

export default MissionNotOpenSection;
