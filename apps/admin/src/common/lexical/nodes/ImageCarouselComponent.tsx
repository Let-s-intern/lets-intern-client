import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { mergeRegister } from '@lexical/utils';
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  BaseSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
} from 'lexical';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { CarouselImage } from './ImageCarouselNode';

export default function ImageCarouselComponent({
  images,
  width = 0,
  maxWidth = 950,
  nodeKey,
}: {
  images: CarouselImage[];
  width?: number;
  maxWidth?: number;
  nodeKey: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [editor] = useLexicalComposerContext();
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey);
  const [selection, setSelection] = useState<BaseSelection | null>(null);

  const $onDelete = useCallback(
    (event: KeyboardEvent) => {
      if (isSelected && $isNodeSelection($getSelection())) {
        event.preventDefault();
        $getNodeByKey(nodeKey)?.remove();
        return true;
      }
      return false;
    },
    [isSelected, nodeKey],
  );

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        setSelection(editorState.read(() => $getSelection()));
      }),
      editor.registerCommand<MouseEvent>(
        CLICK_COMMAND,
        (event) => {
          if (containerRef.current?.contains(event.target as Node)) {
            clearSelection();
            setSelected(true);
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        $onDelete,
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        $onDelete,
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, $onDelete, setSelected, clearSelection]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (el.scrollWidth <= el.clientWidth) return;

      const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      e.stopPropagation();

      if (isHorizontal) {
        return;
      }
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  if (!images.length) return null;

  const isDraggable = isSelected && $isNodeSelection(selection);

  return (
    <div
      ref={containerRef}
      draggable={isDraggable}
      className="my-4"
      style={{
        width: width === 0 ? '100%' : width,
        maxWidth,
        outline: isSelected ? '2px solid #0d6efd' : 'none',
        outlineOffset: 2,
        cursor: isDraggable ? 'grab' : undefined,
      }}
    >
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-3"
        style={{
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {images.map((img, idx) => (
          <div
            key={idx}
            className="flex-none overflow-hidden"
            style={{ height: 260, scrollSnapAlign: 'start' }}
          >
            <picture>
              {img.webpDesktop && (
                <source
                  media="(min-width: 768px)"
                  srcSet={img.webpDesktop}
                  type="image/webp"
                />
              )}
              {img.jpegDesktop && (
                <source
                  media="(min-width: 768px)"
                  srcSet={img.jpegDesktop}
                  type="image/jpeg"
                />
              )}
              {img.webpMobile && (
                <source srcSet={img.webpMobile} type="image/webp" />
              )}
              {img.jpegMobile && (
                <source srcSet={img.jpegMobile} type="image/jpeg" />
              )}
              <img
                src={img.src}
                alt={img.altText}
                style={{ height: 260, width: 'auto' }}
                draggable={false}
              />
            </picture>
          </div>
        ))}
      </div>
    </div>
  );
}
