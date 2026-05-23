import Box from '@/domain/program/program-detail/Box';
import ChallengeCheckbox from '@/assets/icons/challenge-checkbox.svg';
import { CSSProperties, ReactNode } from 'react';
import { CheckListSectionConfig } from './types';

const Badge = ({
  children,
  style,
}: {
  children?: ReactNode;
  style?: CSSProperties;
}) => {
  return (
    <span
      className="text-xsmall14 md:text-small20 absolute -top-5 left-4 z-10 -rotate-12 rounded-sm px-4 py-1 font-semibold text-white md:left-6 md:px-4"
      style={style}
    >
      {children}
    </span>
  );
};

const CheckList = ({
  children,
  className,
  checkboxColor,
}: {
  children?: ReactNode;
  className?: string;
  checkboxColor: string;
}) => {
  return (
    <div
      className={`flex w-full gap-2 text-left md:items-center md:gap-4 ${className ?? ''}`}
    >
      <div className="shrink-0">
        <ChallengeCheckbox
          style={{ color: checkboxColor }}
          className="h-5 w-5 md:h-[37px] md:w-[37px]"
          aria-hidden="true"
        />
      </div>
      <div className="flex flex-col tracking-tight md:flex-row md:gap-1">
        {children}
      </div>
    </div>
  );
};

interface Props {
  config: CheckListSectionConfig;
}

function CheckListSection({ config }: Props) {
  const { primaryColor, lightAccentColor, backgroundColor, items } = config;

  return (
    <section
      className="flex flex-col items-center pb-[70px] pt-[50px] text-center md:pb-[142px] md:pt-[88px]"
      style={{ backgroundColor }}
    >
      <div className="flex w-full max-w-[320px] flex-col md:max-w-[1000px] md:px-10 lg:px-0">
        <div className="flex w-full flex-col gap-16 md:gap-32 md:px-16">
          {items.map((item, index) => (
            <div
              key={item.title[0]}
              className="flex w-full flex-col gap-6 md:items-center md:gap-10"
            >
              <Box
                className={`text-small16 md:text-medium24 relative flex w-full max-w-[860px] flex-col py-6 font-semibold md:p-10 ${
                  index === 0 ? 'justify-center gap-1 md:flex-row' : ' '
                }`}
                style={{ backgroundColor: lightAccentColor }}
              >
                <Badge style={{ backgroundColor: primaryColor }}>
                  추천 {index + 1}
                </Badge>
                {item.title.map((ele) => (
                  <span key={ele} className="shrink-0">
                    {ele}
                  </span>
                ))}
              </Box>
              <div className="flex w-fit flex-col gap-5 px-0 md:items-center">
                {item.content.map((group) => (
                  <CheckList
                    key={group[0]}
                    className={
                      group.length > 1 ? 'justify-start' : 'items-center'
                    }
                    checkboxColor={primaryColor}
                  >
                    {group.map((ele) => (
                      <span
                        key={ele}
                        className="text-xsmall14 text-neutral-35 xs:text-xsmall14 md:text-small20 shrink-0"
                      >
                        {ele}
                      </span>
                    ))}
                  </CheckList>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CheckListSection;
