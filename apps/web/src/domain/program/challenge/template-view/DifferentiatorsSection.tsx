import SectionHeader from '@/common/header/SectionHeader';
import ChallengeCheckbox from '@/assets/icons/challenge-checkbox.svg';
import MainTitle from '../ui/MainTitle';
import {
  ChecklistItemConfig,
  DifferentiatorItemConfig,
  DifferentiatorsSectionConfig,
} from './types';

const INACTIVE_COLOR = '#ACAFB6';

const Checklist = ({
  items,
  isActive,
  primaryColor,
  lightAccentColor,
}: {
  items: ChecklistItemConfig[];
  isActive: boolean;
  primaryColor: string;
  lightAccentColor: string;
}) => {
  const bgColor = isActive ? lightAccentColor : '#F3F3F3';
  const checkboxColor = isActive ? primaryColor : INACTIVE_COLOR;

  return (
    <div
      className="rounded-xs flex flex-col gap-3 p-5 md:gap-5 md:rounded-md md:px-[34px] md:py-[35px]"
      style={{ backgroundColor: bgColor }}
    >
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-3">
          <ChallengeCheckbox
            style={{ color: checkboxColor }}
            className="h-5 w-5 flex-shrink-0 md:h-9 md:w-9"
            aria-hidden="true"
          />
          <span className="text-xxsmall12 text-neutral-35 md:text-small20">
            {item.text}
          </span>
        </div>
      ))}
    </div>
  );
};

const Differentiator = ({
  number,
  title,
  before,
  after,
  primaryColor,
  lightAccentColor,
}: DifferentiatorItemConfig & {
  primaryColor: string;
  lightAccentColor: string;
}) => {
  return (
    <div className="flex flex-col gap-5 md:gap-8">
      <div className="flex flex-col gap-2">
        <span className="text-medium32 text-neutral-0 md:text-medium24 font-semibold">
          {number}
        </span>
        <h3 className="text-small16 text-neutral-0 md:text-medium24 font-bold md:font-semibold">
          {title}
        </h3>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
        <div className="flex flex-col gap-2">
          <span className="text-xsmall14 md:text-small20 pl-[6px] font-semibold text-neutral-50">
            Before
          </span>
          <Checklist
            items={before}
            isActive={false}
            primaryColor={primaryColor}
            lightAccentColor={lightAccentColor}
          />
        </div>
        <div className="flex flex-col gap-2">
          <span
            className="pl-[6px]text-xsmall14 md:text-small20 font-semibold"
            style={{ color: primaryColor }}
          >
            After
          </span>
          <Checklist
            items={after}
            isActive={true}
            primaryColor={primaryColor}
            lightAccentColor={lightAccentColor}
          />
        </div>
      </div>
    </div>
  );
};

interface Props {
  config: DifferentiatorsSectionConfig;
}

function DifferentiatorsSection({ config }: Props) {
  const { primaryColor, lightAccentColor, subtitle, title, differentiators } =
    config;

  return (
    <section
      id="differentiators"
      className="flex scroll-mt-[56px] flex-col items-center px-5 pb-10 pt-16 md:scroll-mt-[100px] md:px-0 md:pb-[120px] md:pt-[140px]"
    >
      <SectionHeader className="mb-6 w-full text-left md:mb-[42px] md:text-center">
        차별점
      </SectionHeader>
      <div className="text-small14 text-neutral-35 md:text-small18 mb-3 text-center">
        {subtitle}
      </div>
      <MainTitle className="mb-12 flex flex-col items-center">
        {title}
      </MainTitle>

      <div className="flex w-full min-w-[320px] max-w-[1130px] flex-col gap-10">
        {differentiators.map((item, index) => (
          <article key={index} className="w-full">
            <Differentiator
              {...item}
              primaryColor={primaryColor}
              lightAccentColor={lightAccentColor}
            />
          </article>
        ))}
      </div>
    </section>
  );
}

export default DifferentiatorsSection;
