import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import dayjs from '@/lib/dayjs';
import { Row } from '@/types/interface';

const mocks = vi.hoisted(() => ({
  patch: vi.fn().mockResolvedValue({ data: {} }),
  post: vi.fn().mockResolvedValue({ data: {} }),
  versionList: [] as {
    challengeVersionId: number;
    title: string;
    sortOrder: number;
  }[],
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
  useAdminCurrentChallenge: () => ({
    currentChallenge: { id: 1, versionList: mocks.versionList },
  }),
  useAdminMissionsOfCurrentChallenge: () => [],
  useMissionsOfCurrentChallengeRefetch: () => vi.fn(),
}));

vi.mock('@/hooks/useAdminSnackbar', () => ({
  useAdminSnackbar: () => ({ snackbar: vi.fn() }),
}));

import { useMissionOperations } from './useMissionOperation';

const VERSION_LIST = [
  { challengeVersionId: 10, title: '대학생', sortOrder: 0 },
  { challengeVersionId: 20, title: '직장인', sortOrder: 1 },
];

const createWrapper = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
};

const contents = (id: number, challengeVersionId: number | null) => ({
  id,
  title: `자료${id}`,
  link: '',
  missionContentsId: null,
  challengeVersionId,
});

const createRow = (
  essentialContentsList: ReturnType<typeof contents>[],
  additionalContentsList: ReturnType<typeof contents>[],
) =>
  ({
    id: 42,
    missionTemplateId: 7,
    missionTemplatesOptions: [{ id: 7, title: '미션' }],
    essentialContentsList,
    additionalContentsList,
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

// 버전 없는 챌린지가 지금까지 보내던 요청
const LEGACY_PAYLOAD = {
  additionalContentsIdList: [2],
  essentialContentsIdList: [1],
  lateScore: 5,
  missionTemplateId: 7,
  missionType: null,
  score: 10,
  startDate: '2026-07-10T09:00:00',
  endDate: '2026-07-12T23:59:59',
  th: 1,
  title: '미션',
};

afterEach(() => {
  mocks.patch.mockClear();
  mocks.post.mockClear();
  mocks.versionList = [];
});

describe('미션 저장 요청의 자료 버전 (2.5)', () => {
  describe('버전 있는 챌린지', () => {
    // 같은 자료를 공통과 대학생에 걸면 항목이 두 개다 (설계안 D5)
    const row = createRow(
      [contents(1, null), contents(1, 10)],
      [contents(2, 20)],
    );
    const expected = {
      essentialContents: [
        { contentsId: 1, challengeVersionId: null },
        { contentsId: 1, challengeVersionId: 10 },
      ],
      additionalContents: [{ contentsId: 2, challengeVersionId: 20 }],
    };

    it('수정 요청에 essentialContents·additionalContents 를 담는다', async () => {
      mocks.versionList = VERSION_LIST;
      await runAction('edit', row);

      await waitFor(() => expect(mocks.patch).toHaveBeenCalledTimes(1));
      const [url, payload] = mocks.patch.mock.calls[0];
      expect(url).toBe('/mission/42');
      expect(payload).toMatchObject(expected);
    });

    it('생성 요청에 essentialContents·additionalContents 를 담는다', async () => {
      mocks.versionList = VERSION_LIST;
      await runAction('create', row);

      await waitFor(() => expect(mocks.post).toHaveBeenCalledTimes(1));
      const [url, payload] = mocks.post.mock.calls[0];
      expect(url).toBe('/mission/1');
      expect(payload).toMatchObject(expected);
    });
  });

  describe('버전 없는 챌린지', () => {
    const row = createRow([contents(1, null)], [contents(2, null)]);

    it('수정 요청이 기존 id 목록 요청과 같다', async () => {
      await runAction('edit', row);

      await waitFor(() => expect(mocks.patch).toHaveBeenCalledTimes(1));
      expect(mocks.patch.mock.calls[0][1]).toStrictEqual(LEGACY_PAYLOAD);
    });

    it('생성 요청이 기존 id 목록 요청과 같다', async () => {
      await runAction('create', row);

      await waitFor(() => expect(mocks.post).toHaveBeenCalledTimes(1));
      expect(mocks.post.mock.calls[0][1]).toStrictEqual(LEGACY_PAYLOAD);
    });
  });
});
