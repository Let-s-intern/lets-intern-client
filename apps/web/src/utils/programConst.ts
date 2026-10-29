export * from '@letscareer/utils/programConst';

import { PROGRAM_FILTER_TYPE } from '@letscareer/utils/programConst';

/** 유저 프로그램 목록 필터 전용. 공유 상수를 넓히면 어드민 필터에도 번져서 web 에서만 올인원패스를 더한다. */
export const PROGRAM_FILTER_TYPE_USER = {
  ...PROGRAM_FILTER_TYPE,
  MEMBERSHIP: '올인원패스',
};
