import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { duplicateChallenge } from '@/api/challenge/challenge';
import ChallengeDuplicateModal from '../ChallengeDuplicateModal';

const { getChallenge } = vi.hoisted(() => ({ getChallenge: vi.fn() }));

vi.mock('@/api/file', () => ({
  fileType: { enum: { CHALLENGE: 'CHALLENGE' } },
  uploadFile: vi.fn(),
}));

vi.mock('@/api/program', () => ({ getChallenge }));
vi.mock('@/domain/admin/program/category/ui/CopiedTagsNote', () => ({
  default: () => null,
}));
vi.mock('@/api/challenge/challenge', () => ({ duplicateChallenge: vi.fn() }));

const renderModal = () =>
  render(
    <ChallengeDuplicateModal
      isOpen
      sourceChallenge={{ id: 418, title: '원본', thumbnail: null }}
      onClose={vi.fn()}
      onSuccess={vi.fn()}
    />,
  );

const typeTitle = (value: string) =>
  fireEvent.change(screen.getByPlaceholderText('챌린지 제목을 입력하세요.'), {
    target: { value },
  });

const thumbnailCheckbox = () =>
  screen.getByRole('checkbox', { name: '썸네일 자동 생성' });

const dashboardCheckbox = () =>
  screen.getByRole('checkbox', { name: '대시보드 함께 복제' });

const feedbackCheckbox = () =>
  screen.getByRole('checkbox', { name: '피드백 미션 여부 함께 복제' });

// 날짜 선택기를 채우지 않고 제출하려고 '이전 내용 그대로 가져오기' 를 켠다.
// 이 경우에도 대시보드 체크 상태는 그대로 전송된다.
const submitWithCopyContent = async () => {
  fireEvent.click(
    screen.getByRole('checkbox', { name: '이전 내용 그대로 가져오기' }),
  );
  fireEvent.click(screen.getByRole('button', { name: '복제하기' }));
  await waitFor(() => expect(duplicateChallenge).toHaveBeenCalledTimes(1));
  return vi.mocked(duplicateChallenge).mock.calls[0][1];
};

beforeEach(() => {
  getChallenge.mockReset();
  getChallenge.mockResolvedValue({
    challengeType: 'EXPERIENCE_SUMMARY',
    versionList: [],
  });
  vi.mocked(duplicateChallenge).mockReset();
  vi.mocked(duplicateChallenge).mockResolvedValue({ challengeId: 1 });
});

