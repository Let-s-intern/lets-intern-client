'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { uploadFile } from '@/api/file';
import BaseModal from '@/common/modal/BaseModal';
import {
  CENTERED,
  canvasToFile,
  cropRect,
  decodeImage,
  outputMimeFor,
  renderProfileImage,
  type Framing,
} from '../utils/processProfileImage';

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

interface ProfileImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** 업로드가 끝나 받은 이미지 URL. 상위 폼에만 넣고 서버 저장은 하지 않는다. */
  onUploaded: (url: string) => void;
}

/**
 * 프로필 이미지 업로드 모달.
 *
 * **여기서 누르는 "저장하기" 는 프로필 저장이 아니다.** 이미지를 올려 URL 을 받아 상위 폼에
 * 넣을 뿐이고, 서버 반영은 프로필 화면 하단의 플로팅 저장 바 하나가 담당한다(LC-3266 이
 * 저장 경로를 그 하나로 합쳐 놓았다). 그래서 모달 안에 그 사실을 한 줄로 적어 둔다.
 *
 * 미리보기는 `<img>` 가 아니라 **캔버스**다. 업로드할 때 쓰는 그리기 함수로 그 캔버스를
 * 그대로 그리고, 저장할 때 같은 캔버스를 File 로 굳힌다. 보이는 픽셀과 올라가는 픽셀이
 * 같은 것이 이 화면의 핵심이다 — 흐린 화면을 보고 저장했는데 선명한 사진이 올라가거나,
 * 얼굴을 맞춰 놨는데 다르게 잘리면 멘토는 알아챌 방법이 없다.
 *
 * 잘라내는 틀은 정사각형이다. 프로필 이미지를 쓰는 화면들의 비율이 제각각이고 전부
 * `object-cover` 라, 어떤 비율로 저장해도 어딘가에서는 잘린다. 정사각형으로 저장해 두면
 * 가운데에 맞춘 얼굴이 어느 컨테이너에서도 살아남는다.
 */
