import { render, screen } from '@testing-library/react';
import GuidebookListContent from './GuidebookListContent';

let mockAuth = { isLoggedIn: true, isInitialized: true };
let mockQuery: { data?: unknown[]; isError: boolean } = { isError: false };
let mockQueryEnabled: boolean | undefined;

jest.mock('@/store/useAuthStore', () => ({
  __esModule: true,
  default: () => mockAuth,
}));
jest.mock('@tanstack/react-query', () => ({
  useQuery: (options: { enabled?: boolean }) => {
    mockQueryEnabled = options.enabled;
    return mockQuery;
  },
}));
jest.mock('@/api/application', () => ({
  mypageApplicationsQueryOptions: { queryKey: ['mypageApplications'] },
}));
jest.mock('@/common/loading/LoadingContainer', () => ({
  __esModule: true,
  default: () => <div data-testid="loading" />,
}));
jest.mock('./section/GuidebookSection', () => ({
  __esModule: true,
  default: ({
    applicationList,
  }: {
    applicationList: { id: number; programType: string }[];
  }) => (
    <ul data-testid="guidebook-section">
      {applicationList.map((application) => (
        <li
          key={application.id}
        >{`${application.programType}-${application.id}`}</li>
      ))}
    </ul>
  ),
}));

describe('GuidebookListContent', () => {
  beforeEach(() => {
    mockAuth = { isLoggedIn: true, isInitialized: true };
    mockQuery = { isError: false };
    mockQueryEnabled = undefined;
  });

  it('신청 중 가이드북만 골라 GuidebookSection 에 넘긴다', () => {
    mockQuery = {
      isError: false,
      data: [
        { id: 1, programType: 'GUIDEBOOK' },
        { id: 2, programType: 'CHALLENGE' },
        { id: 3, programType: 'VOD' },
        { id: 4, programType: 'GUIDEBOOK' },
      ],
    };

    render(<GuidebookListContent />);

    expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual(
      ['GUIDEBOOK-1', 'GUIDEBOOK-4'],
    );
  });

  it('구매한 가이드북이 없어도 거르지 않고 빈 목록을 GuidebookSection 에 넘긴다', () => {
    mockQuery = { isError: false, data: [{ id: 2, programType: 'CHALLENGE' }] };

    render(<GuidebookListContent />);

    expect(screen.getByTestId('guidebook-section')).toBeEmptyDOMElement();
  });

  it('목록을 받는 동안 로딩을 보인다', () => {
    render(<GuidebookListContent />);

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('목록을 받지 못하면 안내를 보인다', () => {
    mockQuery = { isError: true };

    render(<GuidebookListContent />);

    expect(
      screen.getByText('구매한 가이드북을 불러오지 못했어요.'),
    ).toBeInTheDocument();
  });

  it('로그인했을 때만 목록을 요청한다', () => {
    render(<GuidebookListContent />);
    expect(mockQueryEnabled).toBe(true);
  });
});
