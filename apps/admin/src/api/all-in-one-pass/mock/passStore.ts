import { AllInOnePassListItem } from '@/domain/all-in-one-pass/types';
import { passFixtures } from './passFixtures';

/**
 * 세션 동안 유지되는 인메모리 mock 스토어(새로고침 시 시드로 초기화).
 */
export const passStore = {
  list: passFixtures.map((item) => ({ ...item })) as AllInOnePassListItem[],
};

/** 새 숫자 id 발급 */
export const nextPassId = (): number =>
  passStore.list.reduce((max, item) => Math.max(max, item.id), 0) + 1;

/** 로딩 상태가 렌더되도록 아주 짧은 지연을 준다. */
export const mockDelay = <T>(value: T, ms = 200): Promise<T> =>
  new Promise((res) => setTimeout(() => res(value), ms));
