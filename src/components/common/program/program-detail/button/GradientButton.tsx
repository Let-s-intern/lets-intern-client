interface GradientButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}

export default function GradientButton({
  children,
  disabled,
  onClick,
}: GradientButtonProps) {
  return (
    <button
      className="py-2.4 rounded-sm bg-slate-600 bg-gradient-to-r from-[#4B53FF] to-[#763CFF] px-5 py-3 text-xsmall14 font-semibold text-static-100"
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
