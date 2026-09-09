import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

/*
 * 이 화면의 유일한 치명적 실패는 "흐린 미리보기를 보고 저장했는데 선명한 원본이 올라가는
 * 것" 이다. 그래서 검증의 중심은 업로드에 **어떤 File 이 넘어갔는가** 하나다.
 *
 * 블러 자체는 canvas 라 jsdom 에서 돌지 않는다. `blurImageFile` 을 갈아끼워 호출 관계만 본다.
 */

const uploadFileMock = vi.fn();
const blurImageFileMock = vi.fn();

vi.mock('@/api/file', () => ({
  uploadFile: (args: unknown) => uploadFileMock(args),
}));

vi.mock('../blurImage', () => ({
  blurImageFile: (file: File) => blurImageFileMock(file),
}));

import ProfileImageUploadModal from '../ui/ProfileImageUploadModal';

const ORIGINAL = new File(['원본'], 'photo.png', { type: 'image/png' });
const BLURRED = new File(['흐림'], 'photo.jpg', { type: 'image/jpeg' });

const onUploaded = vi.fn();
const onClose = vi.fn();

const renderModal = () =>
  render(
    <ProfileImageUploadModal
      isOpen
      onClose={onClose}
      onUploaded={onUploaded}
    />,
  );

/**
 * 숨은 file input 은 라벨(드롭존) 안에 있어 role 로 잡히지 않는다.
 * 모달은 `ModalPortal` 로 body 에 붙으므로 render 가 준 container 밖에 있다.
 */
const selectFile = (file: File) => {
  const input = document.querySelector<HTMLInputElement>('input[type="file"]')!;
  fireEvent.change(input, { target: { files: [file] } });
};

const toggleBlur = () =>
  fireEvent.click(screen.getByRole('switch', { name: '이미지 블러처리하기' }));

const save = () => fireEvent.click(screen.getByText('저장하기'));

beforeEach(() => {
  vi.clearAllMocks();
  uploadFileMock.mockResolvedValue('https://s3/user/profile_photo.jpg');
  blurImageFileMock.mockResolvedValue(BLURRED);
  globalThis.URL.createObjectURL = vi.fn(() => 'blob:preview');
  globalThis.URL.revokeObjectURL = vi.fn();
});

describe('ProfileImageUploadModal', () => {
  it('토글이 꺼져 있으면 원본을 그대로 올린다', async () => {
    renderModal();
    selectFile(ORIGINAL);

    await waitFor(() => expect(screen.getByText('저장하기')).toBeEnabled());
    save();

    await waitFor(() =>
      expect(uploadFileMock).toHaveBeenCalledWith({
        file: ORIGINAL,
        type: 'USER_PROFILE',
      }),
    );
    expect(blurImageFileMock).not.toHaveBeenCalled();
  });

  it('토글을 켜면 블러가 구워진 파일이 올라간다', async () => {
    renderModal();
    selectFile(ORIGINAL);
    toggleBlur();

    await waitFor(() =>
      expect(blurImageFileMock).toHaveBeenCalledWith(ORIGINAL),
    );
    save();

    await waitFor(() =>
      expect(uploadFileMock).toHaveBeenCalledWith({
        file: BLURRED,
        type: 'USER_PROFILE',
      }),
    );
  });

  /*
   * 블러가 실패했을 때 원본으로 되돌아가면, 멘토는 흐릴 줄 알았던 사진이 올라간 것을
   * 알 방법이 없다. 업로드 자체가 막혀야 한다.
   */
  it('블러에 실패하면 아무것도 올리지 않는다', async () => {
    blurImageFileMock.mockRejectedValue(new Error('디코드 실패'));

    renderModal();
    selectFile(ORIGINAL);
    toggleBlur();

    await waitFor(() =>
      expect(
        screen.getByText(/이미지를 처리하지 못했어요/),
      ).toBeInTheDocument(),
    );
    expect(screen.getByText('저장하기')).toBeDisabled();

    save();
    expect(uploadFileMock).not.toHaveBeenCalled();
  });

  it('용량이 넘치면 고르는 단계에서 막는다', async () => {
    const big = new File([], 'big.jpg', { type: 'image/jpeg' });
    Object.defineProperty(big, 'size', { value: 6 * 1024 * 1024 });

    renderModal();
    selectFile(big);

    expect(await screen.findByText(/용량이 너무 커요/)).toBeInTheDocument();
    expect(screen.getByText('저장하기')).toBeDisabled();
  });

  it('업로드에 성공하면 받은 URL 을 상위로 올리고 닫는다', async () => {
    renderModal();
    selectFile(ORIGINAL);

    await waitFor(() => expect(screen.getByText('저장하기')).toBeEnabled());
    save();

    await waitFor(() =>
      expect(onUploaded).toHaveBeenCalledWith(
        'https://s3/user/profile_photo.jpg',
      ),
    );
    expect(onClose).toHaveBeenCalled();
  });
});
