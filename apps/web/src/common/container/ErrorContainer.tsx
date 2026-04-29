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
      <p className="text-xsmall16 text-neutral-20 whitespace-pre-line text-center font-medium">
        {text}
      </p>
    </div>
  );
};

export default ErrorContainer;
