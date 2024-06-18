interface OutlineButtonProps {
  caption: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const OutlineButton = ({ caption, onClick }: OutlineButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="text-1.125-medium w-full rounded-md border-2 border-primary px-6 py-3 text-primary-dark"
    >
      {caption}
    </button>
  );
};

export default OutlineButton;
