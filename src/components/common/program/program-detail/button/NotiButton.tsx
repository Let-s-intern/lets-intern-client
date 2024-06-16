interface NotiButtonProps {
  caption: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const NotiButton = ({ caption, onClick }: NotiButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="text-1.125-medium flex w-full items-center gap-1 rounded-md border border-neutral-0 bg-point px-6 py-3 text-neutral-100"
    >
      <img className="h-8 w-8" src="/icons/Bell.svg" alt="종 아이콘" />
      {caption}
    </button>
  );
};

export default NotiButton;
