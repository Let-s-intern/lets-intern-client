import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const uploadFileMock = vi.fn();

vi.mock('@/api/file', () => ({
  uploadFile: (args: unknown) => uploadFileMock(args),
}));

import ImageField from '../ui/ImageField';

describe('ImageField', () => {
  it('멘토링 상세 페이지 이미지는 LIVE_MENTORING 타입으로 올린다', async () => {
    uploadFileMock.mockResolvedValue('https://cdn.test/a.png');
    const onChange = vi.fn();

    const { container } = render(
      <ImageField label="이미지" value={null} onChange={onChange} />,
    );

    const file = new File(['x'], 'a.png', { type: 'image/png' });
    fireEvent.change(container.querySelector('input[type="file"]')!, {
      target: { files: [file] },
    });

    await waitFor(() => expect(uploadFileMock).toHaveBeenCalledTimes(1));
    expect(uploadFileMock).toHaveBeenCalledWith({
      file,
      type: 'LIVE_MENTORING',
    });
    expect(onChange).toHaveBeenCalledWith('https://cdn.test/a.png');
  });

  it('업로드에 실패하면 다시 시도하라고 알린다', async () => {
    uploadFileMock.mockRejectedValue(new Error('500'));

    render(<ImageField label="이미지" value={null} onChange={vi.fn()} />);

    const file = new File(['x'], 'a.png', { type: 'image/png' });
    fireEvent.change(screen.getByLabelText('이미지 업로드'), {
      target: { files: [file] },
    });

    await waitFor(() =>
      expect(
        screen.getByText('업로드에 실패했습니다. 다시 시도해주세요.'),
      ).toBeVisible(),
    );
  });
});
