import { twMerge } from '@/lib/twMerge';
import { AlertCircle } from 'lucide-react';
import React from 'react';

interface ErrorContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string;
}

const ErrorContainer = ({
  text = '에러가 발생했습니다.',
  className,
}: ErrorContainerProps) => {
  return (
    <div
      className={twMerge(
        'flex h-60 w-full flex-col items-center justify-center gap-y-6 py-10',
        className,
      )}
    >
      <AlertCircle size={34} />
      <p className="whitespace-pre-line text-center text-xsmall16 font-medium text-neutral-20">
        {text}
      </p>
    </div>
  );
};

export default ErrorContainer;
