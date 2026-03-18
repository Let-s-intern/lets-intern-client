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
      className={`whitespace-nowrap px-4 py-2 text-sm font-medium transition-all duration-200 md:px-5 md:text-base ${
        isActive
          ? 'text-[#B49AFF] underline underline-offset-4'
          : 'text-gray-400 hover:text-gray-200 hover:underline hover:underline-offset-4'
      }`}
    >
      {label}
    </button>
  );
});

export default ChallengeMenuItem;
