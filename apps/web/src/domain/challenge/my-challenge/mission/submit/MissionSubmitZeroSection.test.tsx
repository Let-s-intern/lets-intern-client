/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen } from '@testing-library/react';
// 패키지 entry(@letscareer/api) 는 env.ts 의 import.meta 때문에 jest 환경에서
// SyntaxError 가 발생한다. ApiError 클래스만 필요하므로 errors 서브경로를 직접
// import 해서 패키지 entry 로드를 우회한다 (package.json exports "./*").
import { ApiError } from '@letscareer/api/errors';

const mockParams: Record<string, string> = { programId: '12' };
jest.mock('next/navigation', () => ({
  useParams: () => mockParams,
  useSearchParams: () => new URLSearchParams(),
}));

const invalidateQueries = jest.fn();
jest.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({ invalidateQueries }),
}));

const refetchSchedules = jest.fn();
// 챗 링크는 케이스마다 달라진다. 목 팩토리는 호출 시점에 평가되므로 여기를 바꾸면 반영된다.
const mockCurrentChallenge: Record<string, unknown> = {
  endDate: '2099-01-01T00:00:00',
};
jest.mock('@/context/CurrentChallengeProvider', () => ({
  useCurrentChallenge: () => ({
    currentChallenge: mockCurrentChallenge,
    refetchSchedules,
  }),
}));

const submitMissionMutate = jest.fn();
jest.mock('@/domain/challenge/api/attendance', () => ({
  useSubmitMission: () => ({ mutateAsync: submitMissionMutate }),
}));

const submitGoalMutate = jest.fn();
jest.mock('@/api/challenge/challenge', () => ({
  ChallengeMissionQueryKey: 'ChallengeMissionQueryKey',
  useGetChallengeGoal: () => ({ data: undefined, isLoading: false }),
  useSubmitChallengeGoal: () => ({ mutateAsync: submitGoalMutate }),
}));

import MissionSubmitZeroSection from './MissionSubmitZeroSection';

const conflictAttendanceError = () =>
  new ApiError({
    code: 'CONFLICT_ATTENDANCE',
    message: '이미 제출한 출석 내역이 존재합니다',
    status: 409,
    endpoint: '/attendance/34',
    method: 'POST',
  });

const renderSection = () => render(<MissionSubmitZeroSection missionId={34} />);

const submitButton = () =>
  screen.getByRole('button', { name: /제출하기|제출 완료/ });

beforeEach(() => {
  jest.clearAllMocks();
});

describe('MissionSubmitZeroSection — 0회차 미션 제출', () => {
  // LC-3232 — 출석은 성공했는데 목표 저장만 실패하면, 버튼이 "제출하기"로
  // 남아 있어 사용자가 다시 누르게 된다. 재시도에서 출석 생성이
  // CONFLICT_ATTENDANCE(이미 존재)로 거부되는 게 이 시나리오의 핵심이다.
  it('출석은 성공하고 목표 저장만 실패하면 에러를 보여주고 제출완료로 바뀌지 않는다', async () => {
    submitMissionMutate.mockResolvedValueOnce(undefined);
    submitGoalMutate.mockRejectedValueOnce(new Error('네트워크 오류'));
    renderSection();

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: '목표를 적었습니다' },
    });
    fireEvent.click(submitButton());
    await screen.findByText('제출에 실패했습니다. 다시 시도해주세요.');

    expect(submitButton()).toHaveTextContent('제출하기');
  });

  it('재시도에서 출석이 CONFLICT_ATTENDANCE 로 거부돼도 그 실패를 무시하고 목표 저장을 이어가 제출완료로 바뀐다', async () => {
    // 직전 시도에서 출석은 이미 성공했다 — 이번 시도는 그 재시도다.
    submitMissionMutate.mockRejectedValueOnce(conflictAttendanceError());
    submitGoalMutate.mockResolvedValueOnce(undefined);
    renderSection();

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: '목표를 적었습니다' },
    });
    fireEvent.click(submitButton());
    await screen.findByRole('button', { name: '제출 완료' });

    expect(submitGoalMutate).toHaveBeenCalledWith({
      challengeId: '12',
      goal: '목표를 적었습니다',
    });
    expect(
      screen.queryByText('제출에 실패했습니다. 다시 시도해주세요.'),
    ).not.toBeInTheDocument();
  });

  it('CONFLICT_ATTENDANCE 가 아닌 다른 이유로 출석이 실패하면 여전히 에러를 보여준다', async () => {
    submitMissionMutate.mockRejectedValueOnce(new Error('서버 오류'));
    renderSection();

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: '목표를 적었습니다' },
    });
    fireEvent.click(submitButton());
    await screen.findByText('제출에 실패했습니다. 다시 시도해주세요.');

    expect(submitGoalMutate).not.toHaveBeenCalled();
    expect(submitButton()).toHaveTextContent('제출하기');
  });
});

/*
  chatLink 는 어드민이 자유 URL 로 넣는다. 슬랙 링크를 넣어 둔 챌린지에서 "카카오톡
  오픈채팅방에 공유하라" 고 안내하면 참여자가 없는 곳을 찾아가게 된다.
*/
describe('MissionSubmitZeroSection — 채팅방 안내와 입장 버튼', () => {
  afterEach(() => {
    delete mockCurrentChallenge.chatLink;
    delete mockCurrentChallenge.chatPassword;
  });

  it('카카오톡 링크면 카카오톡으로 안내하고 오픈채팅방 입장 버튼을 보여준다', () => {
    mockCurrentChallenge.chatLink = 'https://open.kakao.com/o/abc123';
    renderSection();

    expect(
      screen.getByText(/카카오톡 오픈채팅방에 공유해주세요/),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '오픈채팅방 입장하기' }),
    ).toBeInTheDocument();
  });

  it('슬랙 링크면 슬랙으로 안내하고 슬랙 채널 입장 버튼을 보여준다', () => {
    mockCurrentChallenge.chatLink =
      'https://join.slack.com/t/abc/shared_invite/xyz';
    renderSection();

    expect(screen.getByText(/슬랙 채널에 공유해주세요/)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '슬랙 채널 입장하기' }),
    ).toBeInTheDocument();
  });

  /* 링크를 안 넣은 챌린지도 있다. 버튼만 감추고 공유 안내는 남긴다. */
  it('링크가 없으면 입장 버튼을 보여주지 않는다', () => {
    renderSection();

    expect(
      screen.getByText(/카카오톡 오픈채팅방에 공유해주세요/),
    ).toBeInTheDocument();
    expect(screen.queryByText(/입장하기$/)).not.toBeInTheDocument();
  });

  /* 참여코드가 있으면 새 탭으로 보내기 전에 코드를 복사할 기회를 준다. */
  it('참여코드가 있으면 바로 열지 않고 코드 모달을 띄운다', () => {
    mockCurrentChallenge.chatLink = 'https://open.kakao.com/o/abc123';
    mockCurrentChallenge.chatPassword = '1234';
    const open = jest.spyOn(window, 'open').mockReturnValue(null);
    renderSection();

    fireEvent.click(
      screen.getByRole('button', { name: '오픈채팅방 입장하기' }),
    );

    expect(open).not.toHaveBeenCalled();
    expect(screen.getByText('오픈채팅방 참여코드')).toBeInTheDocument();
    expect(screen.getByText('1234')).toBeInTheDocument();
    open.mockRestore();
  });
});
