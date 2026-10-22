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
      <div className="border-neutral-80 rounded-xs scrollbar-hide flex gap-2 overflow-x-auto border p-3 md:hidden">
        {externalLinks.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xsmall14 text-neutral-40 border-neutral-80 flex shrink-0 items-center gap-1 rounded-full border px-3 py-1 font-medium"
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
            className="text-xsmall16 text-neutral-40 hover:text-neutral-0 flex items-center gap-1.5 font-medium transition-colors"
          >
            {link.name}
            <SquareArrowOutUpRight size={14} />
          </a>
        </li>
      ))}
    </ul>
  );
}
