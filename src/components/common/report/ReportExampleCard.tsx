import CheckIcon from '@/assets/icons/chevron-down.svg?react';
import { reportExampleContentType } from '@/data/reportConstant';

interface ReportExampleCardProps {
  example: reportExampleContentType;
}

const ReportExampleCard = ({ example }: ReportExampleCardProps) => {
  return (
    <div className="flex w-[90%] shrink-0 flex-col whitespace-pre md:w-[calc(50%-6px)]">
      <div className="flex flex-col gap-y-3 overflow-hidden rounded-t-[10px] bg-neutral-10 px-5 pt-3 md:gap-y-2.5 md:px-8 md:pt-6">
        <h5 className="break-keep text-center text-xsmall16 font-bold text-white md:text-small20">
          {example.title}
        </h5>
        <div className="w-full px-2.5 md:px-8">
          <img
            src={example.src}
            alt={example.title}
            className="h-auto w-full object-cover object-top"
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-y-3 rounded-b-[10px] bg-white py-6 pl-4 pr-5">
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
