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
