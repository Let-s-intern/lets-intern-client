import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $wrapNodeInElement } from '@lexical/utils';
import {
  $createParagraphNode,
  $insertNodes,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
  LexicalCommand,
  LexicalEditor,
  createCommand,
} from 'lexical';
import { useEffect, useState } from 'react';

import { uploadFile } from '@/api/file';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { createImageSet } from '@/lib/image';
import {
  $createImageCarouselNode,
  CarouselImage,
  ImageCarouselNode,
} from '../../nodes/ImageCarouselNode';
import Button from '../../ui/Button';
import { DialogActions } from '../../ui/Dialog';
import FileInput from '../../ui/FileInput';

export const INSERT_IMAGE_CAROUSEL_COMMAND: LexicalCommand<CarouselImage[]> =
  createCommand('INSERT_IMAGE_CAROUSEL_COMMAND');

// 다이얼로그 내부 — 이미지 한 장 업로드 행
function CarouselImageRow({
  index,
  image,
  onRemove,
}: {
  index: number;
  image: CarouselImage;
  onRemove: () => void;
}) {
  return (
    <div className="mb-2 flex items-center gap-2 rounded border border-gray-200 p-2">
      <img
        src={image.src}
        alt={image.altText}
        className="h-14 w-20 rounded object-cover"
      />
      <span className="flex-1 truncate text-xs text-gray-500">
        슬라이드 {index + 1}
      </span>
      <button
        onClick={onRemove}
        className="text-xs text-red-500 hover:text-red-700"
      >
        삭제
      </button>
    </div>
  );
}

async function uploadSingleImage(file: File): Promise<CarouselImage> {
  const [mobileSet, desktopSet] = await Promise.all([
    createImageSet(file),
    createImageSet(file, true),
  ]);
  const [src, webpMobileUrl, jpegMobileUrl, webpDesktopUrl, jpegDesktopUrl] =
    await Promise.all([
      uploadFile({ file, type: 'BLOG' }),
      uploadFile({ file: mobileSet.webpMobile!, type: 'BLOG' }),
      uploadFile({ file: mobileSet.jpegMobile!, type: 'BLOG' }),
      uploadFile({ file: desktopSet.webpDesktop!, type: 'BLOG' }),
      uploadFile({ file: desktopSet.jpegDesktop!, type: 'BLOG' }),
    ]);
  return {
    src,
    altText: file.name,
    webpMobile: webpMobileUrl,
    jpegMobile: jpegMobileUrl,
    webpDesktop: webpDesktopUrl,
    jpegDesktop: jpegDesktopUrl,
  };
}

// 새 슬라이드 업로드 폼
function AddSlideForm({ onAdd }: { onAdd: (images: CarouselImage[]) => void }) {
  const { snackbar: setSnackbar } = useAdminSnackbar();
  const [loading, setLoading] = useState(false);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setLoading(true);
    try {
      const uploaded = await Promise.all(
        Array.from(files).map(uploadSingleImage),
      );
      onAdd(uploaded);
      setSnackbar(`${uploaded.length}장이 추가되었습니다.`);
    } catch {
      setSnackbar('업로드에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2 rounded border border-dashed border-gray-300 p-3">
      <FileInput
        label={loading ? '업로드 중...' : '+ 슬라이드 이미지 추가'}
        onChange={handleUpload}
        accept="image/*"
        multiple
        data-test-id="carousel-image-upload"
      />
    </div>
  );
}

export function InsertImageCarouselDialog({
  activeEditor,
  onClose,
}: {
  activeEditor: LexicalEditor;
  onClose: () => void;
}) {
  const [images, setImages] = useState<CarouselImage[]>([]);

  const addImage = (newImages: CarouselImage[]) =>
    setImages((prev) => [...prev, ...newImages]);

  const removeImage = (index: number) =>
    setImages((prev) => prev.filter((_, i) => i !== index));

  const handleInsert = () => {
    activeEditor.dispatchCommand(INSERT_IMAGE_CAROUSEL_COMMAND, images);
    onClose();
  };

  return (
    <>
      <p className="mb-3 text-sm text-gray-600">
        이미지를 추가하면 가로 슬라이더로 삽입됩니다. 최소 3장 이상 추가하세요.
      </p>

      {images.map((img, idx) => (
        <CarouselImageRow
          key={idx}
          index={idx}
          image={img}
          onRemove={() => removeImage(idx)}
        />
      ))}

      <AddSlideForm onAdd={addImage} />

      <DialogActions>
        <Button disabled={images.length === 0} onClick={handleInsert}>
          슬라이더 삽입
        </Button>
      </DialogActions>
    </>
  );
}

export default function ImageCarouselPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([ImageCarouselNode])) {
      throw new Error(
        'ImageCarouselPlugin: ImageCarouselNode not registered on editor',
      );
    }

    return editor.registerCommand<CarouselImage[]>(
      INSERT_IMAGE_CAROUSEL_COMMAND,
      (images) => {
        const carouselNode = $createImageCarouselNode(images);
        $insertNodes([carouselNode]);
        if ($isRootOrShadowRoot(carouselNode.getParentOrThrow())) {
          $wrapNodeInElement(carouselNode, $createParagraphNode).selectEnd();
        }
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}
