import { MissionStatus } from './../schema';
/** [어드민] 미션 수정 */
export interface PatchMissionReq {
  missionId: number | string;
  missionType?: string | null;
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

export type DocumentType = 'RESUME' | 'PORTFOLIO' | 'PERSONAL_STATEMENT';

/** POST [유저] 인재풀 미션 제출 */
// export interface PostMissionTalentPoolReq {
//   requestDto: {
//     documentType: DocumentType;
//     fileUrl?: string;
//   };
//   file?: File;
// }
