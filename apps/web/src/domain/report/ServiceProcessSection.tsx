import { CSSProperties, memo, ReactNode } from 'react';

import { convertReportTypeToDisplayName, ReportType } from '@/api/report';
import { REPORT_GUIDE_ID } from '@/domain/report/ReportNavigation';
import { personalStatementColors } from '@/domain/report/ReportPersonalStatementPage';
import { resumeColors } from '@/domain/report/ReportResumePage';
import { twMerge } from '@/lib/twMerge';
import clsx from 'clsx';
import MainHeader from './MainHeader';
import SectionHeader from './SectionHeader';
import SubHeader from './SubHeader';

const SECTION_HEADER = '서비스 이용 방법';

interface ServiceProcessSectionProps {
  reportType: ReportType;
}

const ServiceProcessSection = ({ reportType }: ServiceProcessSectionProps) => {
  const subHeader = '48시간 이내 진단 완료!';
  const subHeaderStyle = {
    color:
      reportType === 'PERSONAL_STATEMENT'
        ? personalStatementColors.C34AFF
        : resumeColors._11AC5C,
  };
  const mainCardStyle = {
    backgroundColor:
      reportType === 'PERSONAL_STATEMENT'
        ? personalStatementColors.CA60FF
        : resumeColors._2CE282,
  };
  const numberStyle = {
    backgroundColor:
      reportType === 'PERSONAL_STATEMENT'
        ? personalStatementColors.F9EEFF
        : resumeColors.B1FFD6,
    color:
      reportType === 'PERSONAL_STATEMENT'
        ? personalStatementColors.CA60FF
        : 'black',
  };
  const badgeStyle = {
    backgroundColor:
      reportType === 'PERSONAL_STATEMENT' ? '#27272D' : resumeColors._14BCFF,
  };
  const contentBoxStyle = {
    backgroundColor:
      reportType === 'PERSONAL_STATEMENT'
        ? personalStatementColors.F9EEFF
        : resumeColors.E8FDF2,
  };

  return (
    <section
      id={REPORT_GUIDE_ID}
      className="w-full px-5 py-16 md:py-28 lg:px-0"
    >
      <div>
        <SectionHeader className="mb-6 md:mb-14">
          {SECTION_HEADER}
        </SectionHeader>
        <SubHeader className="mb-1 md:mb-3" style={subHeaderStyle}>
          {subHeader}
        </SubHeader>
        <MainHeader>
          진단 완료까지 단 이틀,
          <br /> {convertReportTypeToDisplayName(reportType)} 피드백 REPORT은
          <br className="md:hidden" /> 이렇게 진행됩니다.
        </MainHeader>
      </div>

      <main className="mx-auto mt-10 flex max-w-[690px] flex-col items-center gap-5 md:mt-11 md:gap-8">
        {/* 1단계 */}
        <ProcessCard data-section="workflow-1" style={mainCardStyle}>
          <NumberedTitle
            numberStyle={numberStyle}
            className={clsx({
              'text-white': reportType === 'PERSONAL_STATEMENT',
            })}
            number={1}
          >
            서비스 신청 및 서류 업로드
          </NumberedTitle>

          <div className="mt-6 flex flex-col items-center gap-2 md:gap-4">
            <ContentBox>
              <NumberedContent number="1-1">
                원하는 플랜을 선택하고 결제를 완료합니다.
              </NumberedContent>
            </ContentBox>

            <ContentBox>
              <NumberedContent number="1-2">
                지원 직무와 고민 사항을 작성해 주세요.
              </NumberedContent>
              <div className="mt-3 flex items-start gap-2">
                <Badge style={badgeStyle}>작성 꿀팁</Badge>
                <p className="text-xxsmall12 font-semibold md:text-xsmall16 md:font-medium">
                  어떤 부분에서 어려움을 겪고 있는지,
                  <br className="md:hidden" /> 무엇을 개선하고 싶은지
                  적어주시면, 전문가가 보다 정확한 피드백을
                  <br className="md:hidden" /> 제공해 드려요!
                </p>
              </div>
            </ContentBox>

            <ContentBox className="flex flex-col gap-3">
              <NumberedContent number="1-3">
                진단을 원하는 이력서는 결제 시<br className="md:hidden" /> 바로
                업로드하거나,
                <br /> 이후 원하는 시점에 제출할 수 있습니다.
              </NumberedContent>
              <div className="md:flew-row flex flex-col gap-1 md:flex-row md:gap-3">
                <ContentBox className="rounded-xxs bg-[#DDF5FF] py-1 text-center text-xxsmall12 font-semibold md:rounded-xs md:py-2.5 md:text-xsmall16">
                  결제 시, 바로 제출
                </ContentBox>
                <ContentBox
                  className="rounded-xxs py-1 text-center text-xxsmall12 font-semibold md:rounded-xs md:py-2.5 md:text-xsmall16"
                  style={contentBoxStyle}
                >
                  결제 후, 원하는 시점에 제출
                </ContentBox>
              </div>
            </ContentBox>
          </div>
        </ProcessCard>

        {/* 2단계 */}
        <ProcessCard data-section="workflow-2" className="bg-[#14BCFF]">
          <NumberedTitle numberClassName="bg-[#DDF5FF]" number={2}>
            렛츠커리어 취업 연구팀의
            <br className="md:hidden" /> 세심한 진단 및 분석
          </NumberedTitle>

          <div className="mt-6 flex flex-col items-center gap-2 md:gap-4">
            <ContentBox>
              <NumberedContent number="2-1">
                직무와 문항에 맞춘 맞춤형 진단이 진행됩니다.
              </NumberedContent>
            </ContentBox>

            {/* 자소서 시간 반영 */}
            <ContentBox>
              <NumberedContent number="2-2">
                진단 완료까지 48시간 소요됩니다.
              </NumberedContent>
              <ContentBox className="mt-3 bg-[#DDF5FF] text-xxsmall12 font-medium md:p-3 md:px-5 md:py-3 md:text-xsmall14">
                <p className="mb-3 md:mb-1">
                  *다만, 신청자가 많을 경우 플랜에 따라 소요 시간이 달라질 수
                  있습니다.
                </p>
                <ul className="list-disc pl-4">
                  <li>
                    베이직 플랜: {reportType === 'RESUME' ? 48 : 72}시간 이내
                  </li>
                  <li>
                    프리미엄 플랜: {reportType === 'RESUME' ? 3 : 5}일 이내
                  </li>
                  <li>
                    현직자 피드백 옵션: 최대 {reportType === 'RESUME' ? 5 : 7}일
                    이내
                  </li>
                </ul>
              </ContentBox>
            </ContentBox>
          </div>
        </ProcessCard>

        {/* 3단계 */}
        <ProcessCard data-section="workflow-3" style={mainCardStyle}>
          <NumberedTitle
            numberStyle={numberStyle}
            number={3}
            className={clsx({
              'text-white': reportType === 'PERSONAL_STATEMENT',
            })}
          >
            피드백 REPORT 확인
          </NumberedTitle>

          <div className="mt-6 flex flex-col items-center gap-2 md:gap-4">
            <ContentBox>
              <NumberedContent number="3-1">
                진단 완료 시, 알림톡으로 완료 알림이 전달됩니다.
              </NumberedContent>
            </ContentBox>

            <ContentBox className="flex flex-col gap-2 md:gap-3">
              <NumberedContent number="3-2">
                취업 연구팀이 작성한 상세 피드백
                <br className="md:hidden" /> REPORT를 확인합니다.
              </NumberedContent>
              <span className="text-xxsmall12 text-neutral-0 md:text-xsmall14 md:text-neutral-35">
                *MY 진단서 보기에서 확인할 수 있고, 발행된 리포트는 PDF로
                다운로드 가능합니다.
              </span>
            </ContentBox>
          </div>
        </ProcessCard>

        {/* 4단계 */}
        <ProcessCard data-section="workflow-4" style={mainCardStyle}>
          <NumberedTitle
            numberStyle={numberStyle}
            number={4}
            className={clsx({
              'text-white': reportType === 'PERSONAL_STATEMENT',
            })}
          >
            <span
              className={clsx(
                'text-xsmall14 font-medium opacity-75 md:text-xsmall16',
                { 'text-white': reportType === 'PERSONAL_STATEMENT' },
              )}
            >
              별도 구매 시
            </span>
            1:1 온라인 상담 진행
          </NumberedTitle>

          <div className="mt-6 flex flex-col items-center gap-2 md:gap-4">
            <ContentBox>
              <NumberedContent number="4-1">
                피드백 리포트를 바탕으로 40분간의 1:1 맞춤형 피드백이
                진행됩니다.
              </NumberedContent>
              <div className="mt-3 flex items-start gap-2">
                <Badge style={badgeStyle}>진행 꿀팁</Badge>
                <p className="text-xxsmall12 font-semibold md:text-xsmall16 md:font-medium">
                  리포트 확인 후, 궁금한 점이나 추가 질문을 미리 준비하시면 더욱
                  알찬 시간을 보낼 수 있어요!
                </p>
              </div>
            </ContentBox>

            <ContentBox>
              <NumberedContent number="4-2">
                1:1 온라인 상담 시간 동안 무제한으로 질문이 가능하며, 실시간으로
                이력서 첨삭도 진행됩니다.
              </NumberedContent>
            </ContentBox>

            <ContentBox className="flex flex-col gap-3">
              <NumberedContent number="4-3">
                1:1 온라인 상담을 미처 신청하지 못하셨다면, 별도 신청이
                가능합니다.
              </NumberedContent>
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
        'w-full rounded-md bg-primary-80 px-5 py-6 text-neutral-0 md:px-12 md:py-10',
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
  numberClassName,
  numberStyle,
}: {
  number?: string | number;
  children?: ReactNode;
  className?: string;
  numberClassName?: string;
  numberStyle?: CSSProperties;
}) {
  return (
    <div className="flex items-center justify-center gap-3">
      <div
        style={numberStyle}
        className={twMerge(
          'flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-40 text-xsmall14 font-semibold md:h-7 md:w-7 md:text-small20',
          numberClassName,
        )}
      >
        {number ?? 1}
      </div>
      <span
        className={twMerge(
          'flex items-center gap-2 text-small18 font-bold md:text-medium22',
          className,
        )}
      >
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
    <div className="flex items-start gap-2 text-xsmall14 font-semibold md:text-small20">
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
      className={twMerge(
        'w-full rounded-sm bg-white p-3 md:px-8 md:py-4',
        className,
      )}
    >
      {children}
    </div>
  );
});

const Badge = memo(function Badge({
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
      className={twMerge(
        'w-fit shrink-0 rounded-xxs px-2 py-1 text-xxsmall12 font-semibold text-white md:text-xsmall14',
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
});
