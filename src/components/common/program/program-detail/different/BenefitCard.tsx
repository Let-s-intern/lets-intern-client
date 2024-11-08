import ChevronDown from '@/assets/icons/chevron-down.svg?react';

export interface BenefitCardProps {
  title: string;
  options: string[];
  imgUrl: string;
}

const BenefitCard = ({ title, options, imgUrl }: BenefitCardProps) => {
  return (
    <div className={`flex h-[186px] gap-x-2.5`}>
      <img
        src={imgUrl}
        className="h-full w-[256px] shrink-0 rounded-md border border-neutral-70"
      />
      <div
        className={`flex w-72 shrink-0 flex-col gap-y-3 rounded-md bg-neutral-95 px-5 py-8 md:w-[734px] md:flex-1 md:rounded-md md:px-[30px] md:py-10`}
      >
        <div className="flex w-full flex-col gap-y-2.5 md:gap-y-6">
          <h4 className="whitespace-pre text-small18 font-bold text-black lg:text-medium22">
            {title}
          </h4>
          <div className="flex w-full flex-col gap-y-1 md:gap-y-3">
            {options.map((option, index) => (
              <div key={index} className="flex items-start">
                <ChevronDown className="shrink-0" width={24} height={24} />
                <p className="break-keep pt-px text-xsmall14 font-medium text-neutral-30 md:whitespace-normal md:pt-0 lg:text-small18">
                  {option}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenefitCard;
