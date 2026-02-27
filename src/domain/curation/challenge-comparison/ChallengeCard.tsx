'use client';

import { PROGRAMS } from '../shared/programs';
import type { ChallengeComparisonRow, ProgramId } from '../types';

/** Figma 기반 카드별 썸네일 배경 색상 */
export const CARD_COLORS: Record<ProgramId, string> = {
  experience: '#ff8165',
  resume: '#4d55f5',
  coverLetter: '#14bcff',
  portfolio: '#14bcff',
  enterpriseCover: '#6cdb3f',
  marketingAllInOne: '#161c2f',
  hrAllInOne: '#161c2f',
};

/** 체크 아이콘 SVG */
export const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    className={className}
  >
    <path
      d="M2.5 7L5.5 10L11.5 4"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** X 아이콘 SVG */
export const CloseIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path
      d="M3 3L9 9M9 3L3 9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

interface ChallengeCardProps {
  challenge: ChallengeComparisonRow;
  inCart: boolean;
  isFull: boolean;
  onToggle: (id: ProgramId) => void;
  onRemove: (id: ProgramId) => void;
}

const ChallengeCard = ({
  challenge,
  inCart,
  isFull,
  onToggle,
  onRemove,
}: ChallengeCardProps) => {
  const program = PROGRAMS[challenge.programId];
  const bgColor = CARD_COLORS[challenge.programId];
  const isDark = bgColor === '#161c2f';

  return (
    <div className="flex w-[15rem] flex-col">
      {/* 카드 본체 */}
      <div className="flex flex-1 flex-col gap-3">
        {/* 썸네일 영역 */}
        <div
          className="flex h-[11.25rem] w-full items-end overflow-hidden rounded-[7px] p-4"
          style={{ backgroundColor: bgColor }}
        >
          <div className="flex flex-col gap-0.5">
            <span
              className={`text-xs font-medium ${isDark ? 'text-white/70' : 'text-white/80'}`}
            >
              {program.subtitle}
            </span>
            <span className="text-base font-bold text-white">
              {program.title}
            </span>
          </div>
        </div>

        {/* 텍스트 영역 */}
        <div className="flex flex-col gap-3 px-1">
          <span className="line-clamp-2 text-lg font-bold leading-[26px] text-[#27272d]">
            {program.title}
          </span>
          <div className="flex items-start gap-0.5">
            <CheckIcon className="mt-1 shrink-0 text-[#7a7d84]" />
            <span className="line-clamp-2 text-sm leading-[22px] text-[#27272d]">
              {challenge.target}
            </span>
          </div>
        </div>
      </div>

      {/* 비교함 담기 버튼 — mt-auto로 카드 하단 고정 */}
      <div className="mt-auto flex gap-1 pt-3">
        {inCart ? (
          <>
            <button
              type="button"
              onClick={() => onToggle(challenge.programId)}
              className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-[#dbddfd] px-2 py-2.5"
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
              className="flex w-[2.875rem] items-center justify-center rounded-lg bg-[#e7e7e7]"
            >
              <CloseIcon />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => onToggle(challenge.programId)}
            disabled={isFull}
            className={`flex w-full items-center justify-center rounded-lg px-2 py-2.5 transition-colors ${
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
  );
};

export default ChallengeCard;
