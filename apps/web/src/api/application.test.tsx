import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

import { getChallengeIdPrimitiveSchema } from '@/schema';
import axios from '@/utils/axios';

import {
  applicationVersionSchema,
  mypageApplicationsSchema,
  useApplicationVersionQuery,
  usePatchApplicationVersionMutation,
} from './application';

// application.ts 가 @letscareer/api(import.meta 사용)를 임포트 그래프로 물고 있어 모킹한다.
jest.mock('@letscareer/api', () => ({
  createDefaultAxios: jest.fn(() => ({})),
  createV2Axios: jest.fn(() => ({})),
  fetchJson: jest.fn(),
}));
jest.mock('@/utils/axios', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), patch: jest.fn() },
}));
jest.mock('@/utils/axiosV2', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), patch: jest.fn() },
}));

const axiosGet = axios.get as jest.Mock;
const axiosPatch = axios.patch as jest.Mock;

function newClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
}

function createWrapper(client: QueryClient) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'QueryWrapper';
  return Wrapper;
}

beforeEach(() => {
  axiosGet.mockReset();
  axiosPatch.mockReset();
});

describe('getChallengeIdPrimitiveSchema - versionList', () => {
  const challengeDetail = {
    challengeType: 'CAREER_START',
    classificationInfo: [],
    priceInfo: [],
    faqInfo: [],
  };

  it('필드가 없는 응답은 빈 목록이다 - 서버 배포 전', () => {
    expect(
      getChallengeIdPrimitiveSchema.parse(challengeDetail).versionList,
    ).toEqual([]);
  });

  it('null 이어도 빈 목록이다', () => {
    expect(
      getChallengeIdPrimitiveSchema.parse({
        ...challengeDetail,
        versionList: null,
      }).versionList,
    ).toEqual([]);
  });

  it('버전 목록을 그대로 읽는다', () => {
    const versionList = [
      { challengeVersionId: 1, title: 'IT', sortOrder: 0 },
      { challengeVersionId: 2, title: '마케팅', sortOrder: 1 },
    ];

    expect(
      getChallengeIdPrimitiveSchema.parse({ ...challengeDetail, versionList })
        .versionList,
    ).toEqual(versionList);
  });
});

describe('mypageApplicationsSchema - 버전 필드', () => {
  const parseFirst = (application: Record<string, unknown>) =>
    mypageApplicationsSchema.parse({ applicationList: [application] })
      .applicationList[0];

  it('필드가 없는 응답은 버전명 null, 변경 불가다', () => {
    expect(parseFirst({ id: 1, programType: 'CHALLENGE' })).toMatchObject({
      challengeVersionTitle: null,
      canChangeVersion: false,
    });
  });

  it('canChangeVersion 이 null 이면 변경 불가다 - 챌린지가 아닌 신청', () => {
    expect(
      parseFirst({ id: 1, programType: 'LIVE', canChangeVersion: null })
        .canChangeVersion,
    ).toBe(false);
  });

  it('값이 있으면 그대로 읽는다', () => {
    expect(
      parseFirst({
        id: 1,
        programType: 'CHALLENGE',
        challengeVersionTitle: 'IT',
        canChangeVersion: true,
      }),
    ).toMatchObject({ challengeVersionTitle: 'IT', canChangeVersion: true });
  });
});

describe('applicationVersionSchema', () => {
  const versionList = [
    { challengeVersionId: 1, title: 'IT' },
    { challengeVersionId: 2, title: '마케팅' },
  ];

  it('변경 가능한 응답을 읽는다', () => {
    const response = {
      currentVersion: { challengeVersionId: 1, title: 'IT' },
      versionList,
      deadline: '2026-10-01T23:59:59',
      changeable: true,
      unavailableReason: null,
    };

    expect(applicationVersionSchema.parse(response)).toEqual(response);
  });

  it.each([
    'CANCELED',
    'LIGHT',
    'NO_VERSION',
    'ALREADY_CHANGED',
    'DEADLINE_PASSED',
  ])('변경 불가 사유 %s 를 읽는다', (unavailableReason) => {
    expect(
      applicationVersionSchema.parse({
        currentVersion: null,
        versionList: [],
        deadline: null,
        changeable: false,
        unavailableReason,
      }).unavailableReason,
    ).toBe(unavailableReason);
  });

  it('계약에 없는 사유는 거부한다', () => {
    expect(
      applicationVersionSchema.safeParse({
        versionList,
        changeable: false,
        unavailableReason: 'UNKNOWN',
      }).success,
    ).toBe(false);
  });
});

describe('useApplicationVersionQuery', () => {
  it('신청 id 로 버전을 조회한다', async () => {
    axiosGet.mockResolvedValue({
      data: {
        data: {
          currentVersion: { challengeVersionId: 1, title: 'IT' },
          versionList: [{ challengeVersionId: 1, title: 'IT' }],
          deadline: '2026-10-01T23:59:59',
          changeable: true,
          unavailableReason: null,
        },
      },
    });

    const { result } = renderHook(() => useApplicationVersionQuery('7'), {
      wrapper: createWrapper(newClient()),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(axiosGet).toHaveBeenCalledWith('/application/7/version');
    expect(result.current.data?.currentVersion?.title).toBe('IT');
  });

  it('신청 id 가 없으면 요청하지 않는다', () => {
    renderHook(() => useApplicationVersionQuery(null), {
      wrapper: createWrapper(newClient()),
    });

    expect(axiosGet).not.toHaveBeenCalled();
  });
});

describe('usePatchApplicationVersionMutation', () => {
  it('선택한 버전 id 를 본문에 실어 PATCH 한다', async () => {
    axiosPatch.mockResolvedValue({ data: { data: null } });

    const { result } = renderHook(() => usePatchApplicationVersionMutation(), {
      wrapper: createWrapper(newClient()),
    });

    result.current.mutate({ applicationId: 7, challengeVersionId: 2 });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(axiosPatch).toHaveBeenCalledWith('/application/7/version', {
      challengeVersionId: 2,
    });
  });

  it('성공하면 버전·마이페이지 신청·데일리 미션·미션 상세를 무효화한다', async () => {
    axiosPatch.mockResolvedValue({ data: { data: null } });
    const client = newClient();
    const invalidateQueries = jest.spyOn(client, 'invalidateQueries');

    const { result } = renderHook(() => usePatchApplicationVersionMutation(), {
      wrapper: createWrapper(client),
    });

    result.current.mutate({ applicationId: 7, challengeVersionId: 2 });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(
      invalidateQueries.mock.calls.map(([filters]) => filters?.queryKey),
    ).toEqual([
      ['useApplicationVersionQueryKey'],
      ['useMypageApplicationsQueryKey'],
      ['useChallengeDailyMission'],
      ['useChallengeMissionAttendanceInfo'],
    ]);
  });

  it('실패하면 무효화하지 않는다', async () => {
    axiosPatch.mockRejectedValue(
      new Error('버전은 한 번만 변경할 수 있습니다.'),
    );
    const client = newClient();
    const invalidateQueries = jest.spyOn(client, 'invalidateQueries');

    const { result } = renderHook(() => usePatchApplicationVersionMutation(), {
      wrapper: createWrapper(client),
    });

    result.current.mutate({ applicationId: 7, challengeVersionId: 2 });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(invalidateQueries).not.toHaveBeenCalled();
  });
});
