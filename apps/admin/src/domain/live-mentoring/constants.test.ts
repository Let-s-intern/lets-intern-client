import { describe, expect, it } from 'vitest';

import { liveMentoringStatusSchema } from '@/api/live-mentoring/liveMentoringSchema';
import { STATUS_CLASSES, STATUS_FILTERS, STATUS_LABELS } from './constants';

/**
 * 백엔드 `LiveMentoringStatus` 3종(DRAFT/APPROVED/INACTIVE)만 존재한다
 * (자가승인 전환으로 PENDING_REVIEW/REJECTED 는 사라졌다). 상수가 이 집합과
 * 어긋나면 타입 에러가 나야 하지만, 런타임 값도 함께 검증한다.
 */
describe('live-mentoring constants — 상태', () => {
  const validStatuses = liveMentoringStatusSchema.options;

  it('STATUS_LABELS 는 유효한 상태 3종에 대해서만 라벨을 갖는다', () => {
    expect(Object.keys(STATUS_LABELS).sort()).toEqual(
      [...validStatuses].sort(),
    );
  });

  it('STATUS_CLASSES 는 유효한 상태 3종에 대해서만 클래스를 갖는다', () => {
    expect(Object.keys(STATUS_CLASSES).sort()).toEqual(
      [...validStatuses].sort(),
    );
  });

  it('STATUS_FILTERS 는 전체·초안·승인·비활성 4개로 구성된다', () => {
    expect(STATUS_FILTERS).toEqual([
      { label: '전체', value: undefined },
      { label: '초안', value: 'DRAFT' },
      { label: '승인', value: 'APPROVED' },
      { label: '비활성', value: 'INACTIVE' },
    ]);
  });

  it('STATUS_FILTERS 의 기본 선택지는 전체(undefined)다', () => {
    expect(STATUS_FILTERS[0]).toEqual({ label: '전체', value: undefined });
  });
});
