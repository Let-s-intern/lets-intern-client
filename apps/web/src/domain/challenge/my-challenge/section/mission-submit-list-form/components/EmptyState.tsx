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
        className="text-xsmall14 text-neutral-20 text-center"
        dangerouslySetInnerHTML={{
          __html: text.replace(/\n/g, '<br>'),
        }}
      />
      <button
        type="button"
        className="rounded-xxs border-primary text-xsmall14 text-primary hover:bg-primary/5 border bg-white px-2.5 py-1.5 font-medium"
        onClick={onButtonClick}
      >
        {buttonText}
      </button>
    </>
  );
};
