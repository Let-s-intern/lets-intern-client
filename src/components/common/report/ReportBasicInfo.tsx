import { ReportDetail } from '@/api/report';
import { REPORT_PROCESS } from '@/data/reportConstant';
import { ReactNode } from 'react';

export const BASIC_INFO: Record<
  string,
  { title: string; content: ReactNode }[]
> = {
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
      content: <p>{`온라인 제출 -> 48시간 이내 진단 -> 첨삭 리포트 발송`}</p>,
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
      content: <p>{`온라인 제출 -> 48시간 이내 진단 -> 첨삭 리포트 발송`}</p>,
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
      content: <p>{`온라인 제출 -> 48시간 이내 진단 -> 첨삭 리포트 발송`}</p>,
    },
  ],
};

interface ReportBasicInfoProps {
  reportBasic: ReportDetail | null | undefined;
}

const ReportBasicInfo = ({ reportBasic }: ReportBasicInfoProps) => {
  const thumbnail = () => {
    switch (reportBasic?.reportType) {
      case 'RESUME':
        return '/images/report-thumbnail.png';
      case 'PERSONAL_STATEMENT':
        return '/images/report-thumbnail.png';
      case 'PORTFOLIO':
        return '/images/report-thumbnail.png';
      default:
        return '/images/report-thumbnail.png';
    }
  };

  const basicInfo = reportBasic?.reportType
    ? BASIC_INFO[reportBasic.reportType]
    : null;

  const process = reportBasic?.reportType
    ? REPORT_PROCESS[reportBasic.reportType]
    : null;

  if (!reportBasic) {
    return <div>현재 개설된 진단 프로그램이 없습니다.</div>;
  }

  return (
    <div className="flex w-full flex-col gap-y-6">
      <div className="flex w-full items-center justify-center bg-neutral-70">
        <img
          src={thumbnail()}
          alt="리포트 썸네일"
          className="aspect-[4/3] h-auto w-full rounded-md object-contain md:w-3/5"
        />
      </div>
      <div className="flex w-full flex-col gap-3 md:flex-row md:items-stretch">
        {basicInfo && (
          <div className="flex w-full flex-col gap-y-5 rounded-md bg-neutral-95 px-4 py-5 md:flex-1">
            {basicInfo.map((info, index) => (
              <ReportBasicRow
                key={index}
                title={info.title}
                content={info.content}
              />
            ))}
          </div>
        )}
        {process && (
          <div className="flex w-full flex-col gap-y-3 rounded-md bg-neutral-95 px-4 py-5 md:flex-1">
            <span className="whitespace-pre-wrap break-words text-xsmall14 font-semibold text-primary md:text-xsmall16">{`진단 후, 서류 합격에 한걸음 더 가까워질 거예요.`}</span>
            {process.map((process, index) => (
              <ReportProcessRow key={index} index={index} process={process} />
            ))}
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
      <span className="text-xsmall14 font-semibold text-primary md:text-xsmall16">
        {title}
      </span>
      <div className="whitespace-pre-wrap break-words text-xsmall14 font-medium text-neutral-0 md:text-xsmall16">
        {content}
      </div>
    </div>
  );
};

const ReportProcessRow = ({
  index,
  process,
}: {
  index: number;
  process: string;
}) => {
  return (
    <div className="flex w-full items-center gap-x-2">
      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xxsmall12 font-medium text-white">
        {index + 1}
      </span>
      <p className="whitespace-pre-wrap break-words text-xsmall14 font-medium text-neutral-0 md:text-xsmall16">
        {process}
      </p>
    </div>
  );
};
