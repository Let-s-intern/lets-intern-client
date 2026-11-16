'use client';

import { SquareArrowOutUpRight } from 'lucide-react';
import { useGetPassExternalLinks } from '../../api/dashboard';

interface Props {
  applicationId: number;
  variant: 'header' | 'box';
}

export default function ExternalLinks({ applicationId, variant }: Props) {
  const { data: externalLinks = [] } = useGetPassExternalLinks(applicationId);
  if (externalLinks.length === 0) return null;

  if (variant === 'box') {
    return (
      <div className="flex gap-2 overflow-x-auto rounded-xs border border-neutral-80 p-3 scrollbar-hide md:hidden">
        {externalLinks.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex shrink-0 items-center gap-1 rounded-full border border-neutral-80 px-3 py-1 text-xsmall14 font-medium text-neutral-40"
          >
            {link.name}
            <SquareArrowOutUpRight size={12} />
          </a>
        ))}
      </div>
    );
  }

  return (
    <ul className="hidden items-center gap-4 md:flex">
      {externalLinks.map((link) => (
        <li key={link.id}>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xsmall16 font-medium text-neutral-40 transition-colors hover:text-neutral-0"
          >
            {link.name}
            <SquareArrowOutUpRight size={14} />
          </a>
        </li>
      ))}
    </ul>
  );
}
