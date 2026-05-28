/**
 * @jest-environment jsdom
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import axios from '@/utils/axios';
import { useMentorChallengeListQuery } from '@/api/user/user';
import useAuthStore from '@/store/useAuthStore';

import MenteeChatLauncher from './MenteeChatLauncher';

// 채팅 UI 패키지는 PocketBase 클라이언트를 끌어오므로 스텁으로 대체.
// 여기서는 래퍼의 로그인 게이트·feedbackIds 주입·모달 open 만 검증한다.
jest.mock('@letscareer/chat/ui/ChatFloatingButton', () => ({
  __esModule: true,
  default: ({
    feedbackIds,
    onOpen,
  }: {
    feedbackIds: number[];
    onOpen: () => void;
  }) => (
    <button
      type="button"
      data-testid="chat-fab"
      data-feedback-ids={feedbackIds.join(',')}
      onClick={onOpen}
    >
      채팅 열기
    </button>
  ),
}));

jest.mock('@letscareer/chat/ui/ChatModal', () => ({
  __esModule: true,
  default: ({ rooms }: { rooms: { feedbackId: number }[] }) => (
    <div
      data-testid="chat-modal"
      data-room-ids={rooms.map((r) => r.feedbackId).join(',')}
    />
  ),
}));

jest.mock('@/utils/axios', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));
jest.mock('@/api/user/user', () => ({
  __esModule: true,
  useMentorChallengeListQuery: jest.fn(),
}));
jest.mock('@/store/useAuthStore', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockedAxiosGet = axios.get as jest.Mock;
const mockedChallengeListQuery = useMentorChallengeListQuery as jest.Mock;
const mockedAuthStore = useAuthStore as unknown as jest.Mock;

function setLoggedIn(isLoggedIn: boolean) {
  // 컴포넌트는 useAuthStore((s) => s.isLoggedIn) 형태로 selector 를 쓴다.
  mockedAuthStore.mockImplementation((selector: (s: unknown) => unknown) =>
    selector({ isLoggedIn }),
  );
}

function makeFeedbackItem(feedbackId: number | null, missionTh: number) {
  return {
    thumbnail: '',
    desktopThumbnail: '',
    missionTitle: `미션 ${missionTh}`,
    missionId: 100 + missionTh,
    missionTh,
    missionStartDate: '2026-05-01',
    missionEndDate: '2026-05-03',
    feedbackId,
    feedbackStatus: feedbackId == null ? null : 'RESERVED',
    attendanceStatus: null,
    mentorInfo: {
      nickname: '김멘토',
      introduction: '소개',
      profileImgUrl: '',
    },
  };
}

function renderLauncher() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MenteeChatLauncher />
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  mockedChallengeListQuery.mockReturnValue({ data: undefined });
  mockedAxiosGet.mockResolvedValue({
    data: { data: { liveFeedbackList: [] } },
  });
});

describe('MenteeChatLauncher — 멘티 전역 채팅 런처', () => {
  it('비로그인 시 아무것도 렌더하지 않는다', () => {
    setLoggedIn(false);
    renderLauncher();
    expect(screen.queryByTestId('chat-fab')).not.toBeInTheDocument();
  });

  it('로그인했지만 라이브 피드백 방이 없으면 렌더하지 않는다', async () => {
    setLoggedIn(true);
    mockedChallengeListQuery.mockReturnValue({
      data: {
        myChallengeMentorVoList: [
          {
            challengeMentorId: 1,
            challengeId: 11,
            programStatusType: 'PROGRESS',
            title: '챌린지A',
            shortDesc: '',
            thumbnail: '',
            startDate: '2026-05-01',
            endDate: '2026-05-30',
          },
        ],
      },
    });
    // feedbackId 가 없는 항목만 → 방 0개
    mockedAxiosGet.mockResolvedValue({
      data: { data: { liveFeedbackList: [makeFeedbackItem(null, 1)] } },
    });

    renderLauncher();

    // 비동기 쿼리 resolve 이후에도 버튼이 나타나지 않아야 한다.
    await Promise.resolve();
    expect(screen.queryByTestId('chat-fab')).not.toBeInTheDocument();
  });

  it('로그인 + 방 보유 시 feedbackIds 를 주입해 플로팅 버튼을 렌더하고, 클릭 시 모달이 열린다', async () => {
    setLoggedIn(true);
    mockedChallengeListQuery.mockReturnValue({
      data: {
        myChallengeMentorVoList: [
          {
            challengeMentorId: 1,
            challengeId: 11,
            programStatusType: 'PROGRESS',
            title: '챌린지A',
            shortDesc: '',
            thumbnail: '',
            startDate: '2026-05-01',
            endDate: '2026-05-30',
          },
        ],
      },
    });
    mockedAxiosGet.mockResolvedValue({
      data: {
        data: {
          liveFeedbackList: [
            makeFeedbackItem(4242, 1),
            makeFeedbackItem(null, 2),
            makeFeedbackItem(4343, 3),
          ],
        },
      },
    });

    renderLauncher();

    const fab = await screen.findByTestId('chat-fab');
    // feedbackId 보유 항목(4242, 4343)만 방으로 주입된다.
    expect(fab).toHaveAttribute('data-feedback-ids', '4242,4343');
    expect(screen.queryByTestId('chat-modal')).not.toBeInTheDocument();

    await userEvent.click(fab);
    const modal = await screen.findByTestId('chat-modal');
    expect(modal).toHaveAttribute('data-room-ids', '4242,4343');
  });
});
