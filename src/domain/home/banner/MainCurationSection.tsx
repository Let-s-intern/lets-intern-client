'use client';

import { CurationType, useGetUserCuration } from '@/api/curation';
import { convertReportTypeToLandingPath, ReportType } from '@/api/report';
import { MMDD, YY_MM_DD } from '@/data/dayjsFormat';
import { getReportThumbnail } from '@/domain/mypage/credit/CreditListItem';
import dayjs from '@/lib/dayjs';
import { blogCategory } from '@/utils/convert';
import ProgramContainer from '../program/ProgramContainer';

export const getProgramThumbnail = ({
  type,
  reportType,
  thumbnail,
}: {
  type: CurationType;
  reportType: ReportType | null;
  thumbnail?: string;
}) => {
  if (type === 'REPORT') {
    return getReportThumbnail(reportType);
  }
  return thumbnail ?? '';
};

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
  startDate?: string;
  endDate?: string;
}) => {
  if (!startDate || !endDate) return undefined;

  if (type === 'LIVE' || type === 'CHALLENGE') {
    return `${dayjs(startDate).format(YY_MM_DD)} ~ ${dayjs(endDate).format(YY_MM_DD)}`;
  }
  return undefined;
};

export const getBadgeText = ({
  type,
  deadline,
  tagText,
}: {
  type: CurationType;
  deadline?: string;
  tagText?: string;
}) => {
  if (tagText) {
    return tagText;
  }

  if (type === 'REPORT') {
    return '48시간 이내 진단';
  }

  if (deadline) {
    return `~${dayjs(deadline).format(MMDD)} 모집 마감`;
  }
  return undefined;
};

export const getCreatedDate = ({
  type,
  createdAt,
}: {
  type: CurationType;
  createdAt?: string;
}) => {
  if (type !== 'BLOG' || !createdAt) return undefined;
  return dayjs(createdAt).format(YY_MM_DD) + ' 작성';
};

export const getCategory = ({
  type,
  category,
}: {
  type: CurationType;
  category?: string;
}) => {
  if (type !== 'BLOG' || !category) return undefined;
  return blogCategory[category];
};

export const getIsDeadline = ({ title }: { title: string }) => {
  return title.includes('마감');
};

const MainCurationSection = () => {
  const { data } = useGetUserCuration({
    locationType: 'UNDER_BANNER',
  });

  const curationList = data?.curationList.slice(0, 1);

  if (
    !curationList ||
    curationList.length === 0 ||
    curationList.every((c) => c.curationItemList.length === 0)
  )
    return null;

  return (
    <>
      <section className="mt-16 flex w-full max-w-[1120px] flex-col gap-y-5 md:mt-22.5">
        {curationList.map((curation, index) => (
          <ProgramContainer
            gaItem="curation_card"
            gaTitle={curation.curationInfo.title}
            key={'mainCuration' + index}
            title={curation.curationInfo.title}
            subTitle={curation.curationInfo.subTitle ?? undefined}
            moreUrl={curation.curationInfo.moreUrl ?? undefined}
            isDeadline={getIsDeadline({ title: curation.curationInfo.title })}
            programs={curation.curationItemList.map((item) => ({
              thumbnail: getProgramThumbnail({
                type: item.programType,
                reportType: item.reportType ?? null,
                thumbnail: item.thumbnail ?? undefined,
              }),
              title: item.title ?? '',
              url: getProgramUrl({
                type: item.programType,
                programId: item.programId ?? undefined,
                reportType: item.reportType ?? undefined,
                url: item.url ?? undefined,
              }),
              duration: getDuration({
                type: item.programType,
                startDate: item.startDate ?? undefined,
                endDate: item.endDate ?? undefined,
              }),
              badge: {
                text: getBadgeText({
                  type: item.programType,
                  deadline: item.deadline ?? undefined,
                  tagText: item.tag ?? undefined,
                }),
              },
              createdDate: getCreatedDate({
                type: item.programType,
                createdAt: item.programCreateDate ?? undefined,
              }),
              category: getCategory({
                type: item.programType,
                category: item.category ?? undefined,
              }),
            }))}
          />
        ))}
      </section>
    </>
  );
};

export default MainCurationSection;
