import { ReactNode } from 'react';

function BoxItem({
  title,
  children,
}: {
  title?: string;
  children?: ReactNode;
}) {
  return (
    <div className="text-xsmall16 text-neutral-0 flex flex-col gap-2">
      <span className="whitespace-pre-line font-bold">{title}</span>
      <span className="whitespace-pre-line break-keep">{children}</span>
    </div>
  );
}

export default BoxItem;
