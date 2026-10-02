import { Mission } from '@/schema';
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

/** 미션 대상 버전 표시. 비어 있으면 공통, 예: `대학생 · 직장인` */
export const formatMissionVersions = (
  challengeVersionList: Mission['challengeVersionList'],
) =>
  challengeVersionList.length === 0
    ? '공통'
    : challengeVersionList.map((version) => version.title).join(' · ');
