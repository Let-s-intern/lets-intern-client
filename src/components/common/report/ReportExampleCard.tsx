import CheckIcon from '@/assets/icons/chevron-down.svg?react';
import { REPORT_EXAMPLE } from '@/data/reportConstant';
import { ReportExampleItem } from '@/types/interface';

interface ReportExampleCardProps {
  example: ReportExampleItem;
  mainColor: string;
  subColor: string;
}

const ReportExampleCard = ({
  example,
  mainColor,
  subColor,
}: ReportExampleCardProps) => {
  const description = REPORT_EXAMPLE['RESUME'].content[0].description;

  return (
    <div className="flex min-h-full w-[90%] shrink-0 flex-col md:w-[calc(50%-6px)]">
      <div
        className="flex h-[400px] flex-col gap-y-4 overflow-hidden rounded-t-[10px] px-5 pt-6 md:h-[513px]"
        style={{ backgroundColor: mainColor }}
      >
        <h5 className="whitespace-pre-wrap break-keep text-center text-small18 font-bold text-neutral-0 md:whitespace-normal">
          {example.subTitle}
        </h5>
        <div className="w-full flex-1 overflow-hidden px-2.5">
          <img
            src={example.imgUrl}
            alt={example.subTitle}
            className="h-full w-full object-cover object-top"
          />
        </div>
      </div>
      <div
        className="flex flex-1 flex-col gap-y-3 rounded-b-[10px] py-6 pl-4 pr-5"
        style={{ backgroundColor: subColor }}
      >
        {description.map((desc, index) => (
          <div className="flex w-full gap-x-0.5" key={`${example.id}-${index}`}>
            <CheckIcon width={24} height={24} />
            <p className="flex-1 whitespace-pre-wrap text-xsmall14 font-semibold text-neutral-0">
              {desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportExampleCard;
