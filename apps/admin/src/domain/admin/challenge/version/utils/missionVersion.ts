import { ChallengeVersion, Mission } from '@/schema';
import { BONUS_MISSION_TH, TALENT_POOL_MISSION_TH } from '@/utils/constants';

const OT_MISSION_TH = 0;

const VERSION_LOCKED_THS = [
  OT_MISSION_TH,
  TALENT_POOL_MISSION_TH,
  BONUS_MISSION_TH,
];

/** 경험정리 미션과 OT·인재풀·보너스 회차 미션은 버전을 지정할 수 없고 공통으로 고정한다 (V13) */
export const isMissionVersionLocked = ({
  missionType,
  th,
}: Pick<Mission, 'missionType' | 'th'>) =>
  missionType === 'EXPERIENCE_1' ||
  missionType === 'EXPERIENCE_2' ||
  VERSION_LOCKED_THS.includes(th);

/**
 * 미션 대상 버전 표시. 비어 있으면 공통, 예: `대학생 · 직장인`.
 * 챌린지 전체 버전(2개 이상)을 모두 선택했으면 `전체 버전`으로 줄인다. 공통과는 다른 상태다
 */
export const formatMissionVersions = (
  challengeVersionList: Mission['challengeVersionList'],
  allVersions?: Pick<ChallengeVersion, 'challengeVersionId'>[],
) => {
  if (challengeVersionList.length === 0) return '공통';

  const selectedIds = new Set(
    challengeVersionList.map((version) => version.challengeVersionId),
  );
  if (
    allVersions &&
    allVersions.length >= 2 &&
    allVersions.every((version) => selectedIds.has(version.challengeVersionId))
  ) {
    return '전체 버전';
  }

  return challengeVersionList.map((version) => version.title).join(' · ');
};

/** 운영 화면 회차 라벨. 공통이면 `3회차`, 버전 미션이면 `3회차 (대학생 · 직장인)` */
export const formatMissionRoundLabel = ({
  th,
  challengeVersionList,
}: Pick<Mission, 'th' | 'challengeVersionList'>) =>
  challengeVersionList.length === 0
    ? `${th}회차`
    : `${th}회차 (${formatMissionVersions(challengeVersionList)})`;

/**
 * 운영 화면 버전 탭 필터 (LC-3505). versionId 가 null 이면 전체,
 * 아니면 그 버전 참여자가 받는 미션(공통 + 그 버전이 지정된 미션)만 남긴다
 */
export const isMissionForVersion = (
  { challengeVersionList }: Pick<Mission, 'challengeVersionList'>,
  versionId: number | null,
) =>
  versionId === null ||
  challengeVersionList.length === 0 ||
  challengeVersionList.some(
    (version) => version.challengeVersionId === versionId,
  );

type RoundMission = Pick<
  Mission,
  'th' | 'challengeVersionList' | 'attendanceCount' | 'applicationCount'
>;

/**
 * 제출확인 행 묶음 (LC-3505). 같은 회차의 버전 미션은 한 행으로 묶고,
 * 공통 미션(경험정리1·2 포함)은 미션마다 한 행으로 둔다. 순서는 처음 나온 순서를 따른다
 */
export const groupMissionsByRound = <T extends RoundMission>(
  missions: T[],
): T[][] => {
  const groups: T[][] = [];
  const versionGroupByTh = new Map<number, T[]>();
  for (const mission of missions) {
    if (mission.challengeVersionList.length === 0) {
      groups.push([mission]);
      continue;
    }
    const group = versionGroupByTh.get(mission.th);
    if (group) {
      group.push(mission);
    } else {
      const next = [mission];
      versionGroupByTh.set(mission.th, next);
      groups.push(next);
    }
  }
  return groups;
};

const formatAttendanceCount = ({
  attendanceCount,
  applicationCount,
}: RoundMission) =>
  `${attendanceCount ?? 0}(제출)/${applicationCount ?? 0}(전체)`;

/**
 * 제출확인 제출현황 칸. 공통이면 `2(제출)/8(전체)`, 한 버전이면 `0(제출)/1(전체) (대학생)`,
 * 버전 미션이 여럿이면 `대학생 2(제출)/3(전체) · 직장인 0(제출)/4(전체)`
 */
export const formatRoundAttendance = (missions: RoundMission[]) => {
  if (missions.length === 1) {
    const [mission] = missions;
    return mission.challengeVersionList.length === 0
      ? formatAttendanceCount(mission)
      : `${formatAttendanceCount(mission)} (${formatMissionVersions(mission.challengeVersionList)})`;
  }
  return missions
    .map(
      (mission) =>
        `${formatMissionVersions(mission.challengeVersionList)} ${formatAttendanceCount(mission)}`,
    )
    .join(' · ');
};
