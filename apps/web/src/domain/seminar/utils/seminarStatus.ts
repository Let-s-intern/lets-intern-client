import type { ProgramStatus } from '@/schema';
import { PROGRAM_STATUS_KEY } from '@/utils/programConst';

export type SeminarStatus = 'recruiting' | 'closed';

/**
 * 세미나 모집상태 → LIVE 프로그램 status 배열 매핑.
 * - recruiting(모집 중) → PROCEEDING
 * - closed(모집 종료) → POST
 *
 * TODO(O4): 모집 중 탭에 PREV(오픈 예정) 병합 여부·정렬(오픈예정→모집중→마감임박)
 *   확정 시 recruiting에 PROGRAM_STATUS_KEY.PREV 추가.
 */
export const seminarStatusToProgramStatus = (
  status: SeminarStatus,
): ProgramStatus[] =>
  status === 'recruiting'
    ? [PROGRAM_STATUS_KEY.PROCEEDING]
    : [PROGRAM_STATUS_KEY.POST];
