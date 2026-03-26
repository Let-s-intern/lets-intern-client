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
  className?: string;
}

const INDICATOR_TRANSITION_MS = 200;

const CategoryTabs = <Value extends string>({
  options,
  selected,
  onChange,
  className,
}: CategoryTabsProps<Value>) => {
  const navRef = useRef<HTMLElement>(null);
  const activeRef = useRef<HTMLButtonElement | null>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const updateIndicator = () => {
    if (!navRef.current || !activeRef.current) return;
    const navRect = navRef.current.getBoundingClientRect();
    const btnRect = activeRef.current.getBoundingClientRect();
    setIndicator({
      left: btnRect.left - navRect.left,
      width: btnRect.width,
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
        'relative flex w-full border-b border-neutral-85 text-xsmall16 md:text-small20',
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
              'mr-4 text-nowrap pb-2 transition-colors md:mr-6 md:pb-3',
              isActive
                ? 'font-semibold text-neutral-10'
                : 'font-medium text-neutral-45 hover:text-neutral-10',
            )}
          >
            {option.label as ReactNode}
          </button>
        );
      })}
      <span
        aria-hidden
        className="absolute bottom-0 left-0 h-0.5 w-px origin-left bg-neutral-0"
        style={{
          transform: `translateX(${indicator.left}px) scaleX(${indicator.width})`,
          transition: `transform ${INDICATOR_TRANSITION_MS}ms ease-out`,
        }}
      />
    </nav>
  );
};

export default CategoryTabs;
