import React, { ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface ReportCtaButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
  children: React.ReactNode;
}

const ReportCtaButton: React.FC<ReportCtaButtonProps> = ({
  onClick,
  children,
  className,
  ...restProps
}) => {
  return (
    <button
      className={twMerge(
        `flex h-14 items-center justify-center rounded-md bg-primary px-4 py-2 text-small18 font-medium text-white transition hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-opacity-50`,
        className,
      )}
      onClick={onClick}
      {...restProps}
    >
      {children}
    </button>
  );
};

export default ReportCtaButton;
