import { CurationType, useGetUserCuration } from '@/api/curation';
import {
  convertReportTypeToDisplayName,
  convertReportTypeToLandingPath,
  ReportType,
} from '@/api/report';
import { MMDD, YY_MM_DD } from '@/data/dayjsFormat';
import dayjs from '@/lib/dayjs';
import ProgramContainer from '../ProgramContainer';

export const getProgramUrl = ({
  type,
  programId,
  reportType,
  url,
}: {
  type: CurationType;
  programId?: number;
  reportType?: ReportType;
  url?: string;
}) => {
  switch (type) {
    case 'CHALLENGE':
      return `/program/challenge/${programId}`;
    case 'LIVE':
      return `/program/live/${programId}`;
    case 'VOD':
      return url ?? '';
    case 'REPORT':
      return reportType
        ? `${convertReportTypeToLandingPath(reportType)}${programId ? `/${programId}` : ''}`
        : '';
    case 'BLOG':
      return `/blog/${programId}`;
    case 'ETC':
      return url ?? '';
    default:
      return '';
  }
};

export const getDuration = ({
  type,
  startDate,
  endDate,
}: {
  type: CurationType;
  startDate: string;
  endDate: string;
}) => {
  if (type === 'LIVE' || type === 'CHALLENGE') {
    return `${dayjs(startDate).format(YY_MM_DD)} ~ ${dayjs(endDate).format(YY_MM_DD)}`;
  }
  return undefined;
};

export const getBadgeText = ({
  type,
  reportType,
  deadline,
}: {
  type: CurationType;
  reportType?: ReportType;
  deadline?: string;
}) => {
  if (type !== 'REPORT' && deadline) {
    return `~${dayjs(deadline).format(MMDD)} 모집 마감`;
  }
  if (type === 'REPORT' && reportType) {
    return convertReportTypeToDisplayName(reportType);
  }
  return undefined;
};

const MainCurationSection = () => {
  const { data } = useGetUserCuration({
    locationType: 'UNDER_BANNER',
  });

  return (
    <>
      <section className="mt-16 flex w-full max-w-[1160px] flex-col md:mt-24">
        {!data ? null : (
          <ProgramContainer
            title={data.curationInfo.title}
            subTitle={data.curationInfo.subTitle ?? undefined}
            moreUrl={data.curationInfo.moreUrl ?? undefined}
            showImminentList={data.curationInfo.showImminentList}
            programs={data.curationItemList.map((item) => ({
              thumbnail: item.thumbnail ?? '',
              title: item.title ?? '',
              url: getProgramUrl({
                type: item.programType,
                programId: item.programId ?? undefined,
                reportType: item.reportType ?? undefined,
                url: item.url ?? undefined,
              }),
              duration: getDuration({
                type: item.programType,
                startDate: data.curationInfo.startDate,
                endDate: data.curationInfo.endDate,
              }),
              badge: {
                text: getBadgeText({
                  type: item.programType,
                  reportType: item.reportType ?? undefined,
                  deadline: data.curationInfo.endDate,
                }),
              },
            }))}
          />
        )}
      </section>
    </>
  );
};

export default MainCurationSection;
