import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import ChallengeDuplicateModal from '../ChallengeDuplicateModal';

const { getChallenge } = vi.hoisted(() => ({ getChallenge: vi.fn() }));

vi.mock('@/api/file', () => ({
  fileType: { enum: { CHALLENGE: 'CHALLENGE' } },
  uploadFile: vi.fn(),
}));

vi.mock('@/api/program', () => ({ getChallenge }));
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

beforeEach(() => {
  getChallenge.mockReset();
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

  it('버전 있는 이력서는 제목에 [ ] 가 없어도 썸네일 자동 생성이 켜진다', async () => {
    getChallenge.mockResolvedValue({
      challengeType: 'CAREER_START',
      versionList: [{ challengeVersionId: 39, title: '대학생 Ver.' }],
    });

    renderModal();
    await waitFor(() => expect(getChallenge).toHaveBeenCalled());
    typeTitle('이력서 챌린지 10기');

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

    typeTitle('포트폴리오 완성 챌린지');
    expect(
      await screen.findByText('제목에 기수(ex. 32기)가 없습니다.'),
    ).toBeInTheDocument();
    expect(thumbnailCheckbox()).toBeDisabled();

    typeTitle('포트폴리오 완성 챌린지 43기');
    expect(
      await screen.findByText('제목에 주차(ex. 2주)가 없습니다.'),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('checkbox', { name: '이전 내용 그대로 가져오기' }),
    );
    expect(
      await screen.findByText(/이전 내용 그대로 가져오기"를 선택하면/),
    ).toBeInTheDocument();
  });
});
