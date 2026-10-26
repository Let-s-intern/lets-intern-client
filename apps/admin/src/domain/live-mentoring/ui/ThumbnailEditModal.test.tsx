import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { AdminLiveMentoring } from '@/api/live-mentoring/liveMentoringSchema';

const updateThumbnailMock = vi.fn();
const uploadFileMock = vi.fn();

vi.mock('@/api/live-mentoring/liveMentoring', () => ({
  useUpdateAdminLiveMentoringThumbnailMutation: () => ({
    mutate: updateThumbnailMock,
    isPending: false,
  }),
}));

vi.mock('@/api/file', () => ({
  uploadFile: (args: unknown) => uploadFileMock(args),
}));

import ThumbnailEditModal from './ThumbnailEditModal';

const row: AdminLiveMentoring = {
  liveMentoringId: 10,
  mentorId: 21,
  mentorNickname: '렛츠멘토',
  mentorProfileImage: 'https://cdn.test/profile.png',
  title: '이력서 피드백',
  thumbnail: 'https://cdn.test/old.png',
  status: 'APPROVED',
  categories: ['RESUME'],
  hasDetailPage: true,
  createDate: '2026-08-03T12:00:00',
  lastModifiedDate: '2026-08-03T12:00:00',
  currentOpening: null,
  upcomingParticipantCount: 0,
  mentorReviewCount: 0,
};

const renderModal = (overrides: Partial<AdminLiveMentoring> = {}) =>
  render(
    <ThumbnailEditModal
      row={{ ...row, ...overrides }}
      onClose={vi.fn()}
      onSaved={vi.fn()}
    />,
  );

afterEach(() => {
  updateThumbnailMock.mockReset();
  uploadFileMock.mockReset();
});

describe('ThumbnailEditModal', () => {
  it('권장 크기와 프로필 사진 대체 안내를 보여준다', () => {
    renderModal();

    expect(
      screen.getByText('권장 1080 x 842 px · JPG, PNG, WEBP · 최대 10MB'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('썸네일이 없으면 공개 화면에 프로필 사진이 표시됩니다.'),
    ).toBeInTheDocument();
  });

  it('바꾼 것이 없으면 저장할 수 없다', () => {
    renderModal();

    expect(screen.getByRole('button', { name: '저장' })).toBeDisabled();
  });

  it('삭제 후 저장하면 thumbnail: null 로 보낸다', () => {
    renderModal();

    fireEvent.click(screen.getByRole('button', { name: '삭제' }));
    expect(screen.getByText('없음(프로필 사진 사용)')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    expect(updateThumbnailMock.mock.calls[0][0]).toEqual({
      mentorId: 21,
      thumbnail: null,
    });
  });

  it('올린 이미지를 LIVE_MENTORING 유형으로 업로드하고 그 주소로 저장한다', async () => {
    uploadFileMock.mockResolvedValue('https://cdn.test/new.png');
    renderModal({ thumbnail: null });
    const file = new File([new Uint8Array(10)], 't.png', { type: 'image/png' });

    fireEvent.change(
      document.querySelector('input[type="file"]') as HTMLInputElement,
      { target: { files: [file] } },
    );
    await waitFor(() =>
      expect(screen.getByAltText('썸네일')).toHaveAttribute(
        'src',
        'https://cdn.test/new.png',
      ),
    );
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    expect(uploadFileMock).toHaveBeenCalledWith({
      file,
      type: 'LIVE_MENTORING',
    });
    expect(updateThumbnailMock.mock.calls[0][0]).toEqual({
      mentorId: 21,
      thumbnail: 'https://cdn.test/new.png',
    });
  });
});
