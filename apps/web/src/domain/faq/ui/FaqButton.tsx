function FaqButton({
  onClick,
  children,
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) {
  return (
    <button
      type="button"
      className="rounded-sm bg-[#e0e0e0] px-4 py-2 font-medium"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default FaqButton;
