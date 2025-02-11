import Logo from '@/assets/logo/logo_gray.svg?react';
import clsx from 'clsx';
import React from 'react';

interface EmptyContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string;
}

const EmptyContainer = ({ text, className }: EmptyContainerProps) => {
  return (
    <div
      className={clsx(
        'flex h-60 w-full flex-col items-center justify-center gap-y-6 py-10',
        className,
      )}
    >
      <Logo width={34} height={34} />
      <div className="text-xsmall16 font-medium text-neutral-20">
        {text || '등록된 데이터가 없습니다.'}
      </div>
    </div>
  );
};

export default EmptyContainer;
