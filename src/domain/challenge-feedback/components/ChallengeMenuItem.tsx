import { memo } from 'react';

interface ChallengeMenuItemProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const ChallengeMenuItem = memo(function ChallengeMenuItem({
  label,
  isActive,
  onClick,
}: ChallengeMenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-300 md:px-5 md:py-2.5 md:text-sm ${
        isActive
          ? 'border-[#7C6BFF] bg-gradient-to-r from-[#7C6BFF]/20 to-[#B49AFF]/20 text-white shadow-[0_0_16px_rgba(124,107,255,0.3)]'
          : 'border-white/10 bg-white/5 text-gray-300 hover:border-[#7C6BFF]/50 hover:bg-[#7C6BFF]/10 hover:text-white hover:shadow-[0_0_12px_rgba(124,107,255,0.15)]'
      }`}
    >
      {label}
    </button>
  );
});

export default ChallengeMenuItem;
