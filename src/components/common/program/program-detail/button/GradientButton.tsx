interface GradientButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
}

export default function GradientButton({
  onClick,
  children,
}: GradientButtonProps) {
  return (
    <button
      className="py-2.4 rounded-sm bg-slate-600 bg-gradient-to-r from-[#4B53FF] to-[#763CFF] px-5 py-3 text-xsmall14 font-semibold text-static-100"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
