interface ReviewHeaderProps {
  program: any;
}

const ReviewHeader = ({ program }: ReviewHeaderProps) => {
  return (
    <>
      <header className="py-3">
        <span className="font-medium text-primary">{program.type}</span>
        <h1 className="mt-3 text-xl font-bold text-neutral-grey">
          {program.title}
        </h1>
        <span className="text-stone-300">
          {program.startDate} ~ <br className="sm:hidden" /> {program.dueDate}
        </span>
      </header>
      <hr />
    </>
  );
};

export default ReviewHeader;
