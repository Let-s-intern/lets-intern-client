'use client';

import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant?: 'primary' | 'dark';
};

export default function CTAButton({
  children,
  className = '',
  variant = 'primary',
  ...rest
}: Props) {
  const base =
    'text-1-medium px-5 py-2.5 rounded-2xl shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';
  const style =
    variant === 'dark'
      ? ' bg-neutral-900 text-white hover:bg-neutral-800 focus-visible:ring-neutral-900'
      : ' bg-[#6E7AFF] text-white hover:bg-[#5f6af7] focus-visible:ring-[#6E7AFF]';
  return (
    <button {...rest} className={`${base} ${style} ${className}`}>
      {children}
    </button>
  );
}
