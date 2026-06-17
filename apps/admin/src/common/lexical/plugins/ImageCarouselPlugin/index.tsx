import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $wrapNodeInElement, CAN_USE_DOM, mergeRegister } from '@lexical/utils';
import {
  $createParagraphNode,
  $createRangeSelection,
  $getSelection,
  $insertNodes,
  $isNodeSelection,
  $isRootOrShadowRoot,
  $setSelection,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  DRAGOVER_COMMAND,
  DRAGSTART_COMMAND,
  DROP_COMMAND,
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
  $isImageCarouselNode,
  CarouselImage,
  ImageCarouselNode,
} from '../../nodes/ImageCarouselNode';
import Button from '../../ui/Button';
import { DialogActions } from '../../ui/Dialog';
import FileInput from '../../ui/FileInput';

export const INSERT_IMAGE_CAROUSEL_COMMAND: LexicalCommand<CarouselImage[]> =
  createCommand('INSERT_IMAGE_CAROUSEL_COMMAND');

const DRAG_TYPE = 'application/x-lexical-drag-carousel';

const getDOMSelection = (targetWindow: Window | null): Selection | null =>
  CAN_USE_DOM ? (targetWindow || window).getSelection() : null;

function $getCarouselNodeInSelection(): ImageCarouselNode | null {
  const selection = $getSelection();
  if (!$isNodeSelection(selection)) return null;
  const node = selection.getNodes()[0];
  return $isImageCarouselNode(node) ? node : null;
}

function $onDragStart(event: DragEvent): boolean {
  const node = $getCarouselNodeInSelection();
  if (!node) return false;
  const dataTransfer = event.dataTransfer;
  if (!dataTransfer) return false;
  dataTransfer.setData('text/plain', '_');
  dataTransfer.setData(
    DRAG_TYPE,
    JSON.stringify({
      images: node.__images,
      width: node.__width,
      maxWidth: node.__maxWidth,
    }),
  );
  return true;
}

function $onDragOver(event: DragEvent): boolean {
  if (!event.dataTransfer?.types.includes(DRAG_TYPE)) return false;
  event.preventDefault();
  return true;
}

function $onDrop(event: DragEvent, editor: LexicalEditor): boolean {
  const node = $getCarouselNodeInSelection();
  if (!node) return false;
  const raw = event.dataTransfer?.getData(DRAG_TYPE);
  if (!raw) return false;
  event.preventDefault();

  const { images } = JSON.parse(raw);
  const target = event.target as Element | null;
  const targetWindow = target?.ownerDocument?.defaultView ?? null;
  const domSelection = getDOMSelection(targetWindow);

  let range: Range | null = null;
  if (document.caretRangeFromPoint) {
    range = document.caretRangeFromPoint(event.clientX, event.clientY);
  } else if (domSelection) {
    domSelection.collapse(
      (event as DragEvent & { rangeParent?: Node }).rangeParent ?? null,
      (event as DragEvent & { rangeOffset?: number }).rangeOffset ?? 0,
    );
    range = domSelection.getRangeAt(0);
  }

  node.remove();
  const rangeSelection = $createRangeSelection();
  if (range) rangeSelection.applyDOMRange(range);
  $setSelection(rangeSelection);

  const newNode = $createImageCarouselNode(images);
  $insertNodes([newNode]);
  if ($isRootOrShadowRoot(newNode.getParentOrThrow())) {
    $wrapNodeInElement(newNode, $createParagraphNode).selectEnd();
  }
  return true;
}

// ─── Dialog UI ───────────────────────────────────────────────────────────────

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
        {image.altText}
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
        <Button disabled={images.length < 3} onClick={handleInsert}>
          슬라이더 삽입
        </Button>
      </DialogActions>
    </>
  );
}

// ─── Plugin ───────────────────────────────────────────────────────────────────

export default function ImageCarouselPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([ImageCarouselNode])) {
      throw new Error(
        'ImageCarouselPlugin: ImageCarouselNode not registered on editor',
      );
    }

    return mergeRegister(
      editor.registerCommand<CarouselImage[]>(
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
      ),
      editor.registerCommand<DragEvent>(
        DRAGSTART_COMMAND,
        $onDragStart,
        COMMAND_PRIORITY_HIGH,
      ),
      editor.registerCommand<DragEvent>(
        DRAGOVER_COMMAND,
        $onDragOver,
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand<DragEvent>(
        DROP_COMMAND,
        (event) => $onDrop(event, editor),
        COMMAND_PRIORITY_HIGH,
      ),
    );
  }, [editor]);

  return null;
}
