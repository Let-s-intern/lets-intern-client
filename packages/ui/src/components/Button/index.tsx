'use client';

/*
 * variant: solid(채움, 기본값) / soft(연한 채움) / outline(테두리) / text(텍스트만)
 * size: xs / sm / md(기본값) / lg / xl
 * display: inline(기본값) / full
 * as="a"로 렌더 시, 버튼 스타일을 링크에 입힘 (href 필수)
 */

import { twMerge } from '@letscareer/utils/twMerge';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-xs px-3 font-medium transition-colors ' +
    'disabled:cursor-not-allowed disabled:bg-neutral-70 disabled:text-static-100 ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        solid: 'bg-primary text-static-100 hover:bg-primary-hover',
        soft: 'bg-primary-10 text-primary hover:bg-primary-15',
        outline: 'border border-primary text-primary hover:bg-primary-5',
        text: 'text-primary hover:underline',
      },
      size: {
        xs: 'text-xsmall14 py-1.5',
        sm: 'text-xsmall14 py-2',
        md: 'text-xsmall16 py-2',
        lg: 'text-xsmall16 py-3',
        xl: 'text-xsmall16 py-4',
      },
      display: {
        inline: '',
        full: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'solid',
      size: 'md',
      display: 'inline',
    },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;

type ButtonOwnProps = ButtonVariantProps & {
  className?: string;
};

export interface ButtonAsButtonProps
  extends ButtonOwnProps, React.ButtonHTMLAttributes<HTMLButtonElement> {
  as?: 'button';
}

export interface ButtonAsAnchorProps
  extends ButtonOwnProps, React.AnchorHTMLAttributes<HTMLAnchorElement> {
  as: 'a';
  href: string;
}

export type ButtonProps = ButtonAsButtonProps | ButtonAsAnchorProps;

export function Button(props: ButtonProps) {
  const { variant, size, display, className, children, ...rest } = props;
  const classes = twMerge(
    buttonVariants({ variant, size, display }),
    className,
  );

  if (rest.as === 'a') {
    const { as: _as, ...anchorRest } = rest;
    return (
      <a className={classes} {...anchorRest}>
        {children}
      </a>
    );
  }

  const { as: _as, type = 'button', ...buttonRest } = rest;
  return (
    <button type={type} className={classes} {...buttonRest}>
      {children}
    </button>
  );
}
