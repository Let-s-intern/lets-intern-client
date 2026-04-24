const TAG_COLORS = [
  { text: 'text-[#fdad00]', bg: 'bg-[#fdad00]', border: 'border-[#fdad00]', lightBg: 'bg-[#fff3d9]' },
  { text: 'text-[#14bcff]', bg: 'bg-[#14bcff]', border: 'border-[#14bcff]', lightBg: 'bg-[#eefaff]' },
  { text: 'text-green-500', bg: 'bg-green-500', border: 'border-green-500', lightBg: 'bg-green-50' },
  { text: 'text-purple-500', bg: 'bg-purple-500', border: 'border-purple-500', lightBg: 'bg-purple-50' },
];

interface ChallengeTagProps {
  challengeId: number;
  title: string;
  colorIndex: number;
  isSelected: boolean;
  onToggle: (challengeId: number) => void;
}

/**
 * Challenge tag with unique color.
 * Unselected: text in challenge color with light bg.
 * Selected: solid challenge color bg with white text.
 */
const ChallengeTag = ({
  challengeId,
  title,
  colorIndex,
  isSelected,
  onToggle,
}: ChallengeTagProps) => {
  const color = TAG_COLORS[colorIndex % TAG_COLORS.length];

  return (
    <button
      type="button"
      onClick={() => onToggle(challengeId)}
      className={`rounded-full px-3 py-1.5 text-xs font-medium leading-5 transition-colors ${
        isSelected
          ? `${color.bg} text-white`
          : `${color.lightBg} ${color.text}`
      }`}
    >
      {title}
    </button>
  );
};

export default ChallengeTag;
export { TAG_COLORS };
