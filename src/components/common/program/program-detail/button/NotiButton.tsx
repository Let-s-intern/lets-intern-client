interface NotiButtonProps {
  caption: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const NotiButton = ({ caption, onClick }: NotiButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-center gap-1 rounded-md border border-neutral-0 bg-point px-6 py-3"
    >
      <img className="h-8 w-8" src="/icons/Bell.svg" alt="종 아이콘" />
      <span className="text-1.125-medium text-neutral-0">{caption}</span>
    </button>
  );
};

export default NotiButton;
