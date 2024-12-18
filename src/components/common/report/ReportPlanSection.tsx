import { ReactNode, useState } from 'react';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi2';

import { ReportColors } from '@/types/interface';
import { useMediaQuery } from '@mui/material';
import MainHeader from './MainHeader';
import SectionHeader from './SectionHeader';
import SubHeader from './SubHeader';

import CheckIcon from '@/assets/icons/chevron-down.svg?react';
import { twMerge } from '@/lib/twMerge';

const SECTION_HEADER = '가격 및 플랜';
const SUB_HEADER = '자신있게 추천합니다!';
const MAIN_HEADER = '취업 성공을 위한\n맞춤형 피드백 플랜, 그리고 옵션까지';

const BASIC_PLAN = [
  '이력서 작성 고민을 해결하는 맞춤형 솔루션 제공',
  '총 6가지 기준을 바탕으로 이력서 형식 및 내용 피드백',
  '희망 직무/산업에 맞춘 합격자 예시 자료 제공',
];

interface ReportPlanSectionProps {
  colors: ReportColors;
}

const ReportPlanSection = ({ colors }: ReportPlanSectionProps) => {
  const SUB_HEADER_STYLE = {
    color: colors.primary.DEFAULT,
  };

  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <section className="w-full bg-neutral-90 px-5 py-16 md:py-24">
      <header>
        <SectionHeader className="mb-6">{SECTION_HEADER}</SectionHeader>
        <SubHeader className="mb-1 md:mb-3" style={SUB_HEADER_STYLE}>
          {SUB_HEADER}
        </SubHeader>
        <MainHeader>{MAIN_HEADER}</MainHeader>
      </header>
      <main>
        <PlanBox>
          <DropDown
            title="베이직 플랜"
            initialOpenState={isMobile ? false : true}
          >
            <div className="flex flex-col gap-3">
              {BASIC_PLAN.map((item, index) => (
                <CheckListItem key={index} content={item} />
              ))}
            </div>
          </DropDown>
        </PlanBox>
        <PlanBox bannerText="채용 공고 맞춤형 이력서를 원한다면,">test</PlanBox>
      </main>
    </section>
  );
};

export default ReportPlanSection;

function PlanBox({
  bannerText,
  bannerColor,
  children,
}: {
  bannerText?: string;
  bannerColor?: string;
  children?: ReactNode;
}) {
  const BANNER_STYLE = {
    backgroundColor: bannerColor,
  };

  return (
    <div className="overflow-hidden rounded-md">
      {/* Banner */}
      {bannerText && (
        <div
          style={BANNER_STYLE}
          className="bg-primary py-1 text-center text-xsmall14 font-semibold"
        >
          {bannerText}
        </div>
      )}
      <div className="bg-white px-5 py-6">{children}</div>
    </div>
  );
}

function DropDown({
  title,
  children,
  initialOpenState = true,
}: {
  title: string;
  children?: ReactNode;
  initialOpenState?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(initialOpenState);

  return (
    <>
      <div
        className="flex cursor-pointer items-center justify-between rounded-md bg-black px-5 py-3 text-xsmall16 font-semibold text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        {isOpen ? (
          <HiChevronUp size={24} color="#7A7D84" />
        ) : (
          <HiChevronDown size={24} color="#7A7D84" />
        )}
      </div>
      {isOpen && (
        <div className="mt-4 rounded-md bg-neutral-95 px-4 py-5">
          {children}
        </div>
      )}
    </>
  );
}

function CheckListItem({
  content,
  className,
}: {
  content?: string;
  className?: string;
}) {
  return (
    <div className="flex items-start gap-0.5">
      <CheckIcon className="h-auto w-6" color="#27272D" />
      <span
        className={twMerge(
          'text-xsmall14 font-medium text-neutral-0',
          className,
        )}
      >
        {content}
      </span>
    </div>
  );
}
