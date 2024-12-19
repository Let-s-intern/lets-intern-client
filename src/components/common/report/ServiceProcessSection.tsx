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

      <main className="mt-10 flex flex-col items-center gap-5">
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

        {/* 2 단계 */}
        <ProcessCard className="bg-[#14BCFF]">
          <NumberedTitle numberClassName="bg-[#DDF5FF]" number={2}>
            렛츠커리어 취업 연구팀의
            <br className="md:hidden" /> 세심한 진단 및 분석
          </NumberedTitle>

          <div className="mt-6 flex flex-col items-center gap-2">
            <ContentBox>
              <NumberedContent number="2-1">
                직무와 문항에 맞춘 맞춤형 진단이 진행됩니다.
              </NumberedContent>
              <div className="mt-3">
                <div className="mb-1 w-fit rounded-xxs bg-neutral-30 px-2 py-1 text-xxsmall12 font-semibold text-white">
                  6가지 핵심 진단 기준
                </div>
                <p className="text-xxsmall12">
                  가독성 / 구성 및 구조 / 직무 적합성 / 정확성 /
                  <br className="md:hidden" /> 간결성 / 구체성
                </p>
              </div>
            </ContentBox>

            <ContentBox>
              <NumberedContent number="2-2">
                진단 완료까지 48시간 소요됩니다.
              </NumberedContent>
              <ContentBox className="mt-3 bg-[#DDF5FF] text-xxsmall12 font-medium">
                <p className="mb-3">
                  *다만, 신청자가 많을 경우 플랜에 따라 소요 시간이 달라질 수
                  있습니다.
                </p>
                <ul className="list-disc pl-4">
                  <li>베이직 플랜: 48시간 이내</li>
                  <li>프리미엄 플랜: 72시간 이내</li>
                  <li> 현직자 피드백 옵션: 최대 5일 이내</li>
                </ul>
              </ContentBox>
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
  numberClassName,
  numberStyle,
}: {
  number?: string | number;
  children?: ReactNode;
  numberClassName?: string;
  numberStyle?: CSSProperties;
}) {
  return (
    <div className="flex items-center justify-center gap-3">
      <div
        style={numberStyle}
        className={twMerge(
          'flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-40 text-xsmall14 font-semibold',
          numberClassName,
        )}
      >
        {number ?? 1}
      </div>
      <span className="block text-small18 font-bold">{children}</span>
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
