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
jest.mock('@/context/CurrentChallengeProvider', () => ({
  useCurrentChallenge: () => ({
    currentChallenge: { endDate: '2099-01-01T00:00:00' },
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
