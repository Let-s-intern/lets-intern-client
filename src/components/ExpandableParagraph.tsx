'use client';

import { twMerge } from '@/lib/twMerge';
import { useEffect, useRef, useState } from 'react';

const ExpandableParagraph = ({
  content,
  buttonClassName,
  className,
  lineClamp = 2,
}: {
  content: string;
  lineClamp?: 1 | 2 | 3 | 4;
  className?: string;
  buttonClassName?: string;
}) => {
  const pRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [clientHeight, setClientHeight] = useState<number | null>(null);
  const [scrollHeight, setScrollHeight] = useState<number | null>(null);
  const [lineHeight, setLineHeight] = useState<number | null>(null);
  const [expanding, setExpanding] = useState(false);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (!pRef.current) {
        return;
      }
      setClientHeight(pRef.current.clientHeight);
      setScrollHeight(pRef.current.scrollHeight);
      setLineHeight(parseFloat(getComputedStyle(pRef.current).lineHeight));
    });
    if (pRef.current) {
      observer.observe(pRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const isOverflown =
    scrollHeight && clientHeight && scrollHeight > clientHeight;

  const buttonMarginTop = (lineHeight ?? 0) * (lineClamp - 1);

  return (
    <div
      className={twMerge(
        'relative',
        expanding
          ? ''
          : lineClamp === 1
            ? 'line-clamp-1'
            : lineClamp === 2
              ? 'line-clamp-2'
              : lineClamp === 3
                ? 'line-clamp-3'
                : lineClamp === 4
                  ? 'line-clamp-4'
                  : null,

        className,
      )}
    >
      <button
        className={twMerge(
          'float-right text-primary hover:underline [shape-outside:border-box]',
          expanding && 'hidden',
          !isOverflown && 'hidden',
          buttonClassName,
        )}
        onClick={(e) => {
          e.stopPropagation();
          setExpanding((prev) => !prev);
        }}
        style={{
          marginTop: `${buttonMarginTop}px`,
        }}
        ref={buttonRef}
      >
        더보기
      </button>

      <p ref={pRef}>
        {content}
        {expanding ? (
          <button
            className={twMerge(
              ' text-primary ml-0.5 hover:underline',
              buttonClassName,
            )}
            onClick={(e) => {
              e.stopPropagation();
              setExpanding((prev) => !prev);
            }}
          >
            접기
          </button>
        ) : null}
      </p>
    </div>
  );
};

export default ExpandableParagraph;
