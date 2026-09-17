import { PassParticipant } from '@/domain/all-in-one-pass/types';
import { participantFixtures } from './participantFixtures';

/**
 * 참여자 인메모리 mock 스토어(새로고침 시 시드로 초기화).
 */
export const participantStore = {
  list: participantFixtures.map((item) => ({ ...item })) as PassParticipant[],
};
