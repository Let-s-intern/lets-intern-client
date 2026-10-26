import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import ThumbnailField from '../ThumbnailField';

const uploadFileMock = vi.fn();

vi.mock('@/api/file', () => ({
  uploadFile: (args: unknown) => uploadFileMock(args),
}));

const PROFILE = 'https://cdn.test/profile.png';
const THUMBNAIL = 'https://cdn.test/thumbnail.png';

const fileOfSize = (bytes: number) =>
  new File([new Uint8Array(bytes)], 'thumb.png', { type: 'image/png' });

describe('ThumbnailField', () => {
  beforeEach(() => {
    uploadFileMock.mockReset();
  });

  it('미업로드 시 프로필 사진이 표시된다는 안내와 권장 크기를 보여준다', () => {
    render(
      <ThumbnailField value={null} profileImage={PROFILE} onChange={vi.fn()} />,
    );

    expect(
      screen.getByText('썸네일을 올리지 않으면 프로필 사진이 표시돼요.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('권장 1080 x 842 px · JPG, PNG, WEBP · 최대 10MB'),
    ).toBeInTheDocument();
  });

  it('썸네일이 없으면 프로필 사진을 대신 보여준다', () => {
    render(
      <ThumbnailField value={null} profileImage={PROFILE} onChange={vi.fn()} />,
    );

    expect(
      screen.getByAltText('썸네일 대신 표시되는 프로필 사진'),
    ).toHaveAttribute('src', PROFILE);
    expect(screen.queryByRole('button', { name: '삭제' })).toBeNull();
  });

  it('썸네일이 있으면 썸네일을 보여주고 삭제하면 null 로 바꾼다', () => {
    const onChange = vi.fn();
    render(
      <ThumbnailField
        value={THUMBNAIL}
        profileImage={PROFILE}
        onChange={onChange}
      />,
    );

    expect(screen.getByAltText('썸네일')).toHaveAttribute('src', THUMBNAIL);

    fireEvent.click(screen.getByRole('button', { name: '삭제' }));

    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('LIVE_MENTORING 유형으로 올리고 받은 주소를 넘긴다', async () => {
    uploadFileMock.mockResolvedValue(THUMBNAIL);
    const onChange = vi.fn();
    const { container } = render(
      <ThumbnailField value={null} profileImage={PROFILE} onChange={onChange} />,
    );
    const file = fileOfSize(1024);

    fireEvent.change(container.querySelector('input[type="file"]')!, {
      target: { files: [file] },
    });

    await waitFor(() => expect(onChange).toHaveBeenCalledWith(THUMBNAIL));
    expect(uploadFileMock).toHaveBeenCalledWith({
      file,
      type: 'LIVE_MENTORING',
    });
  });

  it('10MB 를 넘는 파일은 올리지 않고 이유를 알려준다', () => {
    const onChange = vi.fn();
    const { container } = render(
      <ThumbnailField value={null} profileImage={PROFILE} onChange={onChange} />,
    );

    fireEvent.change(container.querySelector('input[type="file"]')!, {
      target: { files: [fileOfSize(10 * 1024 * 1024 + 1)] },
    });

    expect(uploadFileMock).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByText(/용량이 너무 커요/)).toBeInTheDocument();
  });
});
