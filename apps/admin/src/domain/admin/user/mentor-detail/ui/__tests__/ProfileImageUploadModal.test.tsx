import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

/*
 * 이 화면의 치명적 실패는 하나다 — 화면에 보인 것과 다른 픽셀이 올라가는 것.
 * 흐릴 줄 알았는데 선명하거나, 얼굴에 맞춰 놨는데 다르게 잘리면 멘토는 알아챌 수 없다.
 * 그래서 검증의 중심은 "업로드가 캔버스에서 굳힌 File 로만 일어나는가" 다.
 *
 * 그리기 자체는 canvas 라 jsdom 에서 돌지 않는다. 모듈을 갈아끼워 호출 관계만 본다.
 */

/*
 * jsdom 에는 PointerEvent 가 없다. 폴리필하지 않으면 testing-library 가 좌표를 싣지 못해
 * clientX/clientY 가 undefined 로 들어오고, 드래그 환산이 통째로 NaN 이 된다.
 * 컴포넌트가 pointer 이벤트를 쓰는 것은 마우스와 터치를 한 벌로 다루기 위해서다.
 */
class PointerEventPolyfill extends MouseEvent {
  pointerId: number;

  constructor(type: string, params: MouseEventInit & { pointerId?: number }) {
    super(type, params);
    this.pointerId = params.pointerId ?? 1;
  }
}
globalThis.PointerEvent =
  PointerEventPolyfill as unknown as typeof globalThis.PointerEvent;

const uploadFileMock = vi.fn();
const decodeImageMock = vi.fn();
const renderProfileImageMock = vi.fn();
const canvasToFileMock = vi.fn();

vi.mock('@/api/file', () => ({
  uploadFile: (args: unknown) => uploadFileMock(args),
}));

vi.mock('../../utils/processProfileImage', async (importOriginal) => {
  // cropRect·CENTERED 같은 순수 계산은 진짜를 쓴다. 드래그 환산이 그 값에 얹혀 있다.
  const actual =
    await importOriginal<typeof import('../../utils/processProfileImage')>();
  return {
    ...actual,
    decodeImage: (file: File) => decodeImageMock(file),
    renderProfileImage: (...args: unknown[]) => renderProfileImageMock(...args),
    canvasToFile: (...args: unknown[]) => canvasToFileMock(...args),
  };
});

import ProfileImageUploadModal from '../ProfileImageUploadModal';

const ORIGINAL = new File(['원본'], 'photo.png', { type: 'image/png' });
/** 세로 사진. 위아래로 잘릴 여백이 있어 드래그가 의미를 가진다. */
const PORTRAIT_BITMAP = { width: 720, height: 900, close: vi.fn() };
const PROCESSED = new File(['결과'], 'photo.png', { type: 'image/png' });

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

const canvas = () => screen.getByLabelText('프로필 이미지 미리보기');
const toggleBlur = () =>
  fireEvent.click(screen.getByRole('switch', { name: '이미지 블러처리하기' }));
const save = () => fireEvent.click(screen.getByText('저장하기'));

/** 마지막으로 그린 옵션. 캔버스에 무엇이 그려졌는지가 곧 무엇이 올라갈지다. */
const lastRenderOptions = () =>
  renderProfileImageMock.mock.calls.at(-1)?.[2] as {
    framing: { x: number; y: number };
    blur: boolean;
  };

beforeEach(() => {
  vi.clearAllMocks();
  uploadFileMock.mockResolvedValue('https://s3/user/profile_photo.png');
  decodeImageMock.mockResolvedValue(PORTRAIT_BITMAP);
  canvasToFileMock.mockResolvedValue(PROCESSED);
  // jsdom 은 레이아웃을 계산하지 않는다. 드래그 환산에 쓰는 폭을 직접 준다.
  HTMLCanvasElement.prototype.getBoundingClientRect = () =>
    ({ width: 360, height: 360 }) as DOMRect;
  Element.prototype.setPointerCapture = vi.fn();
});

