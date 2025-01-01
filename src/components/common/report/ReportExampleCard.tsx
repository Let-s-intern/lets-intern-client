import CheckIcon from '@/assets/icons/chevron-down.svg?react';
import { reportExampleContentType } from '@/data/reportConstant';

interface ReportExampleCardProps {
  example: reportExampleContentType;
}

const ReportExampleCard = ({ example }: ReportExampleCardProps) => {
  return (
    <div className="w-full flex-1 flex-col whitespace-pre">
      <div className="flex flex-col justify-between gap-y-3 overflow-hidden rounded-t-[10px] bg-neutral-10 px-5 pt-3 md:gap-y-2.5 md:px-8 md:pt-6">
        <h5 className="whitespace-pre-line break-keep text-center text-xsmall16 font-bold text-white md:text-small20">
          {example.title}
        </h5>
        <div className="w-full px-2.5 md:px-8">
          <img
            src={example.src}
            alt={example.title}
            className="h-auto w-full rounded-t-xxs object-cover object-top shadow-none"
          />
        </div>
      </div>
      <div className="flex min-h-[114px] flex-1 flex-col gap-y-3 rounded-b-[10px] bg-white pb-6 pl-4 pr-5 pt-5 md:min-h-[131px] md:pt-6">
        {example.description.map((desc, index) => (
          <div
            className="flex w-full gap-x-0.5"
            key={`${example.title}-${index}`}
          >
            <CheckIcon width={24} height={24} />
            <p className="flex-1 text-wrap text-xsmall14 font-semibold text-neutral-0 md:text-xsmall16">
              {desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportExampleCard;