const ProfileImageUploadModal = ({
  isOpen,
  onClose,
  onUploaded,
}: ProfileImageUploadModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [bitmap, setBitmap] = useState<ImageBitmap | null>(null);
  const [framing, setFraming] = useState<Framing>(CENTERED);
  const [isBlurred, setIsBlurred] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  /** 드래그 시작 지점과 그때의 framing. 포인터 이동량을 원본 픽셀로 환산할 때 쓴다. */
  const dragOrigin = useRef<{ x: number; y: number; framing: Framing } | null>(
    null,
  );

  /** 각 축에 움직일 여백이 있는지. 세로 사진이면 좌우로는 움직일 것이 없다. */
  const slack = bitmap
    ? {
        x: bitmap.width - Math.min(bitmap.width, bitmap.height),
        y: bitmap.height - Math.min(bitmap.width, bitmap.height),
      }
    : { x: 0, y: 0 };
  const canPan = slack.x > 0 || slack.y > 0;

  const reset = useCallback(() => {
    setFile(null);
    setBitmap(null);
    setFraming(CENTERED);
    setIsBlurred(false);
    setIsDragging(false);
    setError(null);
    dragOrigin.current = null;
  }, []);

  /*
   * 다 쓴 ImageBitmap 을 놓아준다. GC 를 기다리지 않고 직접 해제해야 하는 객체라
   * 안 풀면 사진을 여러 번 고를수록 메모리가 쌓인다.
   *
   * 해제를 `setBitmap` 업데이터 안에서 하면 안 된다. 업데이터는 순수해야 하고 React 가
   * 여러 번 호출할 수 있어서, 아직 그리는 중인 비트맵을 닫아 버리면 `drawImage` 가
   * InvalidStateError 로 죽는다. 값이 바뀔 때 정리하는 이 자리가 제자리다.
   */
  useEffect(() => {
    return () => bitmap?.close?.();
  }, [bitmap]);

  // 모달을 닫으면 고르던 것을 버린다. 블러 토글도 저장되는 설정이 아니라 굽는 시점의
  // 옵션이므로 다음에 열 때는 꺼진 상태로 시작한다.
  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  /** 화면에 그린다. 업로드할 때와 같은 함수를 쓴다. */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !bitmap || !file) return;

    try {
      renderProfileImage(canvas, bitmap, {
        framing,
        blur: isBlurred,
        mime: outputMimeFor(file),
      });
    } catch {
      setError('이미지를 처리하지 못했어요. 다른 이미지로 시도해주세요.');
      setBitmap(null);
    }
  }, [bitmap, file, framing, isBlurred]);

  const handleSelect = async (selected: File | undefined) => {
    if (!selected) return;

    if (!selected.type.startsWith('image/')) {
      setError('이미지 파일만 올릴 수 있어요.');
      return;
    }
    // 왜 안 됐는지, 얼마까지 되는지, 지금 파일이 얼마인지를 한 줄에 담는다.
    if (selected.size > MAX_FILE_SIZE_BYTES) {
      const sizeMb = (selected.size / 1024 / 1024).toFixed(1);
      setError(
        `용량이 너무 커요. ${MAX_FILE_SIZE_MB}MB까지 올릴 수 있는데 이 이미지는 ${sizeMb}MB예요.`,
      );
      return;
    }

    setError(null);
    try {
      const decoded = await decodeImage(selected);
      setFile(selected);
      setFraming(CENTERED);
      setBitmap(decoded);
    } catch {
      /*
       * 디코드에 실패하면(안드로이드·데스크톱 크롬의 HEIC 등) 원본으로 되돌리지 않는다.
       * 그러면 자르지도 흐리게 하지도 않은 사진이 그대로 올라간다.
       */
      setFile(null);
      setBitmap(null);
      setError(
        '이미지를 읽지 못했어요. 다른 형식(JPG, PNG)으로 다시 시도해주세요.',
      );
    }
  };

  /**
   * 드래그로 잘라낼 위치를 옮긴다.
   *
   * 캔버스는 원본의 짧은 변만큼을 화면 폭에 담아 보여준다. 그래서 화면에서 1px 움직이면
   * 원본에서는 `짧은 변 / 화면 폭` 픽셀만큼 움직인 것이다. 그 값을 축의 여백으로 나눠
   * 0~1 비율로 되돌린다.
   */
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const origin = dragOrigin.current;
    const canvas = canvasRef.current;
    if (!origin || !canvas || !bitmap) return;

    const { side } = cropRect(bitmap.width, bitmap.height, framing);
    const perPixel = side / canvas.getBoundingClientRect().width;

    // 사진을 오른쪽으로 끌면 왼쪽이 보여야 하므로 부호가 반대다.
    const nextX = slack.x
      ? origin.framing.x - ((e.clientX - origin.x) * perPixel) / slack.x
      : origin.framing.x;
    const nextY = slack.y
      ? origin.framing.y - ((e.clientY - origin.y) * perPixel) / slack.y
      : origin.framing.y;

    setFraming({
      x: Math.min(1, Math.max(0, nextX)),
      y: Math.min(1, Math.max(0, nextY)),
    });
  };

  const handleSave = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !file || !bitmap) return;

    setIsSaving(true);
    setError(null);
    try {
      const processed = await canvasToFile(canvas, file);
      const url = await uploadFile({ file: processed, type: 'USER_PROFILE' });
      onUploaded(url);
      reset();
      onClose();
    } catch {
      setError('업로드에 실패했어요. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  const hasImage = Boolean(bitmap && file);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[20rem] md:max-w-[28rem]"
    >
      <div className="px-6 py-5">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xsmall16 font-semibold">프로필 이미지</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="p-1 opacity-60 transition-opacity hover:opacity-100"
          >
            <img src="/icons/x.svg" alt="" className="h-[18px] w-[18px]" />
          </button>
        </div>

        <label
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleSelect(e.dataTransfer.files?.[0]);
          }}
          className={`flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-colors ${
            hasImage ? 'border-transparent' : 'cursor-pointer'
          } ${
            isDragging
              ? 'border-primary bg-primary-5'
              : 'border-neutral-80 bg-neutral-95'
          }`}
        >
          {!hasImage && (
            <div className="px-6 text-center">
              <span className="text-xsmall14 block text-neutral-500">
                드래그해서 이미지를 올리거나 클릭하여 이미지를 올려 주세요
              </span>
              {/* 한도는 거절당한 뒤가 아니라 고르기 전에 보여야 한다. */}
              <span className="mt-1 block text-xs text-neutral-400">
                JPG, PNG 파일을 {MAX_FILE_SIZE_MB}MB까지 올릴 수 있어요.
              </span>
            </div>
          )}

          {/*
            캔버스는 이미지가 있을 때만 보인다. 라벨 안에 두면 드래그가 파일 선택창을
            열어 버리므로, 포인터 이벤트를 여기서 멈춘다.
          */}
          <canvas
            ref={canvasRef}
            aria-label="프로필 이미지 미리보기"
            hidden={!hasImage}
            onPointerDown={(e) => {
              if (!canPan) return;
              e.preventDefault();
              e.currentTarget.setPointerCapture(e.pointerId);
              dragOrigin.current = { x: e.clientX, y: e.clientY, framing };
            }}
            onPointerMove={handlePointerMove}
            onPointerUp={() => {
              dragOrigin.current = null;
            }}
            onPointerCancel={() => {
              dragOrigin.current = null;
            }}
            onClick={(e) => e.preventDefault()}
            className={`h-full w-full touch-none select-none ${
              canPan ? 'cursor-grab active:cursor-grabbing' : ''
            }`}
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              handleSelect(e.target.files?.[0]);
              // 같은 파일을 다시 골라도 change 가 나게 한다.
              e.target.value = '';
            }}
            className="hidden"
          />
        </label>

        {hasImage && (
          <p className="mt-2 text-center text-xs text-neutral-500">
            {canPan
              ? '사진을 드래그해서 저장할 영역을 맞춰 주세요. 보이는 그대로 저장돼요.'
              : '정사각형 사진이라 잘리는 부분이 없어요.'}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-xsmall14 font-medium">
              이미지 블러처리하기
            </span>
            <p className="mt-0.5 text-xs text-neutral-500">
              흐리게 만든 사진이 저장돼요. 원본은 올라가지 않아요.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={isBlurred}
            aria-label="이미지 블러처리하기"
            onClick={() => setIsBlurred((prev) => !prev)}
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
              isBlurred ? 'bg-primary' : 'bg-neutral-70'
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
                isBlurred ? 'left-[1.375rem]' : 'left-0.5'
              }`}
            />
          </button>
        </div>

        {error && <p className="mt-3 text-xs text-red-500">{error}</p>}

        <button
          type="button"
          onClick={handleSave}
          disabled={!hasImage || isSaving}
          className="bg-primary hover:bg-primary-hover text-xsmall14 mt-5 w-full rounded-lg py-3 font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? '저장 중...' : '저장하기'}
        </button>

        <p className="mt-2 text-center text-xs text-neutral-500">
          기본 정보의 저장까지 눌러야 반영돼요.
        </p>
      </div>
    </BaseModal>
  );
};

export default ProfileImageUploadModal;
