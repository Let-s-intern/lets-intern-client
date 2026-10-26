import type { MypageApplication } from '@/api/application';
import { render, screen } from '@testing-library/react';
import ApplicationContent from './ApplicationContent';

/*
  신청 현황 응답에 VOD 이용권(`VOD_PASS`) 행이 섞여 와도 프로그램 탭이 챌린지 카드로
  그리지 않는지 본다. 구간 컴포넌트는 받은 목록의 id 만 찍도록 바꿔 두고 본다.
*/
const mockApplications: MypageApplication[] = [];

jest.mock('@tanstack/react-query', () => ({
  __esModule: true,
  useSuspenseQuery: () => ({ data: mockApplications }),
}));

jest.mock('@/api/application', () => ({
  __esModule: true,
  mypageApplicationsQueryOptions: {},
}));

jest.mock('@/api/live-mentoring/liveMentoring', () => ({
  __esModule: true,
  useMyLiveMentoringApplicationsQuery: () => ({ data: undefined }),
}));

// 버전 변경 모달(LC-3247)은 `@letscareer/api` 를 끌고 오는데 jest 가 파싱하지 못한다. 이 테스트와 무관하다
jest.mock('@/domain/mypage/application/version/VersionChangeModal', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('@/domain/live-mentoring/constants', () => ({
  __esModule: true,
  SHOW_LIVE_MENTORING_NAV: false,
}));

jest.mock('@/domain/live-mentoring/question/QuestionModal', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('@/domain/mypage/application/section/VodPassSection', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('@letscareer/ui', () => ({
  __esModule: true,
  CategoryTabs: () => null,
}));

jest.mock('@/domain/mypage/application/section/ApplySection', () => ({
  __esModule: true,
  default: function ApplySectionMock({
    applicationList,
  }: {
    applicationList: { id?: number | null; programType?: string | null }[];
  }) {
    return (
      <ul>
        {applicationList.map((application) => (
          <li key={application.id}>
            {`${application.programType}-${application.id}`}
          </li>
        ))}
      </ul>
    );
  },
}));
jest.mock('@/domain/mypage/application/section/ParticipateSection', () => ({
  __esModule: true,
  default: function ParticipateSectionMock({
    applicationList,
  }: {
    applicationList: { id?: number | null; programType?: string | null }[];
  }) {
    return (
      <ul>
        {applicationList.map((application) => (
          <li key={application.id}>
            {`${application.programType}-${application.id}`}
          </li>
        ))}
      </ul>
    );
  },
}));
jest.mock('@/domain/mypage/application/section/CompleteSection', () => ({
  __esModule: true,
  default: function CompleteSectionMock({
    applicationList,
  }: {
    applicationList: { id?: number | null; programType?: string | null }[];
  }) {
    return (
      <ul>
        {applicationList.map((application) => (
          <li key={application.id}>
            {`${application.programType}-${application.id}`}
          </li>
        ))}
      </ul>
    );
  },
}));
jest.mock('@/domain/mypage/application/section/EmptySection', () => ({
  __esModule: true,
  default: () => <p>empty</p>,
}));
jest.mock('@/domain/mypage/application/section/GuidebookSection', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('@/domain/mypage/application/section/LaunchAlertSection', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('@/domain/mypage/application/section/LibrarySection', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('@/domain/mypage/application/section/MentoringSection', () => ({
  __esModule: true,
  default: () => null,
  resolvePhase: () => 'upcoming',
}));
jest.mock('@/domain/mypage/application/section/VodClassSection', () => ({
  __esModule: true,
  default: () => null,
}));

const makeApplication = (
  overrides: Partial<MypageApplication>,
): MypageApplication =>
  ({
    id: 1,
    programId: 1,
    programType: 'CHALLENGE',
    programStatusType: 'PROCEEDING',
    programTitle: '프로그램',
    pricePlanType: 'BASIC',
    challengeOptionList: [],
    canUpgradePlan: false,
    ...overrides,
  }) as MypageApplication;

describe('마이페이지 신청 현황 — VOD 이용권 행', () => {
  beforeEach(() => {
    mockApplications.length = 0;
  });

  it('VOD_PASS 행은 어느 구간에도 들어오지 않고 챌린지는 그대로 담긴다', () => {
    mockApplications.push(
      makeApplication({
        id: 1,
        programType: 'CHALLENGE',
        programStatusType: 'PROCEEDING',
      }),
      makeApplication({
        id: 2,
        programType: 'VOD_PASS',
        programStatusType: 'PROCEEDING',
      }),
      makeApplication({
        id: 3,
        programType: 'VOD_PASS',
        programStatusType: 'PREV',
      }),
      makeApplication({
        id: 4,
        programType: 'VOD_PASS',
        programStatusType: 'POST',
      }),
    );

    render(<ApplicationContent />);

    expect(screen.getByText('CHALLENGE-1')).toBeInTheDocument();
    expect(screen.queryByText(/VOD_PASS/)).not.toBeInTheDocument();
  });

  it('이용권 행만 있으면 빈 안내를 보인다', () => {
    mockApplications.push(
      makeApplication({
        id: 2,
        programType: 'VOD_PASS',
        programStatusType: 'PROCEEDING',
      }),
    );

    render(<ApplicationContent />);

    expect(screen.getByText('empty')).toBeInTheDocument();
  });
});
