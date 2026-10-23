import { useState } from 'react';

import type { CompanyLogoFaviconCandidate } from '@/api/company-logo/companyLogoSchema';
import { twMerge } from '@/lib/twMerge';

const SOURCE_LABELS: Record<string, string> = {
  APPLE_TOUCH_ICON: 'apple-touch-icon',
  ICON: 'icon',
  DEFAULT_APPLE_TOUCH_ICON: '/apple-touch-icon.png',
  FAVICON_ICO: '/favicon.ico',
};

const sizeLabel = ({ format, width, height }: CompanyLogoFaviconCandidate) =>
  width !== null && height !== null
    ? `${format} ${width}×${height}`
    : `${format} 크기 모름`;

interface Props {
  candidates: CompanyLogoFaviconCandidate[];
  selectedUrl: string;
  onSelect: (url: string) => void;
}

/**
 * 로고 후보 썸네일. 하나만 고른다.
 * 썸네일은 상대 사이트에서 바로 불러오므로 리퍼러를 보내지 않고, 깨지면 「미리보기 불가」 만 적는다(고를 수는 있다).
 */
export default function FaviconCandidateGrid({
  candidates,
  selectedUrl,
  onSelect,
}: Props) {
  const [brokenUrls, setBrokenUrls] = useState<string[]>([]);

  return (
    <ul
      role="radiogroup"
      aria-label="로고 후보"
      className="grid grid-cols-3 gap-2"
    >
      {candidates.map((candidate) => {
        const isSelected = candidate.url === selectedUrl;
        const isBroken = brokenUrls.includes(candidate.url);
        return (
          <li key={candidate.url}>
            <button
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={sizeLabel(candidate)}
              onClick={() => onSelect(candidate.url)}
              className={twMerge(
                'flex w-full flex-col items-center gap-1 rounded-lg border p-2',
                isSelected
                  ? 'border-primary bg-primary-10'
                  : 'border-neutral-80',
              )}
            >
              <div className="bg-neutral-90 flex h-16 w-16 items-center justify-center overflow-hidden rounded">
                {isBroken ? (
                  <span className="text-xxsmall12 text-neutral-40 text-center">
                    미리보기 불가
                  </span>
                ) : (
                  <img
                    src={candidate.url}
                    referrerPolicy="no-referrer"
                    alt=""
                    className="h-full w-full object-contain"
                    onError={() =>
                      setBrokenUrls((prev) => [...prev, candidate.url])
                    }
                  />
                )}
              </div>
              <span className="text-xxsmall12 font-medium">
                {sizeLabel(candidate)}
              </span>
              <span className="text-xxsmall10 text-neutral-40 break-all">
                {SOURCE_LABELS[candidate.source] ?? candidate.source}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
