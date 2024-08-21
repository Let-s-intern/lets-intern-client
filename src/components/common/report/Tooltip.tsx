const Tooltip = ({ alt }: { alt: string }) => {
  return (
    <img
      className="h-auto w-5 cursor-pointer"
      src="/icons/message-question-circle.svg"
      alt={alt}
    />
  );
};

export default Tooltip;
