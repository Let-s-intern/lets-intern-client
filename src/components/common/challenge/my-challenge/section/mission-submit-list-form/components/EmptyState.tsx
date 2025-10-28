interface EmptyStateProps {
  text: string;
  buttonText: string;
  onButtonClick?: () => void;
}

export const EmptyState = ({
  text,
  buttonText,
  onButtonClick,
}: EmptyStateProps) => {
  return (
    <>
      <div
        className="text-center text-xsmall14 text-neutral-20"
        dangerouslySetInnerHTML={{
          __html: text.replace(/\n/g, '<br>'),
        }}
      />
      <button
        type="button"
        className="rounded-xxs border border-primary bg-white px-2.5 py-1.5 text-xsmall14 font-medium text-primary hover:bg-primary/5"
        onClick={onButtonClick}
      >
        {buttonText}
      </button>
    </>
  );
};
