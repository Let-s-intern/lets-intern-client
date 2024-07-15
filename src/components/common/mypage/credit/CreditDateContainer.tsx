import dayjs from 'dayjs';

const formatDate = (date: string) => {
  return dayjs(date).format('YYYY.MM.DD');
};

const CreditDateContainer = ({ date }: { date: string }) => {
  return (
    <div className="flex w-full items-center justify-start border-y border-neutral-80 bg-neutral-90 px-3 py-2 text-base">
      {formatDate(date)}
    </div>
  );
};

export default CreditDateContainer;
