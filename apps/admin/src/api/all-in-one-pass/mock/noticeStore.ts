import { AllInOnePassNotice } from '@/domain/all-in-one-pass/types';
import { noticeFixtures } from './noticeFixtures';

/**
 * 세션 동안 유지되는 공지/가이드 인메모리 mock 스토어(새로고침 시 시드로 초기화).
 */
export const noticeStore = {
  list: noticeFixtures.map((item) => ({ ...item })) as AllInOnePassNotice[],
};

/** 새 숫자 id 발급 */
export const nextNoticeId = (): number =>
  noticeStore.list.reduce((max, item) => Math.max(max, item.id), 0) + 1;
