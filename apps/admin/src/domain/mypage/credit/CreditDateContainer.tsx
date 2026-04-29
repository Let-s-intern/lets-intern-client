const CreditDateContainer = ({ date }: { date: string }) => {
  return (
    <div className="border-neutral-80 bg-neutral-90 flex w-full items-center justify-start border-y px-3 py-2 text-base">
      {date}
    </div>
  );
};

export default CreditDateContainer;
