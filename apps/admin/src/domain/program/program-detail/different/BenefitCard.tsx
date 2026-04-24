import ChevronDown from '@/assets/icons/chevron-down.svg?react';

export interface BenefitCardProps {
  title: string;
  options: string[];
  imgUrl: string;
}

const BenefitCard = ({ title, options, imgUrl }: BenefitCardProps) => {
  return (
    <div className={`flex flex-col gap-2.5 md:h-[186px] md:flex-row`}>
      <img
        src={imgUrl as string}
        className="h-full w-full shrink-0 rounded-md border border-neutral-70 bg-neutral-90 md:w-[256px]"
        alt=""
      />
      <div
        className={`flex w-full shrink-0 flex-col gap-y-3 rounded-md bg-neutral-95 px-5 py-8 md:w-[734px] md:flex-1 md:rounded-md md:px-[30px] md:py-10`}
      >
        <div className="flex w-full flex-col gap-y-2.5 md:gap-y-6">
          <h4 className="whitespace-pre text-small18 font-bold text-black lg:text-medium22">
            {title}
          </h4>
          <div className="flex w-full flex-col gap-y-1 md:gap-y-3">
            {options.map((option, index) => (
              <div key={index} className="flex items-start">
                <ChevronDown className="shrink-0" width={24} height={24} />
                <p className="whitespace-pre-line break-keep pt-px text-xsmall14 font-medium text-neutral-30 md:pt-0 lg:text-small18">
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
