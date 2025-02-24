import { ReactNode } from 'react';
import MoreHeader from '../ui/MoreHeader';
import ProgramItem, { ProgramItemProps } from './ProgramItem';

interface ProgramContainerProps {
  title: ReactNode;
  subTitle?: string;
  moreUrl?: string;
  programs: ProgramItemProps[];
}

const ProgramContainer = ({ ...props }: ProgramContainerProps) => {
  return (
    <div className="flex w-full max-w-[1160px] flex-col gap-y-6">
      <div className="px-5 md:px-0">
        <MoreHeader
          subtitle={props.subTitle}
          href={props.moreUrl}
          isVertical
          isBig
        >
          {props.title}
        </MoreHeader>
      </div>
      <div className="flex w-fit max-w-full gap-x-3 overflow-auto px-5 scrollbar-hide md:grid md:w-full md:grid-cols-5 md:gap-x-4 md:gap-y-12 md:px-0">
        {props.programs.map((program, index) => (
          <ProgramItem key={index} {...program} />
        ))}
      </div>
    </div>
  );
};

export default ProgramContainer;
