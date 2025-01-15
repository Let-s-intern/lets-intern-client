import { ReportDetail } from '@/api/report';
import { ReactNode } from 'react';

const BASIC_INFO: Record<string, { title: string; content: ReactNode }[]> = {
  RESUME: [
    {
      title: '대상',
      content: <p>빠른 이력서 검토를 통해 서류 합격하고 싶은 누구나</p>,
    },
    {
      title: '진단 소요 시간',
      content: (
        <p>
          <span>48시간</span> 이내 진단 완료
        </p>
      ),
    },
    {
      title: '진행 방식',
      content: <p>{`온라인 제출 → 48시간 이내 진단 → 피드백 리포트 발송`}</p>,
    },
    {
      title: '피드백 리포트',
      content: <p>{`PDF 파일 제공(MY 진단서 보기에서 확인 가능)`}</p>,
    },
  ],
  PERSONAL_STATEMENT: [
    {
      title: '대상',
      content: <p>빠른 자기소개서 검토를 통해 서류 합격하고 싶은 누구나</p>,
    },
    {
      title: '진단 소요 시간',
      content: (
        <p>
          <span>48시간</span> 이내 진단 완료
        </p>
      ),
    },
    {
      title: '진행 방식',
      content: <p>{`온라인 제출 → 48시간 이내 진단 → 피드백 리포트 발송`}</p>,
    },
    {
      title: '피드백 리포트',
      content: <p>{`PDF 파일 제공(MY 진단서 보기에서 확인 가능)`}</p>,
    },
  ],
  PORTFOLIO: [
    {
      title: '대상',
      content: <p>빠른 포트폴리오 검토를 통해 서류 합격하고 싶은 누구나</p>,
    },
    {
      title: '진단 소요 시간',
      content: (
        <p>
          <span>48시간</span> 이내 진단 완료
        </p>
      ),
    },
    {
      title: '진행 방식',
      content: <p>{`온라인 제출 → 48시간 이내 진단 → 피드백 리포트 발송`}</p>,
    },
    {
      title: '피드백 리포트',
      content: <p>{`PDF 파일 제공(MY 진단서 보기에서 확인 가능)`}</p>,
    },
  ],
};

interface ReportBasicInfoProps {
  reportBasic: ReportDetail | null | undefined;
  color?: string;
}

const ReportBasicInfo = ({ reportBasic, color }: ReportBasicInfoProps) => {
  const thumbnail = () => {
    switch (reportBasic?.reportType) {
      case 'RESUME':
        return '/images/report/thumbnail_resume.png';
      case 'PERSONAL_STATEMENT':
        return '/images/report/thumbnail_personal.png';
      case 'PORTFOLIO':
        return '/images/report/thumbnail_portfolio.png';
      default:
        return '/images/report-thumbnail.png';
    }
  };

  const basicInfo = reportBasic?.reportType
    ? BASIC_INFO[reportBasic.reportType]
    : null;

  if (!reportBasic) {
    return <div>현재 개설된 진단 프로그램이 없습니다.</div>;
  }

  return (
    <div
      data-section="overview"
      className="flex w-full flex-col gap-y-6 md:gap-y-4"
    >
      <div className="flex w-full items-center justify-center bg-black md:rounded-md">
        <img
          src={thumbnail()}
          alt="리포트 썸네일"
          className="h-auto w-full object-cover md:w-3/5 md:rounded-md"
        />
      </div>
      <div
        className="flex w-full flex-col gap-3 md:flex-row md:items-stretch"
        style={{ color: color ?? 'white' }}
      >
        {basicInfo && (
          <div className="flex w-full flex-col gap-y-5 rounded-md border border-white/10 bg-neutral-0/75 px-4 py-5 md:flex-row md:gap-x-3 md:border-none md:bg-transparent md:p-0">
            <div className="flex w-full flex-col gap-y-5 md:flex-1 md:rounded-md md:border md:border-white/10 md:bg-neutral-0/75 md:px-4 md:py-5">
              {basicInfo.slice(0, 2).map((info, index) => (
                <ReportBasicRow
                  key={index}
                  title={info.title}
                  content={info.content}
                />
              ))}
            </div>
            <div className="flex w-full flex-col gap-y-5 md:flex-1 md:rounded-md md:border md:border-white/10 md:bg-neutral-0/75 md:px-4 md:py-5">
              {basicInfo.slice(2).map((info, index) => (
                <ReportBasicRow
                  key={index}
                  title={info.title}
                  content={info.content}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportBasicInfo;

const ReportBasicRow = ({
  title,
  content,
}: {
  title: string;
  content: ReactNode;
}) => {
  return (
    <div className="flex w-full flex-col gap-y-2">
      <span className="text-xsmall14 font-semibold md:text-xsmall16">
        {title}
      </span>
      <div className="whitespace-pre-wrap break-words text-xsmall14 font-medium text-white md:text-xsmall16">
        {content}
      </div>
    </div>
  );
};
