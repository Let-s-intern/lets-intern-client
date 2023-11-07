interface BadgeButtonProps {
  category: string;
  disabled?: boolean;
  onClick?: () => void;
}

const BadgeButton = ({ category, disabled, onClick }: BadgeButtonProps) => {
  return (
    <button
      className={`rounded-full px-3 py-1 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-offset-2 sm:px-5 sm:text-lg ${
        disabled
          ? 'bg-gray-200 text-gray-400 hover:bg-gray-300'
          : 'bg-indigo-500 text-white hover:bg-indigo-700'
      }`}
      onClick={onClick}
    >
      {category}
    </button>
  );
};

export default BadgeButton;
