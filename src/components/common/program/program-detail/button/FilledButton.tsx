interface FilledButtonProps {
  caption: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const FilledButton = ({ caption, onClick }: FilledButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="text-1.125-medium w-full rounded-md bg-primary px-6 py-3 text-neutral-100"
    >
      {caption}
    </button>
  );
};

export default FilledButton;
