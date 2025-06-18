import { MissionStatus } from './../schema';
/** [어드민] 미션 수정 */
export interface PatchMissionReq {
  missionId: number | string;
  th?: number;
  title?: string;
  score?: number;
  lateScore?: number;
  startDate?: string;
  endDate?: string;
  status?: MissionStatus;
  missionTemplateId?: number;
  challengeOptionId?: number;
  essentialContentsIdList?: number[];
  additionalContentsIdList?: number[];
}
