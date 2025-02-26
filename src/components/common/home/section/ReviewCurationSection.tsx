import { useGetUserCuration } from '@/api/curation';
import ProgramContainer from '../ProgramContainer';
import {
  getBadgeText,
  getCategory,
  getCreatedDate,
  getDuration,
  getProgramThumbnail,
  getProgramUrl,
} from './MainCurationSection';

const ReviewCurationSection = () => {
  const { data } = useGetUserCuration({
    locationType: 'UNDER_REVIEW',
  });

  if (!data) return null;

  return (
    <>
      <section className="mt-16 flex w-full max-w-[1160px] flex-col md:mt-36">
        <ProgramContainer
          title={data.curationInfo.title}
          subTitle={data.curationInfo.subTitle ?? undefined}
          moreUrl={data.curationInfo.moreUrl ?? undefined}
          programs={data.curationItemList.map((item) => ({
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
                tagText: item.tagText ?? undefined,
              }),
            },
            createdDate: getCreatedDate({
              type: item.programType,
              createdAt: item.createdAt ?? undefined,
            }),
            category: getCategory({
              type: item.programType,
              category: item.category ?? undefined,
            }),
          }))}
        />
      </section>
    </>
  );
};

export default ReviewCurationSection;
