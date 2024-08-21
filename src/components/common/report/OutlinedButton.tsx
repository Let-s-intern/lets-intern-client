const OutlinedButton = ({ caption }: { caption: string }) => {
  return (
    <button className="rounded-md border border-neutral-60 px-3 py-1.5 text-xsmall14 text-neutral-40">
      {caption}
    </button>
  );
};

export default OutlinedButton;
