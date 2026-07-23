import { useGetUserProgramQuery } from '@/api/program';
import { PROGRAM_TYPE } from '@/utils/programConst';
import {
  SeminarStatus,
  seminarStatusToProgramStatus,
} from '../utils/seminarStatus';

/**
 * 클라이언트 페이징(데스크톱 8/모바일 4)을 위해 한 번에 넉넉히 받는다.
 * 세미나는 랜딩 노출용이라 실무상 이 상한을 넘지 않는다. 상한 초과 시에는
 * 서버 페이지네이션 전환이 필요하다(현재는 최근 100개만 페이징).
 */
const SEMINAR_LIST_SIZE = 100;

/**
 * 무료 세미나(LIVE 프로그램) 목록 조회 훅.
 * 모집상태별로 LIVE 프로그램을 조회한다. TanStack `UseQueryResult`를 그대로 반환한다.
 */
export const useSeminarList = (status: SeminarStatus) =>
  useGetUserProgramQuery({
    pageable: { page: 1, size: SEMINAR_LIST_SIZE },
    searchParams: {
      type: PROGRAM_TYPE.LIVE,
      status: seminarStatusToProgramStatus(status),
    },
  });
