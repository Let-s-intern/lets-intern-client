/**
 * @jest-environment jsdom
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { useEffect } from 'react';

/*
  LC-3560 — 추가정보를 다 넣고 '대시보드 입장하기' 를 눌러도 대시보드로 넘어가지 않던 문제.
  레이아웃(ChallengeLayout)은 `['user', 'challenge-info']` 의 pass 로 이 화면에 보낼지 정한다.
  저장 뒤 그 캐시가 그대로면(기본 staleTime 60초) pass=false 를 다시 읽어 이 화면으로 되돌린다.
  그래서 이동하기 전에 그 캐시를 새로 받아야 한다.
*/

const routerPush = jest.fn();
jest.mock('next/navigation', () => ({
  useParams: () => ({ programId: '420', applicationId: '72' }),
  useRouter: () => ({ push: routerPush }),
}));

const patchUser = jest.fn().mockResolvedValue({ data: {} });
// 렌더마다 같은 객체여야 한다. 새 객체면 페이지의 [userData] effect 가 끝없이 돈다
const mockUserQuery = {
  data: {
    name: 'QA',
    university: '렛츠대학교',
    grade: 'FOURTH',
    major: '경영학',
    wishCompany: '렛츠커리어',
    wishEmploymentType: 'INTERN',
    wishField: '마케팅',
    wishJob: '퍼포먼스 마케터',
    wishIndustry: 'IT',
  },
};
jest.mock('@/api/user/user', () => ({
  useUserQuery: () => mockUserQuery,
  usePatchUser: () => ({ mutateAsync: patchUser, isPending: false }),
}));

const patchGoal = jest.fn().mockResolvedValue({ data: {} });
// 실제 모듈은 import.meta 를 쓰는 axios 설정을 끌어와 Jest 가 읽지 못한다. 쓰는 것만 둔다
jest.mock('@/api/challenge/challenge', () => ({
  userChallengeInfoQueryKey: ['user', 'challenge-info'],
  usePatchChallengeGoal: () => ({ mutateAsync: patchGoal }),
}));

jest.mock(
  '@/domain/challenge/my-challenge/mission/submit/MissionSubmitZeroSection',
  () => ({ DASHBOARD_FIRST_VISIT_GOAL: 'visit' }),
);

jest.mock('@/api/application', () => ({
  usePatchApplicationSurveyMutation: () => ({
    mutateAsync: jest.fn().mockResolvedValue({ data: {} }),
  }),
}));

// B2C 가 아니면 설문이 없다. 설문 없이 경력 정보만으로 버튼이 켜진다.
jest.mock('@/api/program', () => ({
  useProgramQuery: () => ({
    type: 'challenge',
    query: { data: { title: '경험정리 챌린지', adminClassificationInfo: [] } },
  }),
}));

// 경력 입력 폼은 이 테스트의 관심사가 아니다. 저장된 직군·직무·산업을 그대로 넘긴다.
jest.mock('@/domain/mypage/career/CareerInfoForm', () => ({
  __esModule: true,
  default: ({
    onSelectionsChange,
  }: {
    onSelectionsChange: (s: unknown) => void;
  }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      onSelectionsChange({
        selectedField: '마케팅',
        selectedPositions: ['퍼포먼스 마케터'],
        selectedIndustries: ['IT'],
      });
    }, [onSelectionsChange]);
    return null;
  },
}));

import ChallengeUserInfo from './page';

const CHALLENGE_INFO_KEY = ['user', 'challenge-info'];

const renderPage = (queryClient: QueryClient) =>
  render(
    <QueryClientProvider client={queryClient}>
      <ChallengeUserInfo />
    </QueryClientProvider>,
  );

beforeEach(() => {
  jest.clearAllMocks();
});

it('저장 뒤 challenge-info 를 새로 받은 다음 대시보드로 이동한다', async () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 60 * 1000 } },
  });
  // 이 화면에 오기 직전 레이아웃이 받아 둔 값: 아직 추가정보가 없다
  queryClient.setQueryData(CHALLENGE_INFO_KEY, { pass: false });
  const invalidate = jest.spyOn(queryClient, 'invalidateQueries');

  renderPage(queryClient);

  await act(async () => {
    fireEvent.click(await screen.findByText('대시보드 입장하기'));
  });

  expect(routerPush).toHaveBeenCalledWith('/challenge/72/420');
  const challengeInfoInvalidated = invalidate.mock.calls.some(
    ([filters]) =>
      JSON.stringify(filters?.queryKey) === JSON.stringify(CHALLENGE_INFO_KEY),
  );
  expect(challengeInfoInvalidated).toBe(true);
  // 새로 받기가 이동보다 먼저다
  const invalidateOrder = invalidate.mock.invocationCallOrder.at(-1) ?? 0;
  expect(invalidateOrder).toBeLessThan(routerPush.mock.invocationCallOrder[0]);
});
