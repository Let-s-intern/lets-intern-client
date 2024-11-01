import ChevronDown from '@/assets/icons/chevron-down.svg?react';

export interface BenefitCardProps {
  type: 'single' | 'double';
  title: string;
  options: string[];
  mobileUrl?: string;
  desktopUrl?: string;
}

const BenefitCard = ({
  type,
  title,
  options,
  mobileUrl,
  desktopUrl,
}: BenefitCardProps) => {
  const isMobile = window.innerWidth < 768;

  return (
    <div
      className={`flex w-full flex-col gap-y-6 rounded-md bg-neutral-95 px-4 pb-6 pt-5 text-black md:flex-row md:gap-x-2.5 md:bg-white md:p-0 ${type === 'single' ? 'md:min-h-[160px]' : 'md:h-full md:basis-1/2'}`}
    >
      {isMobile
        ? mobileUrl && (
            <img
              src={mobileUrl}
              alt="different"
              className="h-[261px] w-full rounded-md object-cover md:w-[484px]"
            />
          )
        : desktopUrl && (
            <img
              src={desktopUrl}
              alt="different"
              className={`h-full ${type === 'single' ? 'w-1/4' : 'min-h-[302px] w-1/2'} rounded-md border border-neutral-80 object-cover`}
            />
          )}
      <div
        className={`flex flex-1 flex-col gap-y-3 md:h-full md:rounded-md ${type === 'single' ? 'md:p-10' : 'md:min-h-[302px] md:px-4 md:py-10'} md:bg-neutral-95`}
      >
        <div className="flex w-full flex-col gap-y-2.5 md:gap-y-6">
          <h4 className="whitespace-pre text-small18 font-bold md:text-medium22">
            {title}
          </h4>
          <div className="flex w-full flex-col gap-y-1 md:gap-y-3">
            {options.map((option, index) => (
              <div key={index} className="flex items-start">
                <ChevronDown
                  className="shrink-0 text-challenge"
                  width={24}
                  height={24}
                />
                <p className="whitespace-pre text-wrap break-keep pt-px text-xsmall14 font-medium text-neutral-30 md:whitespace-normal md:pt-0 md:text-small18">
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
