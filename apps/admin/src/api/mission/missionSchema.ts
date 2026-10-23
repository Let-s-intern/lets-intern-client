import { MissionStatus } from '@/schema';
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
  // null 은 변경 없음, 빈 배열은 공통으로, 값이 있으면 그 버전들로 교체
  challengeVersionIdList?: number[] | null;
}
export interface PostDocumentReq {
  attendanceId?: number;
  documentType: string;
  fileUrl: string;
  fileName: string;
  wishField: string;
  wishJob: string;
  wishIndustry: string;
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