describe('ProfileImageUploadModal', () => {
  it('고른 이미지를 가운데에 맞춰 그린다', async () => {
    renderModal();
    selectFile(ORIGINAL);

    await waitFor(() => expect(renderProfileImageMock).toHaveBeenCalled());
    expect(lastRenderOptions()).toMatchObject({
      framing: { x: 0.5, y: 0.5 },
      blur: false,
    });
  });

  it('드래그하면 잘라낼 위치가 따라 움직인다', async () => {
    renderModal();
    selectFile(ORIGINAL);
    await waitFor(() => expect(renderProfileImageMock).toHaveBeenCalled());

    /*
     * 세로 720x900. 짧은 변 720 을 폭 360 에 담으므로 화면 1px = 원본 2px.
     * 위아래 여백은 180px. 아래로 45px 끌면 원본 90px = 여백의 0.5 만큼 위로 이동하므로
     * y 는 0.5 - 0.5 = 0 이 된다.
     */
    fireEvent.pointerDown(canvas(), { clientX: 100, clientY: 100 });
    fireEvent.pointerMove(canvas(), { clientX: 100, clientY: 145 });

    await waitFor(() =>
      expect(lastRenderOptions().framing.y).toBeCloseTo(0, 5),
    );
    // 세로 사진이라 좌우로는 움직이지 않는다.
    expect(lastRenderOptions().framing.x).toBe(0.5);
  });

  it('끝까지 끌어도 사진 밖으로 넘어가지 않는다', async () => {
    renderModal();
    selectFile(ORIGINAL);
    await waitFor(() => expect(renderProfileImageMock).toHaveBeenCalled());

    fireEvent.pointerDown(canvas(), { clientX: 0, clientY: 0 });
    fireEvent.pointerMove(canvas(), { clientX: 0, clientY: 9999 });

    await waitFor(() => expect(lastRenderOptions().framing.y).toBe(0));
  });

  it('토글을 켜면 블러를 켠 채로 다시 그린다', async () => {
    renderModal();
    selectFile(ORIGINAL);
    await waitFor(() => expect(renderProfileImageMock).toHaveBeenCalled());

    toggleBlur();

    await waitFor(() => expect(lastRenderOptions().blur).toBe(true));
  });

  it('캔버스에서 굳힌 파일만 업로드한다', async () => {
    renderModal();
    selectFile(ORIGINAL);
    await waitFor(() => expect(screen.getByText('저장하기')).toBeEnabled());

    save();

    await waitFor(() =>
      expect(uploadFileMock).toHaveBeenCalledWith({
        file: PROCESSED,
        type: 'USER_PROFILE',
      }),
    );
    expect(onUploaded).toHaveBeenCalledWith(
      'https://s3/user/profile_photo.png',
    );
    expect(onClose).toHaveBeenCalled();
  });

  /*
   * 디코드가 실패했을 때 원본을 그대로 올리면, 자르지도 흐리게 하지도 않은 사진이
   * 올라간다. 업로드 자체가 막혀야 한다.
   */
  it('이미지를 읽지 못하면 아무것도 올리지 않는다', async () => {
    decodeImageMock.mockRejectedValue(new Error('디코드 실패'));

    renderModal();
    selectFile(ORIGINAL);

    expect(
      await screen.findByText(/이미지를 읽지 못했어요/),
    ).toBeInTheDocument();
    expect(screen.getByText('저장하기')).toBeDisabled();

    save();
    expect(uploadFileMock).not.toHaveBeenCalled();
  });

  it('굳히기에 실패하면 올리지 않고 알린다', async () => {
    canvasToFileMock.mockRejectedValue(new Error('toBlob 실패'));

    renderModal();
    selectFile(ORIGINAL);
    await waitFor(() => expect(screen.getByText('저장하기')).toBeEnabled());

    save();

    expect(await screen.findByText(/업로드에 실패했어요/)).toBeInTheDocument();
    expect(uploadFileMock).not.toHaveBeenCalled();
  });

  it('용량이 넘치면 고르는 단계에서 막는다', async () => {
    const big = new File([], 'big.jpg', { type: 'image/jpeg' });
    Object.defineProperty(big, 'size', { value: 6 * 1024 * 1024 });

    renderModal();
    selectFile(big);

    expect(await screen.findByText(/용량이 너무 커요/)).toBeInTheDocument();
    expect(decodeImageMock).not.toHaveBeenCalled();
    expect(screen.getByText('저장하기')).toBeDisabled();
  });
});
