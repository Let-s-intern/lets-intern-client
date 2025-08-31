'use client';

import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export default function CTAButton({ children, className = '', ...rest }: Props) {
  return (
    <button
      {...rest}
      className={
        'rounded-lg bg-[#6E7AFF] px-5 py-2.5 text-white text-1-medium shadow-sm hover:bg-[#5f6af7] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6E7AFF] ' +
        className
      }
    >
      {children}
    </button>
  );
}

