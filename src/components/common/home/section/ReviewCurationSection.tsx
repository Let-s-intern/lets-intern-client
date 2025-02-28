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

  const reviewCurationList = data?.curationList.slice(0, 4);

  if (!reviewCurationList || reviewCurationList.length === 0) return null;

  return (
    <>
      <section className="md:gap-y-21 md:mt-22.5 mt-16 flex w-full max-w-[1120px] flex-col gap-y-16">
        {reviewCurationList.map((curation, index) => (
          <ProgramContainer
            gaItem="home_blogreview"
            gaTitle={curation.curationInfo.title}
            key={'reviewCuration' + index}
            title={curation.curationInfo.title}
            subTitle={curation.curationInfo.subTitle ?? undefined}
            moreUrl={curation.curationInfo.moreUrl ?? undefined}
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

export default ReviewCurationSection;
