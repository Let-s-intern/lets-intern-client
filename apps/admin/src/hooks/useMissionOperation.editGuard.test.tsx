import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import dayjs from '@/lib/dayjs';
import { Row } from '@/types/interface';

const patchMock = vi.fn().mockResolvedValue({ data: {} });

vi.mock('@/utils/axios', () => ({
  default: {
    patch: (...args: unknown[]) => patchMock(...args),
    post: vi.fn().mockResolvedValue({ data: {} }),
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

const refetchMock = vi.fn();
vi.mock('@/context/CurrentAdminChallengeProvider', () => ({
  useAdminCurrentChallenge: () => ({ currentChallenge: { id: 1 } }),
  useAdminMissionsOfCurrentChallenge: () => [],
  useMissionsOfCurrentChallengeRefetch: () => refetchMock,
}));

const snackbarMock = vi.fn();
vi.mock('@/hooks/useAdminSnackbar', () => ({
  useAdminSnackbar: () => ({ snackbar: snackbarMock }),
}));

import { useMissionOperations } from './useMissionOperation';

const createWrapper = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
};

afterEach(() => {
  patchMock.mockClear();
  snackbarMock.mockClear();
});

describe('미션 edit 저장 가드 (1.3)', () => {
  it('템플릿 미해석 상태에서도 일자 편집 PATCH 를 보내고 title 은 생략한다', async () => {
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

    // missionTemplateId 는 있으나 옵션 목록에 없어 title 이 해석되지 않는 미션
    const row = {
      id: 42,
      missionTemplateId: 999,
      missionTemplatesOptions: [],
      additionalContentsList: [],
      essentialContentsList: [],
      lateScore: 5,
      score: 10,
      th: 1,
      missionType: null,
      startDate: dayjs('2026-07-10T09:00:00'),
      endDate: dayjs('2026-07-12T23:59:00'),
    } as unknown as Row;

    await act(async () => {
      await result.current.onAction({ action: 'edit', row });
    });

    await waitFor(() => expect(patchMock).toHaveBeenCalledTimes(1));

    const [url, payload] = patchMock.mock.calls[0];
    expect(url).toBe('/mission/42');
    expect(payload).not.toHaveProperty('title');
    expect(payload.startDate).toBe('2026-07-10T09:00:00');
    expect(payload.endDate).toBe('2026-07-12T23:59:59');
    // 미해석 차단 스낵바가 뜨지 않아야 한다.
    expect(snackbarMock).not.toHaveBeenCalledWith(
      '존재하지 않거나 삭제된 미션 템플릿입니다. 다른 템플릿을 선택해주세요.',
    );
  });
});
