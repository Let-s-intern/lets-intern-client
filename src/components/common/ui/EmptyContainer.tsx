import Logo from '@/assets/logo/logo_gray.svg?react';
import { twMerge } from '@/lib/twMerge';
import React from 'react';

interface EmptyContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string;
}

const EmptyContainer = ({ text, className }: EmptyContainerProps) => {
  return (
    <div
      className={twMerge(
        'flex h-60 w-full flex-col items-center justify-center gap-y-6 py-10',
        className,
      )}
    >
      <Logo width={34} height={34} />
      <p className="whitespace-pre-line text-center text-xsmall16 font-medium text-neutral-20">
        {text || '등록된 데이터가 없습니다.'}
      </p>
    </div>
  );
};

export default EmptyContainer;
