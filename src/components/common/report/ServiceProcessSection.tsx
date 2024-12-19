import { useMediaQuery } from '@mui/material';

import { convertReportTypeToDisplayName, ReportType } from '@/api/report';
import { twMerge } from '@/lib/twMerge';
import { ReportColors } from '@/types/interface';
import { CSSProperties, memo, ReactNode } from 'react';
import MainHeader from './MainHeader';
import SectionHeader from './SectionHeader';
import SubHeader from './SubHeader';

const SECTION_HEADER = '서비스 이용 안내';
const SUB_HEADER = '48시간 이내 진단 완료!';

interface ServiceProcessSectionProps {
  colors: ReportColors;
  reportType: ReportType;
}

const ServiceProcessSection = ({
  colors,
  reportType,
}: ServiceProcessSectionProps) => {
  const SUB_HEADER_STYLE = {
    color: colors.primary.DEFAULT,
  };
  const BACKGROUND_COLOR_PRIMARY_400 = {
    backgroundColor: colors.primary[400],
  };
  const BACKGROUND_COLOR_PRIMARY_100 = {
    backgroundColor: colors.primary[100],
  };
  const BACKGROUND_COLOR_HIGHLIGHT = {
    backgroundColor: colors.highlight.DEFAULT,
  };
  const MAIN_HEADER = `진단 완료까지 단 이틀,\n${convertReportTypeToDisplayName(reportType)} 피드백 REPORT은\n이렇게 진행됩니다.`;

  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <section className="w-full px-5 py-16 md:pb-36 md:pt-28 lg:px-0">
      <header>
        <SectionHeader className="mb-6">{SECTION_HEADER}</SectionHeader>
        <SubHeader className="mb-1 md:mb-3" style={SUB_HEADER_STYLE}>
          {SUB_HEADER}
        </SubHeader>
        <MainHeader>{MAIN_HEADER}</MainHeader>
      </header>

      <main className="mt-10">
        {/* 1 단계 */}
        <ProcessCard style={BACKGROUND_COLOR_PRIMARY_400}>
          <NumberedTitle numberStyle={BACKGROUND_COLOR_PRIMARY_100} number={1}>
            서비스 신청 및 서류 업로드
          </NumberedTitle>

          <div className="mt-6 flex flex-col items-center gap-2">
            <ContentBox>
              <NumberedContent number="1-1">
                원하는 플랜을 선택하고 결제를 완료합니다.
              </NumberedContent>
              <div className="mt-3 flex items-start gap-2">
                <div
                  className="w-fit shrink-0 rounded-xxs px-2 py-1 text-xxsmall12 font-semibold text-white"
                  style={BACKGROUND_COLOR_HIGHLIGHT}
                >
                  작성꿀팁
                </div>
                <p className="text-xxsmall12 font-semibold">
                  어떤 부분에서 어려움을 겪고 있는지,
                  <br /> 무엇을 개선하고 싶은지 적어주시면,
                  <br /> 전문가가 보다 정확한 피드백을
                  <br /> 제공해드려요!
                </p>
              </div>
            </ContentBox>

            <ContentBox>
              <NumberedContent number="1-2">
                지원 직무와 고민 사항을 작성해 주세요.
              </NumberedContent>
            </ContentBox>

            <ContentBox className="flex flex-col gap-3">
              <NumberedContent number="1-3">
                진단을 원하는 이력서는 결제 시<br /> 바로 업로드하거나,
                <br /> 이후 원하는 시점에 제출할 수 있습니다.
              </NumberedContent>
              <div className="flex flex-col gap-1">
                <ContentBox className="rounded-xxs bg-[#DDF5FF] py-1 text-center text-xxsmall12 font-semibold">
                  결제 시, 바로 제출
                </ContentBox>
                <ContentBox
                  className="rounded-xxs py-1 text-center text-xxsmall12 font-semibold"
                  style={{ backgroundColor: colors.primary[50] }}
                >
                  결제 후, 원하는 시점에 제출
                </ContentBox>
              </div>
              <span className="text-xxsmall12">
                *시간이 필요하다면 서류 업로드 없이 먼저 신청하고,
                <br /> 준비된 후 제출하셔도 괜찮습니다.
              </span>
            </ContentBox>
          </div>
        </ProcessCard>
      </main>
    </section>
  );
};

export default ServiceProcessSection;

const ProcessCard = memo(function ProcessCard({
  children,
  className,
  style,
}: {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      style={style}
      className={twMerge(
        'w-full rounded-md bg-primary-80 px-5 py-6',
        className,
      )}
    >
      {children}
    </div>
  );
});

const NumberedTitle = memo(function NumberedTitle({
  number,
  children,
  className,
  numberStyle,
}: {
  number?: string | number;
  children?: ReactNode;
  className?: string;
  numberStyle?: CSSProperties;
}) {
  return (
    <div className="flex items-center justify-center gap-3">
      <div
        style={numberStyle}
        className={twMerge(
          'flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-40 text-xsmall14 font-semibold',
        )}
      >
        {number ?? 1}
      </div>
      <span className={twMerge('block text-small18 font-bold', className)}>
        {children}
      </span>
    </div>
  );
});

const NumberedContent = memo(function NumberedContent({
  number,
  children,
}: {
  number?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex items-start gap-2 text-xsmall14 font-semibold">
      <span className="shrink-0">{number ?? 1}</span>
      <span>{children}</span>
    </div>
  );
});

const ContentBox = memo(function ContentBox({
  children,
  className,
  style,
}: {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      style={style}
      className={twMerge('w-full rounded-sm bg-white p-3', className)}
    >
      {children}
    </div>
  );
});
