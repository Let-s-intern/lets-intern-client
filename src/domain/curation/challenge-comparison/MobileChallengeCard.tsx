'use client';

import { PROGRAMS } from '../shared/programs';
import type { ChallengeComparisonRow, ProgramId } from '../types';
import { CARD_COLORS, CheckIcon, CloseIcon } from './ChallengeCard';

interface MobileChallengeCardProps {
  challenge: ChallengeComparisonRow;
  inCart: boolean;
  isFull: boolean;
  onToggle: (id: ProgramId) => void;
  onRemove: (id: ProgramId) => void;
}

const MobileChallengeCard = ({
  challenge,
  inCart,
  isFull,
  onToggle,
  onRemove,
}: MobileChallengeCardProps) => {
  const program = PROGRAMS[challenge.programId];
  const bgColor = CARD_COLORS[challenge.programId];

  return (
    <div className="flex w-full items-center gap-3">
      {/* 썸네일 */}
      <div
        className="flex h-[4.5rem] w-[4.5rem] shrink-0 items-end overflow-hidden rounded-lg p-2"
        style={{ backgroundColor: bgColor }}
      >
        <span className="line-clamp-2 text-xs font-bold leading-tight text-white">
          {program.title}
        </span>
      </div>

      {/* 텍스트 + 버튼 */}
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-0.5">
          <span className="line-clamp-1 text-sm font-bold leading-5 text-[#27272d]">
            {program.title}
          </span>
          <div className="flex items-start gap-0.5">
            <CheckIcon className="mt-0.5 shrink-0 text-[#7a7d84]" />
            <span className="line-clamp-1 text-xs leading-4 text-[#5c5f66]">
              {challenge.target}
            </span>
          </div>
        </div>

        {/* 비교함 담기 버튼 */}
        <div className="flex gap-1">
          {inCart ? (
            <>
              <button
                type="button"
                onClick={() => onToggle(challenge.programId)}
                className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-[#dbddfd] px-2 py-1.5"
              >
                <CheckIcon className="text-[#5f66f6]" />
                <span className="text-xs font-semibold leading-4 text-[#5f66f6]">
                  비교함 담기
                </span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(challenge.programId);
                }}
                className="flex w-8 items-center justify-center rounded-lg bg-[#e7e7e7]"
              >
                <CloseIcon />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => onToggle(challenge.programId)}
              disabled={isFull}
              className={`flex flex-1 items-center justify-center rounded-lg px-2 py-1.5 transition-colors ${
                isFull
                  ? 'cursor-not-allowed bg-[#e7e7e7] opacity-50'
                  : 'bg-[#e7e7e7] hover:bg-[#dbddfd] hover:text-[#5f66f6]'
              }`}
            >
              <span className="text-xs font-semibold leading-4 text-[#5c5f66]">
                비교함 담기
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileChallengeCard;
