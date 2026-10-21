'use client';

import { SquareArrowOutUpRight } from 'lucide-react';
import { useGetPassExternalLinks } from '../../api/dashboard';

/** 대시보드 전용 외부 링크 박스 — 모바일만(데스크톱은 사이드바 하단에 노출) */
export default function MobileExternalLinks({
  applicationId,
}: {
  applicationId: number;
}) {
  const { data: externalLinks = [] } = useGetPassExternalLinks(applicationId);
  if (externalLinks.length === 0) return null;

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
