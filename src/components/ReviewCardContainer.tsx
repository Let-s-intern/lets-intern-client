interface Props {
  children: React.ReactNode;
}

const ReviewCardContainer = ({ children }: Props) => {
  return (
    <div className="flex flex-col gap-4 p-4 border rounded-sm sm:flex-row border-neutral-80 sm:gap-10">
      {children}
    </div>
  );
};

export default ReviewCardContainer;
