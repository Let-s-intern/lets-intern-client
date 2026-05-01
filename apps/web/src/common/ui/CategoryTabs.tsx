'use client';

import clsx from 'clsx';
import { ReactNode, useLayoutEffect, useRef, useState } from 'react';

interface TabOption<Value extends string> {
  value: Value;
  label: string;
}

interface CategoryTabsProps<Value extends string> {
  options: TabOption<Value>[];
  selected: Value;
  onChange: (value: Value) => void;
  size?: 'large' | 'small';
  full?: boolean;
  className?: string;
}

const INDICATOR_TRANSITION_MS = 200;

const CategoryTabs = <Value extends string>({
  options,
  selected,
  onChange,
  size = 'small',
  full = false,
  className,
}: CategoryTabsProps<Value>) => {
  const navRef = useRef<HTMLElement>(null);
  const activeRef = useRef<HTMLButtonElement | null>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const updateIndicator = () => {
    if (!navRef.current || !activeRef.current) return;
    setIndicator({
      left: activeRef.current.offsetLeft,
      width: activeRef.current.offsetWidth,
    });
  };

  useLayoutEffect(() => {
    updateIndicator();
  }, [selected, options]);

  useLayoutEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const observer = new ResizeObserver(updateIndicator);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      ref={navRef}
      className={clsx(
        'border-neutral-85 scrollbar-hide relative flex w-full flex-nowrap overflow-x-auto border-b',
        !full && 'pl-5 md:pl-0',
        size === 'large'
          ? 'text-xsmall16 md:text-small20'
          : 'text-xsmall14 md:text-xsmall16',
        className,
      )}
    >
      {options.map((option) => {
        const isActive = option.value === selected;

        return (
          <button
            key={option.value}
            ref={
              isActive
                ? (el) => {
                    activeRef.current = el;
                  }
                : undefined
            }
            type="button"
            onClick={() => onChange(option.value)}
            className={clsx(
              'text-nowrap transition-colors',
              full
                ? 'flex-1 pb-2 text-center md:pb-3'
                : size === 'large'
                  ? 'mr-4 pb-2 md:mr-6 md:pb-3'
                  : 'mr-6 pb-3',
              isActive
                ? 'text-neutral-10 font-semibold'
                : 'text-neutral-45 hover:text-neutral-10 font-medium',
            )}
          >
            {option.label as ReactNode}
          </button>
        );
      })}
      <span
        aria-hidden
        className="bg-neutral-0 absolute bottom-0 h-0.5"
        style={{
          left: indicator.left,
          width: indicator.width,
          transition: `left ${INDICATOR_TRANSITION_MS}ms ease-out, width ${INDICATOR_TRANSITION_MS}ms ease-out`,
        }}
      />
    </nav>
  );
};

export default CategoryTabs;
