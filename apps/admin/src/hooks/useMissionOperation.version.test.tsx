import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import dayjs from '@/lib/dayjs';
import { Row } from '@/types/interface';

type VersionItem = { challengeVersionId: number; title: string };

const mocks = vi.hoisted(() => ({
  patch: vi.fn().mockResolvedValue({ data: {} }),
  post: vi.fn().mockResolvedValue({ data: {} }),
  // 서버가 준 미션 목록. 수정 시 버전 변경 여부를 이 값과 비교한다
  missions: [] as { id: number; challengeVersionList: VersionItem[] }[],
}));

vi.mock('@/utils/axios', () => ({
  default: {
    patch: (...args: unknown[]) => mocks.patch(...args),
    post: (...args: unknown[]) => mocks.post(...args),
    delete: vi.fn().mockResolvedValue({ data: {} }),
    // 훅 내부 옵션 쿼리들이 부르는 get — 각 스키마가 통과할 최소 응답을 반환한다.
    get: vi.fn((url: string) => {
      if (String(url).startsWith('/mission-template/admin')) {
        return Promise.resolve({
          data: {
            data: {
              missionTemplateAdminList: [],
              pageInfo: {
                pageNum: 0,
                pageSize: 1000,
                totalElements: 0,
                totalPages: 0,
              },
            },
          },
        });
      }
      return Promise.resolve({ data: { data: { contentsSimpleList: [] } } });
    }),
  },
}));

vi.mock('@/context/CurrentAdminChallengeProvider', () => ({
  useAdminCurrentChallenge: () => ({ currentChallenge: { id: 1 } }),
  useAdminMissionsOfCurrentChallenge: () => mocks.missions,
  useMissionsOfCurrentChallengeRefetch: () => vi.fn(),
}));

vi.mock('@/hooks/useAdminSnackbar', () => ({
  useAdminSnackbar: () => ({ snackbar: vi.fn() }),
}));

import { useMissionOperations } from './useMissionOperation';

const STUDENT = { challengeVersionId: 10, title: '대학생' };
const WORKER = { challengeVersionId: 20, title: '직장인' };

const createWrapper = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
};

const createRow = (challengeVersionList: VersionItem[]) =>
  ({
    id: 42,
    missionTemplateId: 7,
    missionTemplatesOptions: [{ id: 7, title: '미션' }],
    essentialContentsList: [{ id: 1, title: '자료1', link: '' }],
    additionalContentsList: [{ id: 2, title: '자료2', link: '' }],
    challengeVersionList,
    lateScore: 5,
    score: 10,
    th: 1,
    missionType: null,
    startDate: dayjs('2026-07-10T09:00:00'),
    endDate: dayjs('2026-07-12T23:59:00'),
  }) as unknown as Row;

const runAction = async (action: 'create' | 'edit', row: Row) => {
  const apiRef = {
    current: {
      getRowMode: () => 'view',
      stopRowEditMode: vi.fn(),
      forceUpdate: vi.fn(),
    },
  } as never;
  const { result } = renderHook(() => useMissionOperations(apiRef), {
    wrapper: createWrapper(),
  });
  await act(async () => {
    await result.current.onAction({ action, row });
  });
};

const lastPatchPayload = async () => {
  await waitFor(() => expect(mocks.patch).toHaveBeenCalledTimes(1));
  return mocks.patch.mock.calls[0][1];
};

const lastPostPayload = async () => {
  await waitFor(() => expect(mocks.post).toHaveBeenCalledTimes(1));
  return mocks.post.mock.calls[0][1];
};

afterEach(() => {
  mocks.patch.mockClear();
  mocks.post.mockClear();
  mocks.missions = [];
});

describe('미션 저장 요청의 대상 버전 (6.2)', () => {
  it('생성 요청에 행의 버전 id 목록을 담고 자료는 id 목록으로만 보낸다', async () => {
    await runAction('create', createRow([STUDENT, WORKER]));

    const payload = await lastPostPayload();
    expect(payload.challengeVersionIdList).toEqual([10, 20]);
    expect(payload.essentialContentsIdList).toEqual([1]);
    expect(payload.additionalContentsIdList).toEqual([2]);
    expect(payload).not.toHaveProperty('essentialContents');
    expect(payload).not.toHaveProperty('additionalContents');
  });

  it('버전을 고르지 않은 생성은 빈 목록(공통)으로 보낸다', async () => {
    await runAction('create', createRow([]));

    const payload = await lastPostPayload();
    expect(payload.challengeVersionIdList).toEqual([]);
  });

  it('수정에서 버전을 바꾸지 않았으면 null 로 보낸다', async () => {
    mocks.missions = [{ id: 42, challengeVersionList: [STUDENT, WORKER] }];
    // 순서만 달라도 같은 집합이면 미변경이다
    await runAction('edit', createRow([WORKER, STUDENT]));

    const payload = await lastPatchPayload();
    expect(payload.challengeVersionIdList).toBeNull();
  });

  it('수정에서 버전을 바꾸면 바뀐 id 목록을 보낸다', async () => {
    mocks.missions = [{ id: 42, challengeVersionList: [STUDENT] }];
    await runAction('edit', createRow([WORKER]));

    const payload = await lastPatchPayload();
    expect(payload.challengeVersionIdList).toEqual([20]);
  });

  it('수정에서 버전을 모두 빼면 빈 목록(공통)으로 보낸다', async () => {
    mocks.missions = [{ id: 42, challengeVersionList: [STUDENT] }];
    await runAction('edit', createRow([]));

    const payload = await lastPatchPayload();
    expect(payload.challengeVersionIdList).toEqual([]);
  });

  it('공통 미션을 공통 그대로 수정하면 null 로 보낸다', async () => {
    mocks.missions = [{ id: 42, challengeVersionList: [] }];
    await runAction('edit', createRow([]));

    const payload = await lastPatchPayload();
    expect(payload.challengeVersionIdList).toBeNull();
  });
});
