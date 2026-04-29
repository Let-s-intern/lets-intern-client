interface ReviewHeaderProps {
  program: any;
}

const ReviewHeader = ({ program }: ReviewHeaderProps) => {
  return (
    <>
      <header className="py-3">
        <span className="text-primary font-medium">{program.type}</span>
        <h1 className="text-neutral-grey mt-3 text-xl font-bold">
          {program.title}
        </h1>
      </header>
      <hr className="mt-3" />
    </>
  );
};

export default ReviewHeader;
