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
  lineClamp?: 1 | 2 | 3 | 4 | 5;
  className?: string;
  buttonClassName?: string;
}) => {
  const pRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [lineHeight, setLineHeight] = useState<number | null>(null);
  const [expanding, setExpanding] = useState(false);
  const originalRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (!pRef.current) {
        return;
      }
      setLineHeight(parseFloat(getComputedStyle(pRef.current).lineHeight));
    });
    if (pRef.current) {
      observer.observe(pRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const maxHeight = lineHeight ? lineHeight * lineClamp : undefined;

  const isOverflown =
    originalRef.current?.clientHeight &&
    maxHeight &&
    originalRef.current?.clientHeight > maxHeight;

  return (
    <>
      <div className={twMerge(className, 'h-0 overflow-hidden')}>
        <p ref={originalRef}>{content}</p>
      </div>

      <div className={twMerge('relative w-full', className)}>
        <p
          ref={pRef}
          className="relative overflow-hidden tracking-[-0.028px]"
          style={{ maxHeight: expanding ? undefined : maxHeight }}
        >
          {content}
          {!isOverflown ? null : !expanding ? (
            <button
              className={twMerge(
                'review_more z-1 absolute bottom-0 right-0 block bg-gradient-to-r from-transparent via-white via-40% to-white pl-8 text-primary hover:underline',
                buttonClassName,
              )}
              onClick={(e) => {
                e.stopPropagation();
                setExpanding((prev) => !prev);
              }}
              ref={buttonRef}
            >
              더보기
            </button>
          ) : (
            <button
              className={twMerge(
                'ml-0.5 text-primary hover:underline',
                buttonClassName,
              )}
              onClick={(e) => {
                e.stopPropagation();
                setExpanding((prev) => !prev);
              }}
            >
              접기
            </button>
          )}
        </p>
      </div>
    </>
  );
};

export default ExpandableParagraph;
