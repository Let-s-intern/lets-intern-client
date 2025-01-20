'use client';

import { twMerge } from '@/lib/twMerge';
import { useEffect, useMemo, useRef, useState } from 'react';

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

  const [expanding, setExpanding] = useState(false);

  const buttonMarginTop = useMemo(() => {
    if (!buttonRef.current || !clientHeight) {
      return 0;
    }

    return clientHeight - buttonRef.current.clientHeight;
  }, [clientHeight]);

  useEffect(() => {
    if (!pRef.current) {
      return;
    }

    const observer = new ResizeObserver(() => {
      if (!pRef.current) {
        return;
      }
      setClientHeight(pRef.current.clientHeight);
    });
    observer.observe(pRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

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
          buttonClassName,
          expanding ? 'hidden' : '',
        )}
        onClick={() => setExpanding((prev) => !prev)}
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
            onClick={() => setExpanding((prev) => !prev)}
          >
            접기
          </button>
        ) : null}
      </p>
    </div>
  );
};

export default ExpandableParagraph;