describe('ChallengeDuplicateModal', () => {
  it('열면 원본 상세를 한 번 조회한다', async () => {
    getChallenge.mockResolvedValue({
      challengeType: 'EXPERIENCE_SUMMARY',
      versionList: [],
    });

    renderModal();

    await waitFor(() => expect(getChallenge).toHaveBeenCalledTimes(1));
    expect(getChallenge).toHaveBeenCalledWith(418);
  });

  it('버전 있는 이력서는 제목에 [ ] 와 기수가 없어도 썸네일 자동 생성이 켜진다', async () => {
    getChallenge.mockResolvedValue({
      challengeType: 'CAREER_START',
      versionList: [{ challengeVersionId: 39, title: '대학생 Ver.' }],
    });

    renderModal();
    await waitFor(() => expect(getChallenge).toHaveBeenCalled());
    typeTitle('이력서 챌린지');

    await waitFor(() => expect(thumbnailCheckbox()).toBeEnabled());
    expect(screen.getByText(/버전마다/)).toBeInTheDocument();
  });

  it('비활성 이유를 한 줄로 보여 준다', async () => {
    getChallenge.mockResolvedValue({
      challengeType: 'PORTFOLIO',
      versionList: [],
    });

    renderModal();
    await waitFor(() => expect(getChallenge).toHaveBeenCalled());

    typeTitle('포트폴리오 완성 챌린지 43기');
    expect(
      await screen.findByText('제목에 주차(ex. 2주)가 없습니다.'),
    ).toBeInTheDocument();
    expect(thumbnailCheckbox()).toBeDisabled();

    typeTitle('포트폴리오 2주 완성 챌린지');
    await waitFor(() => expect(thumbnailCheckbox()).toBeEnabled());

    fireEvent.click(
      screen.getByRole('checkbox', { name: '이전 내용 그대로 가져오기' }),
    );
    expect(
      await screen.findByText(/이전 내용 그대로 가져오기"를 선택하면/),
    ).toBeInTheDocument();
  });

  describe('피드백 미션 여부 함께 복제', () => {
    it('대시보드 함께 복제가 꺼져 있으면 비활성이고 false 가 전송된다', async () => {
      renderModal();
      await waitFor(() => expect(getChallenge).toHaveBeenCalled());

      expect(feedbackCheckbox()).toBeDisabled();
      expect(feedbackCheckbox()).not.toBeChecked();

      const req = await submitWithCopyContent();
      expect(req.copyDashboard).toBe(false);
      expect(req.copyFeedbackMissions).toBe(false);
    });

    it('대시보드 함께 복제를 켜면 기본으로 켜지고 true 가 전송된다', async () => {
      renderModal();
      await waitFor(() => expect(getChallenge).toHaveBeenCalled());

      fireEvent.click(dashboardCheckbox());
      expect(feedbackCheckbox()).toBeEnabled();
      expect(feedbackCheckbox()).toBeChecked();

      const req = await submitWithCopyContent();
      expect(req.copyDashboard).toBe(true);
      expect(req.copyFeedbackMissions).toBe(true);
    });

    it('체크를 끄면 false 가 전송된다', async () => {
      renderModal();
      await waitFor(() => expect(getChallenge).toHaveBeenCalled());

      fireEvent.click(dashboardCheckbox());
      fireEvent.click(feedbackCheckbox());
      expect(feedbackCheckbox()).not.toBeChecked();

      const req = await submitWithCopyContent();
      expect(req.copyDashboard).toBe(true);
      expect(req.copyFeedbackMissions).toBe(false);
    });

    it('대시보드를 껐다 다시 켜면 피드백 체크가 기본값(켜짐)으로 돌아온다', async () => {
      renderModal();
      await waitFor(() => expect(getChallenge).toHaveBeenCalled());

      fireEvent.click(dashboardCheckbox());
      fireEvent.click(feedbackCheckbox());
      fireEvent.click(dashboardCheckbox());
      expect(feedbackCheckbox()).toBeDisabled();

      fireEvent.click(dashboardCheckbox());
      expect(feedbackCheckbox()).toBeChecked();
    });

    it('이전 내용 그대로 가져오기를 켜면 비활성이 된다', async () => {
      renderModal();
      await waitFor(() => expect(getChallenge).toHaveBeenCalled());

      fireEvent.click(dashboardCheckbox());
      expect(feedbackCheckbox()).toBeEnabled();

      fireEvent.click(
        screen.getByRole('checkbox', { name: '이전 내용 그대로 가져오기' }),
      );
      expect(feedbackCheckbox()).toBeDisabled();
    });
  });
});

describe('ChallengeDuplicateModal 일정 기본 시각', () => {
  // 달력에서 고를 수 있는 미래 날짜가 되도록 오늘을 고정한다
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-11-10T09:00:00'));
    getChallenge.mockResolvedValue({
      challengeType: 'EXPERIENCE_SUMMARY',
      versionList: [],
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // 입력칸은 제목, 모집 시작일, 모집 종료일, 챌린지 시작일 순서다
  const dateInput = (label: '모집 종료일' | '챌린지 시작일') =>
    screen.getAllByRole<HTMLInputElement>('textbox')[
      label === '모집 종료일' ? 2 : 3
    ];

  // 달력 버튼은 모집 시작일, 모집 종료일, 챌린지 시작일 순서다
  const pickDay = (label: '모집 종료일' | '챌린지 시작일', day: string) => {
    fireEvent.click(
      screen.getAllByRole('button', { name: /Choose date/ })[
        label === '모집 종료일' ? 1 : 2
      ],
    );
    fireEvent.click(screen.getByRole('gridcell', { name: day }));
  };

  it('날짜 칸은 비워 둔 채로 시작한다', async () => {
    renderModal();
    await waitFor(() => expect(getChallenge).toHaveBeenCalled());

    expect(dateInput('모집 종료일')).toHaveValue('');
    expect(dateInput('챌린지 시작일')).toHaveValue('');
  });

  it('모집 종료일을 처음 고르면 23:59 가 붙는다', async () => {
    renderModal();
    await waitFor(() => expect(getChallenge).toHaveBeenCalled());

    pickDay('모집 종료일', '20');

    expect(dateInput('모집 종료일')).toHaveValue('2026.11.20(Fr) 23:59');
  });

  it('챌린지 시작일을 처음 고르면 11:00 이 붙는다', async () => {
    renderModal();
    await waitFor(() => expect(getChallenge).toHaveBeenCalled());

    pickDay('챌린지 시작일', '20');

    expect(dateInput('챌린지 시작일')).toHaveValue('2026.11.20(Fr) 11:00');
  });

  it('처음 고른 뒤에 바꾼 시각과 날짜는 그대로 유지된다', async () => {
    renderModal();
    await waitFor(() => expect(getChallenge).toHaveBeenCalled());
    pickDay('모집 종료일', '20');

    fireEvent.change(dateInput('모집 종료일'), {
      target: { value: '2026.11.20(Fr) 18:30' },
    });
    expect(dateInput('모집 종료일')).toHaveValue('2026.11.20(Fr) 18:30');

    pickDay('모집 종료일', '25');
    expect(dateInput('모집 종료일')).toHaveValue('2026.11.25(We) 18:30');
  });
});
